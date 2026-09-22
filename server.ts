import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

const AUDIT_SYSTEM_INSTRUCTION = `You are an elite Principal UX Ethics Auditor and Cyber-Safety Compliance Inspector, specializing in forensic multimodal analysis of user interfaces.
Perform a rigorous audit of the provided UI screenshot to detect, classify, and explain deceptive design tactics known as "Dark Patterns."

METHODOLOGY & REASONING:
1. Visual Hierarchy: Analyze color contrast, element sizing, and spatial relationships.
2. Microcopy Audit: Scrutinize all text for emotional manipulation, artificial urgency, or confusing phrasing.
3. State Inference: Detect pre-checked boxes, forced toggles, or obfuscated opt-out paths.

STRICT TAXONOMY TO ENFORCE:
Only identify these 8 deceptive tactics:
- Confirmshaming: Guilt-tripping or emotionally manipulative text for opting out.
- Fake Scarcity / Urgency: Fabricated stock counters, countdown clocks, or artificial demand alerts.
- Hidden Costs / Drip Pricing: Unannounced service fees, forced additions, or dynamic surcharges.
- Sneak into Basket: Unchecked or pre-selected add-ons.
- Roach Motel: Complex, obfuscated paths designed to prevent account cancellation.
- Disguised Ads: Advertisements styled indistinguishably from native site navigation.
- Forced Continuity: Subscription sign-ups lacking transparent cancellation disclosure.
- Trick Questions: Double negatives or confusing UI switches in consent forms.

NEGATIVE CONSTRAINTS (DO NOT FLAG):
- Do not flag standard UI conventions.
- Do not flag transparent shipping breakdowns or standard taxes.
- Do not flag standard button color hierarchies (primary vs secondary contrast).
- Do not flag standard promotional banners or newsletter opt-ins with a clear, accessible close button.

OUTPUT RULES & GUARDRAILS:
1. INPUT VALIDATION: If the provided image is not a software UI, website, or app screenshot (e.g., a photo, meme, landscape, person, or document), return darkPatternScore: 0, severity: "Low", patternsDetected: [], and set the field "error": "Not a UI screenshot".
2. PATTERN CAP: Return a maximum of 5 patterns, sorted by confidence descending.
3. ETHICAL UI: If the UI is ethical and clean, return a darkPatternScore of 0, severity "Low", and an empty patternsDetected array.
4. FORMAT: Return ONLY the raw JSON object conforming strictly to the requested schema. No preamble, no explanation, no markdown code fences.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    darkPatternScore: {
      type: Type.INTEGER,
      description: 'Aggregated deception risk index from 0 to 100',
    },
    severity: {
      type: Type.STRING,
      enum: ['Low', 'Medium', 'High'],
      description: 'Risk classification level: Low (0-25), Medium (26-60), High (61-100)',
    },
    error: {
      type: Type.STRING,
      description: 'Error message if the image is invalid or not a UI',
    },
    patternsDetected: {
      type: Type.ARRAY,
      description: 'Maximum of 5 patterns, ordered by confidence descending',
      items: {
        type: Type.OBJECT,
        properties: {
          patternType: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          flaggedElement: { type: Type.STRING },
          quoteOrVisualClue: { type: Type.STRING },
          deceptiveTactic: { type: Type.STRING },
          ethicalAlternative: { type: Type.STRING },
        },
        required: [
          'patternType',
          'confidence',
          'flaggedElement',
          'quoteOrVisualClue',
          'deceptiveTactic',
          'ethicalAlternative',
        ],
      },
    },
  },
  required: ['darkPatternScore', 'severity', 'patternsDetected'],
};

// Health Check Routes
const healthPayload = {
  status: 'active',
  primaryModel: 'gemini-1.5-pro',
  fallbackModel: 'gemini-1.5-flash',
};
app.get('/api/health', (req, res) => {
  res.json(healthPayload);
});
app.get('/health', (req, res) => {
  res.json(healthPayload);
});

const AUDIT_PROMPT_TEXT =
  'Perform a forensic UX ethics audit of the provided UI screenshot to detect, classify, and explain deceptive design tactics known as Dark Patterns. Strict adherence to taxonomy is required.';

// Forensic Multimodal Audit Endpoint
app.post('/api/audit', async (req, res) => {
  const startTime = Date.now();
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing imageBase64 payload in request body',
      });
    }

    // Sanitize base64 and extract mimeType if embedded
    let rawBase64 = imageBase64;
    let actualMime = mimeType;
    if (imageBase64.includes('base64,')) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        actualMime = match[1];
        rawBase64 = match[2];
      } else {
        rawBase64 = imageBase64.split('base64,')[1];
      }
    } else if (imageBase64.startsWith('data:image/svg+xml;utf8,')) {
      const svgText = decodeURIComponent(imageBase64.replace('data:image/svg+xml;utf8,', ''));
      rawBase64 = Buffer.from(svgText, 'utf-8').toString('base64');
      actualMime = 'image/svg+xml';
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
      });
    }

    const client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let rawText = '';
    let selectedModel = 'gemini-1.5-pro';

    try {
      // Primary API call
      const response = await client.models.generateContent({
        model: 'gemini-1.5-pro',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: rawBase64, mimeType: actualMime } },
              { text: AUDIT_PROMPT_TEXT },
            ],
          },
        ],
        config: {
          systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.1,
        },
      });
      rawText = response.text?.trim() || '{}';
    } catch (primaryErr: any) {
      console.warn(`[Primary model gemini-1.5-pro error: ${primaryErr?.message}]. Falling back to Flash.`);
      selectedModel = 'gemini-1.5-flash';

      try {
        // Fallback API call
        const fallbackResponse = await client.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { data: rawBase64, mimeType: actualMime } },
                { text: AUDIT_PROMPT_TEXT },
              ],
            },
          ],
          config: {
            systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
            temperature: 0.1,
          },
        });
        rawText = fallbackResponse.text?.trim() || '{}';
      } catch (fallbackErr: any) {
        console.warn(`[Fallback model gemini-1.5-flash error: ${fallbackErr?.message}]. Engaging live backup.`);
        selectedModel = 'gemini-3.8-flash';
        try {
          const liveResponse = await client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { inlineData: { data: rawBase64, mimeType: actualMime } },
                  { text: AUDIT_PROMPT_TEXT },
                ],
              },
            ],
            config: {
              systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
              temperature: 0.1,
            },
          });
          rawText = liveResponse.text?.trim() || '{}';
        } catch (backupErr: any) {
          console.warn(`[gemini-3.8-flash error: ${backupErr?.message}]. Retrying with gemini-3.5-flash.`);
          selectedModel = 'gemini-3.5-flash';
          const altResponse = await client.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { inlineData: { data: rawBase64, mimeType: actualMime } },
                  { text: AUDIT_PROMPT_TEXT },
                ],
              },
            ],
            config: {
              systemInstruction: AUDIT_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
              temperature: 0.1,
            },
          });
          rawText = altResponse.text?.trim() || '{}';
        }
      }
    }

    // Gracefully catch any JSON parsing quirks
    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText
        .replace(/^```(json)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();
      parsed = JSON.parse(cleaned);
    }

    // Normalize and enforce rules
    const darkPatternScore = Math.max(0, Math.min(100, Math.round(Number(parsed.darkPatternScore) || 0)));
    let patternsDetected = Array.isArray(parsed.patternsDetected) ? parsed.patternsDetected.slice(0, 5) : [];

    // Sort by confidence descending
    patternsDetected.sort((a: any, b: any) => (Number(b.confidence) || 0) - (Number(a.confidence) || 0));

    // Derive severity: Green: Low 0-25, Amber: Medium 26-60, Red: High 61-100
    let severity: 'Low' | 'Medium' | 'High' = 'Low';
    if (darkPatternScore >= 61) {
      severity = 'High';
    } else if (darkPatternScore >= 26) {
      severity = 'Medium';
    }

    const duration = Date.now() - startTime;

    return res.json({
      success: true,
      data: {
        darkPatternScore,
        severity: parsed.severity || severity,
        ...(parsed.error ? { error: parsed.error } : {}),
        patternsDetected,
        auditTimestamp: new Date().toISOString(),
        analyzedModel: selectedModel,
        executionTimeMs: duration,
      },
    });
  } catch (error: any) {
    console.error('Audit processing error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to complete forensic multimodal analysis.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[UX Ethics Auditor] Listening on port ${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();

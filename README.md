# DarkWatch AI | Cyber-Safety Dark Pattern Auditor
**A PromptWars x Gen AI Club Hackathon Submission**

## 🚨 The Problem Statement
Job seekers and internet users lose millions to fake appointment letters, hidden fees, and deceptive UI designs. Deceptive site layouts (Dark Patterns) trick users into paying extra through pre-checked boxes, fake urgency, and disguised ads. 

## 💡 The Solution
DarkWatch AI is a multimodal security scanner built with **Next.js**, **React**, and the **Gemini 1.5 Pro API**. 
Instead of relying on rigid URL scraping, our app allows users to upload a screenshot of any suspicious software interface. Gemini 1.5 Pro visually inspects the layout, microcopy, and UI hierarchy to generate a structured **Deception Threat Index (0-100%)**.

### Core Technical Architecture
- **Frontend:** React + Tailwind CSS (High-contrast accessible dark mode)
- **Backend:** Node.js serverless API routes
- **AI Engine:** `@google/genai` SDK using `gemini-1.5-pro` with a strictly enforced structured JSON output schema.
- **Client-Side Optimization:** HTML5 Canvas image compression guarantees payloads remain under Vercel/Cloud Run limits.

## 🎯 Deception Score Methodology
The API returns a strictly categorized JSON response mapping to known FTC digital ethics violations:
- **0–25 (Low):** Transparent UI. Standard, ethical marketing conventions.
- **26–60 (Medium):** Coercive architecture (e.g., Confirmshaming, Sneak into Basket).
- **61–100 (High):** Predatory manipulation (e.g., Roach Motel, Fake Scarcity, Forced Continuity).

## 🚀 Run Locally
1. Clone this repository.
2. Run `npm install`.
3. Create a `.env.local` file and add your `GEMINI_API_KEY`.
4. Run `npm run dev` to start the local inspector.

*Built for #promptwars*
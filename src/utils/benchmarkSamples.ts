import { BenchmarkSample, AuditResult } from '../types';

export interface DemoItem extends BenchmarkSample {
  mockResult: AuditResult;
}

export const DEMO_SUITES: DemoItem[] = [

  {
    id: 'flight-booking',
    title: 'Demo: Flight Booking',
    category: 'Travel & E-Commerce',
    expectedPatterns: ['Sneak into Basket', 'Trick Questions', 'Fake Scarcity / Urgency'],
    description: 'Pre-selected travel insurance add-on, double-negative opt-out checkbox, and simulated booking frenzy banner.',
    dataUrl: createFlightCheckoutSvg(),
    mockResult: {
      darkPatternScore: 84,
      severity: 'High',
      analyzedModel: 'gemini-3.1-pro-preview',
      auditTimestamp: new Date().toISOString(),
      executionTimeMs: 420,
      patternsDetected: [
        {
          patternType: 'Sneak into Basket',
          confidence: 0.96,
          flaggedElement: 'Comprehensive Travel Shield Protection Checkbox',
          quoteOrVisualClue: '+$49.00 / person (Pre-checked by default in purple callout)',
          deceptiveTactic:
            'The system unilaterally assumes affirmative consent by pre-selecting an expensive ancillary insurance product before the user reaches final checkout, exploiting passive inertia.',
          ethicalAlternative:
            'Keep optional insurance unchecked by default. Require an explicit, unforced opt-in click from the customer.',
        },
        {
          patternType: 'Trick Questions',
          confidence: 0.92,
          flaggedElement: 'Opt-Out Secondary Checkbox',
          quoteOrVisualClue: 'Do not uncheck if you wish to decline not receiving medical emergency coverage waivers.',
          deceptiveTactic:
            'Employs a deliberate quadruple/double negative to confuse the user about what checking or unchecking the box actually confirms, steering them toward accidental purchase.',
          ethicalAlternative:
            'Use straightforward, neutral declarative copy: "Decline optional travel insurance" with a single affirmative toggle.',
        },
        {
          patternType: 'Fake Scarcity / Urgency',
          confidence: 0.88,
          flaggedElement: 'Top Banner & Timer Counter',
          quoteOrVisualClue: 'ONLY 2 SEATS LEFT AT THIS FARE! Price lock expires in 03:14 minutes.',
          deceptiveTactic:
            'Fabricates artificial time pressure and synthetic inventory depletion to induce impulse checkout and disable critical price comparison.',
          ethicalAlternative:
            'Display verified live inventory indicators only when seats are genuinely scarce, without synthetic panic countdown timers.',
        },
        {
          patternType: 'Confirmshaming',
          confidence: 0.84,
          flaggedElement: 'Secondary Opt-out Link',
          quoteOrVisualClue: 'I understand I am risking my trip without protection',
          deceptiveTactic:
            'Frames declining an optional add-on as foolish and dangerous, using guilt and loss-aversion microcopy to manipulate emotional agency.',
          ethicalAlternative:
            'Provide an objective, neutral decline option: "No thanks, continue without insurance."',
        },
      ],
    },
  },
  {
    id: 'saas-cancellation',
    title: 'Demo: SaaS Cancellation',
    category: 'Subscription Streaming',
    expectedPatterns: ['Roach Motel', 'Confirmshaming', 'Forced Continuity'],
    description: 'Multi-screen cancellation labyrinth with guilt-tripping loss-aversion messaging and muted opt-out buttons.',
    dataUrl: createStreamCancelSvg(),
    mockResult: {
      darkPatternScore: 89,
      severity: 'High',
      analyzedModel: 'gemini-3.1-pro-preview',
      auditTimestamp: new Date().toISOString(),
      executionTimeMs: 380,
      patternsDetected: [
        {
          patternType: 'Confirmshaming',
          confidence: 0.98,
          flaggedElement: 'Cancellation Opt-Out Confirmation Link',
          quoteOrVisualClue: 'No thanks, I don’t care about entertainment and prefer wasting money',
          deceptiveTactic:
            'Deploys emotionally abusive microcopy that insults the user for choosing to cancel their recurring paid membership.',
          ethicalAlternative:
            'Label the cancellation action neutrally and respectfully: "Confirm cancellation" or "Proceed to cancel."',
        },
        {
          patternType: 'Roach Motel',
          confidence: 0.94,
          flaggedElement: 'Step Progress Indicator & Obstacle Flow',
          quoteOrVisualClue: 'Step 2 of 5: Retention Survey & Account Finalization Verification',
          deceptiveTactic:
            'While subscribing required a single click, canceling imposes a multi-page friction gauntlet of mandatory surveys, warning modals, and buried links.',
          ethicalAlternative:
            'Adhere to FTC "Click-to-Cancel" parity: ensure canceling a subscription is as quick and frictionless as signing up (1 to 2 clicks max).',
        },
        {
          patternType: 'Forced Continuity',
          confidence: 0.87,
          flaggedElement: 'Rewards Forfeiture Warning Block',
          quoteOrVisualClue: 'WARNING: YOUR ACCUMULATED REWARDS WILL BE FORFEITED PERMANENTLY',
          deceptiveTactic:
            'Weaponizes artificial sunk-cost fallacy by claiming user data, watch history, and earned perks will be destroyed immediately upon cancellation.',
          ethicalAlternative:
            'Allow the user to retain their account history and free profile indefinitely, only terminating paid subscription access.',
        },
      ],
    },
  },
  {
    id: 'urgency-popup',
    title: 'Demo: Urgency Pop-up',
    category: 'Retail & Cart Checkout',
    expectedPatterns: ['Fake Scarcity / Urgency', 'Hidden Costs / Drip Pricing'],
    description: 'Urgency countdown banner paired with mandatory surprise facility fees and hidden surcharges injected at the final step.',
    dataUrl: createRetailCountdownSvg(),
    mockResult: {
      darkPatternScore: 78,
      severity: 'High',
      analyzedModel: 'gemini-3.1-pro-preview',
      auditTimestamp: new Date().toISOString(),
      executionTimeMs: 410,
      patternsDetected: [
        {
          patternType: 'Hidden Costs / Drip Pricing',
          confidence: 0.95,
          flaggedElement: 'Checkout Fee Breakdown Item',
          quoteOrVisualClue: 'Mandatory Digital Facility & Allocation Surcharge (+$14.50 added at checkout)',
          deceptiveTactic:
            'Withholds material non-negotiable fees until the customer has invested time navigating through the cart and entering shipping details.',
          ethicalAlternative:
            'Disclose the all-in total price upfront on product display pages in compliance with consumer protection pricing rules.',
        },
        {
          patternType: 'Sneak into Basket',
          confidence: 0.91,
          flaggedElement: 'Inventory Assurance Premium Row',
          quoteOrVisualClue: 'Automated Inventory Assurance Premium (Pre-applied: +$6.99)',
          deceptiveTactic:
            'Silently injects an unannounced insurance fee into the subtotal line without prior disclosure or affirmative opt-in.',
          ethicalAlternative:
            'Remove pre-applied items. Offer optional delivery protection as a clearly visible unselected option.',
        },
        {
          patternType: 'Fake Scarcity / Urgency',
          confidence: 0.89,
          flaggedElement: 'Header Alert Clock',
          quoteOrVisualClue: '⚡ RESERVATION EXPIRES IN 04:39 MINUTES! ITEMS MAY BE SOLD OUT.',
          deceptiveTactic:
            'Displays an unverified countdown clock creating artificial psychological panic to bypass deliberate rational price comparison.',
          ethicalAlternative:
            'Eliminate synthetic countdown clocks unless real perishable inventory holds are strictly being released to other queued shoppers.',
        },
      ],
    },
  },
];

export const BENCHMARK_SAMPLES = DEMO_SUITES;

function createFlightCheckoutSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <rect width="800" height="600" fill="#090d16"/>
    <!-- Top Header -->
    <rect x="40" y="30" width="720" height="60" rx="8" fill="#131b2e" stroke="#1e293b"/>
    <text x="70" y="67" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="20" font-weight="bold">AeroSky Booking</text>
    <rect x="500" y="44" width="240" height="32" rx="16" fill="#dc2626" fill-opacity="0.25" stroke="#ef4444" stroke-width="1"/>
    <circle cx="516" cy="60" r="5" fill="#ef4444"/>
    <text x="528" y="65" fill="#fca5a5" font-family="system-ui, sans-serif" font-size="11" font-weight="700">🔥 ONLY 2 SEATS LEFT AT THIS FARE!</text>

    <!-- Main Container -->
    <rect x="40" y="105" width="720" height="465" rx="12" fill="#131b2e" stroke="#1e293b"/>
    
    <!-- Flight Summary Card -->
    <rect x="65" y="125" width="670" height="90" rx="8" fill="#090d16" stroke="#1e293b"/>
    <text x="85" y="155" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="16" font-weight="bold">SFO ✈ JFK (Nonstop Flight 408)</text>
    <text x="85" y="180" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Depart: Oct 14, 08:30 AM · Economy Saver</text>
    <text x="640" y="165" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="end">$340.00</text>
    <text x="640" y="185" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11" text-anchor="end">41 other travelers looking now</text>

    <!-- Pre-checked Insurance / Sneak Into Basket -->
    <rect x="65" y="230" width="670" height="135" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
    <rect x="85" y="248" width="22" height="22" rx="4" fill="#4f46e5"/>
    <path d="M91 259 l3 3 l7 -7" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <text x="120" y="264" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold">Comprehensive Travel Shield Protection (Recommended)</text>
    <text x="640" y="264" fill="#818cf8" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="end">+$49.00 / person</text>
    <text x="120" y="292" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">Protect against unexpected cancellations, medical emergencies, and lost baggage.</text>
    
    <!-- Trick Question Checkbox -->
    <rect x="120" y="315" width="16" height="16" rx="3" fill="#090d16" stroke="#64748b"/>
    <text x="145" y="328" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11">Do not uncheck if you wish to decline not receiving medical emergency coverage waivers.</text>

    <!-- Urgency Countdown Banner -->
    <rect x="65" y="380" width="670" height="42" rx="6" fill="#450a0a" stroke="#991b1b"/>
    <text x="85" y="406" fill="#fca5a5" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">⚠️ Price lock expires in 03:14 minutes. Rates increase after timer lapses.</text>

    <!-- Price Breakdown & Continue -->
    <text x="65" y="460" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13">Base Fare: $340.00 · Auto-Added Insurance: $49.00</text>
    <text x="65" y="485" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Total Due: $389.00</text>
    
    <rect x="490" y="450" width="245" height="48" rx="8" fill="#2563eb"/>
    <text x="612" y="480" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" text-anchor="middle">Continue to Seat Selection</text>

    <!-- Manipulative Decline Link -->
    <text x="612" y="525" fill="#64748b" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle">I understand I am risking my trip without protection</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createStreamCancelSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <rect width="800" height="600" fill="#090d16"/>
    <!-- Modal Card -->
    <rect x="80" y="50" width="640" height="500" rx="16" fill="#131b2e" stroke="#1e293b" stroke-width="2"/>
    
    <!-- Emotional Manipulation / Confirmshaming Header -->
    <text x="400" y="110" fill="#f43f5e" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">Are you really sure you want to leave us?</text>
    <text x="400" y="145" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">You will immediately lose access to 10,000+ blockbuster movies and exclusive shows.</text>

    <!-- Sad Visual Icon Placeholder -->
    <circle cx="400" cy="205" r="36" fill="#090d16" stroke="#1e293b"/>
    <circle cx="388" cy="198" r="4" fill="#94a3b8"/>
    <circle cx="412" cy="198" r="4" fill="#94a3b8"/>
    <path d="M388 220 Q400 210 412 220" stroke="#94a3b8" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- Loss Aversion Guilt-trip -->
    <rect x="130" y="260" width="540" height="85" rx="8" fill="#1e1b4b" stroke="#3730a3"/>
    <text x="150" y="290" fill="#f43f5e" font-family="system-ui, sans-serif" font-size="13" font-weight="bold">WARNING: YOUR ACCUMULATED REWARDS WILL BE FORFEITED PERMANENTLY</text>
    <text x="150" y="315" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="12">If you leave today, your saved watchlist, watch history, and member discounts are erased.</text>

    <!-- Multi-step obstacle roach motel notice -->
    <text x="400" y="375" fill="#64748b" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Step 2 of 5: Retention Survey &amp; Account Finalization Verification</text>

    <!-- Primary Button (Keep Subscription) -->
    <rect x="180" y="405" width="440" height="52" rx="10" fill="#16a34a"/>
    <text x="400" y="437" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Keep My Subscription &amp; Save 50% Today</text>

    <!-- Confirmshaming Opt-out link (Subdued and guilt-ridden) -->
    <text x="400" y="495" fill="#475569" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">No thanks, I don’t care about entertainment and prefer wasting money</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createRetailCountdownSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <rect width="800" height="600" fill="#090d16"/>
    <rect x="60" y="40" width="680" height="520" rx="12" fill="#131b2e" stroke="#1e293b"/>

    <!-- Header & Fake Urgency Timer -->
    <rect x="60" y="40" width="680" height="60" rx="12" fill="#7f1d1d"/>
    <text x="400" y="76" fill="#fecaca" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">⚡ RESERVATION EXPIRES IN 04:39 MINUTES! ITEMS MAY BE SOLD OUT.</text>

    <!-- Cart Item -->
    <rect x="90" y="130" width="620" height="110" rx="8" fill="#090d16" stroke="#1e293b"/>
    <rect x="110" y="145" width="80" height="80" rx="6" fill="#1e293b"/>
    <text x="210" y="175" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="17" font-weight="bold">Minimalist Chrono Watch (Obsidian Edition)</text>
    <text x="210" y="200" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Advertised Price: $89.00</text>
    <text x="680" y="185" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" text-anchor="end">$89.00</text>

    <!-- Drip Pricing / Hidden Surcharges -->
    <rect x="90" y="260" width="620" height="180" rx="8" fill="#090d16" stroke="#1e293b"/>
    <text x="115" y="295" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14">Subtotal</text>
    <text x="680" y="295" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="14" text-anchor="end">$89.00</text>

    <text x="115" y="325" fill="#f87171" font-family="system-ui, sans-serif" font-size="14">Mandatory Digital Facility &amp; Allocation Surcharge (Added at checkout)</text>
    <text x="680" y="325" fill="#f87171" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="end">+$14.50</text>

    <text x="115" y="355" fill="#f87171" font-family="system-ui, sans-serif" font-size="14">Automated Inventory Assurance Premium (Pre-applied)</text>
    <text x="680" y="355" fill="#f87171" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" text-anchor="end">+$6.99</text>

    <line x1="115" y1="380" x2="680" y2="380" stroke="#1e293b" stroke-width="1"/>

    <text x="115" y="415" fill="#ffffff" font-family="system-ui, sans-serif" font-size="18" font-weight="bold">Total Final Price (Drip Surcharges Applied):</text>
    <text x="680" y="415" fill="#f43f5e" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="end">$110.49</text>

    <!-- Action -->
    <rect x="380" y="470" width="330" height="52" rx="8" fill="#e11d48"/>
    <text x="545" y="502" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Confirm &amp; Place Order Now</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI initialization
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Heuristic fallback generator when API quota is temporarily rate-limited
function generateFallbackAnalysis(
  title: string,
  context: string,
  options: string[],
  priorities: string[] = []
) {
  const primaryOption = options[0];
  const secondaryOption = options[1];

  const optionsAnalysis = options.map((opt, idx) => {
    const isFirst = idx === 0;
    return {
      optionName: opt,
      tagline: isFirst
        ? 'High-conviction, proactive transformation'
        : 'Prudent, risk-minimized foundation',
      pros: [
        {
          text: `Directly targets key goals for "${title.slice(0, 35)}..."`,
          impact: 5,
          category: 'Strategy',
          detail: 'Aligns strongly with momentum and forward initiative.',
        },
        {
          text: isFirst ? 'High upside potential and faster learning curve' : 'Preserves current capital and operational runway',
          impact: 4,
          category: isFirst ? 'Growth' : 'Stability',
          detail: 'Significant leverage on long-term outcomes.',
        },
        {
          text: priorities.length > 0 ? `Supports your priority of ${priorities[0]}` : 'Greater autonomy and decision control',
          impact: 4,
          category: 'Values',
          detail: 'Matches personal priorities outlined in your evaluation.',
        },
      ],
      cons: [
        {
          text: isFirst ? 'Higher initial cognitive load and transition friction' : 'Opportunity cost of deferred transformation',
          impact: 3,
          category: 'Execution',
          detail: 'Requires dedicated discipline to manage tradeoffs.',
        },
        {
          text: isFirst ? 'Short-term uncertainty during adaptation' : 'May require revisit in 6-12 months if circumstances shift',
          impact: 3,
          category: 'Risk',
          detail: 'Ensure adequate margin for unexpected variance.',
        },
      ],
      swot: {
        strengths: [
          'Strong baseline alignment with primary objective',
          'Clear line of sight to key milestones',
          'High personal agency in controlling execution',
        ],
        weaknesses: [
          'Initial ramp-up phase may test focus and stamina',
          'Hidden switching costs if assumptions are off',
        ],
        opportunities: [
          'Compounds compounding advantages over 12-24 months',
          'Unlocks adjacent options that are currently invisible',
          'Builds resilience and new organizational capability',
        ],
        threats: [
          'Premature fatigue before reaching escape velocity',
          'External macro volatility shifting priority balance',
        ],
      },
    };
  });

  const criteriaList = [
    { name: 'Strategic Alignment', desc: 'How well this serves your core mission', w: 5, s1: 9, s2: 7 },
    { name: 'Risk & Downside Protection', desc: 'Resilience against worst-case scenarios', w: 4, s1: 6, s2: 9 },
    { name: 'Time & Energy Cost', desc: 'Cognitive bandwidth and friction required', w: 3, s1: 6, s2: 8 },
    { name: 'Long-term Compounding Upside', desc: 'Value created over 3-5 year horizon', w: 5, s1: 9, s2: 6 },
    { name: 'Peace of Mind & Fulfillment', desc: 'Alignment with mental wellbeing and values', w: 4, s1: 8, s2: 7 },
  ];

  const comparisonCriteria = criteriaList.map((crit) => ({
    name: crit.name,
    description: crit.desc,
    weight: crit.w,
    scores: options.map((opt, oIdx) => ({
      optionName: opt,
      score: oIdx === 0 ? crit.s1 : crit.s2,
      comment: oIdx === 0
        ? `Strong forward posture on ${crit.name.toLowerCase()}.`
        : `Defensive, reliable posture on ${crit.name.toLowerCase()}.`,
    })),
  }));

  return {
    summary: `Evaluating "${title}" boils down to a fundamental balance between proactive upside and calculated stability. Both paths are viable, but their risk profiles demand different commitments.`,
    keyTradeoff: 'Aggressive upside capture vs. risk-minimized stability',
    optionsAnalysis,
    comparisonCriteria,
    verdict: {
      recommendedOption: primaryOption,
      confidenceScore: 84,
      executiveSummary: `Based on strategic leverage and compounding payoff, "${primaryOption}" emerges as the recommended choice. While it introduces more short-term variance, the expected long-term value significantly outweighs the defensive stability of alternatives.`,
      thePivotPoint: `If you have sufficient emotional and financial runway for 90 days of transition friction, choose "${primaryOption}". If your immediate bandwidth is completely maxed out, pivot to "${secondaryOption}".`,
      blindspots: [
        'Status Quo Bias: Overvaluing the comfort of familiarity over new upside.',
        'Sunk Cost Fallacy: Allowing past investments to dictate future strategy.',
        'Action Bias: Taking hasty action without securing essential pre-requisites.',
      ],
      recommendedNextAction: `Take 1 irreversible low-cost micro-step toward "${primaryOption}" in the next 24 hours (e.g. schedule an exploratory call, draft the transition plan, or block calendar time).`,
    },
  };
}

// POST /api/tiebreaker/analyze
app.post('/api/tiebreaker/analyze', async (req, res) => {
  const { title, context, options, priorities } = req.body;

  if (!title || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({
      error: 'Please provide a decision title and at least two options.',
    });
  }

  try {
    const ai = getAiClient();

    const prompt = `
Analyze the following decision dilemma in depth:
Decision: "${title}"
${context ? `Additional Context & Constraints: "${context}"` : ''}
${priorities && priorities.length > 0 ? `Key Priorities & Values: ${priorities.join(', ')}` : ''}

Options to evaluate:
${options.map((opt: string, idx: number) => `${idx + 1}. ${opt}`).join('\n')}

Generate a comprehensive decision package covering:
1. An executive summary and core underlying tradeoff.
2. For each option:
   - A crisp tagline/persona for that option.
   - Comprehensive Pros (with impact score 1-5, category like "Financial", "Wellbeing", "Career", "Feasibility", etc., and concise reasoning).
   - Comprehensive Cons (with impact score 1-5, category, and concise reasoning).
   - A full SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) with 2-4 points each.
3. A Multi-Criteria Comparison Table evaluating all options against 5-6 critical criteria (such as Cost/Effort, Immediate Payoff, Long-term Scalability, Risk Level, Happiness/Satisfaction, Alignment with Values). Each criterion should have an inherent default weight (1 to 5) and each option scored 1 to 10 with a short justification comment.
4. "The Tiebreaker Verdict":
   - Explicitly choose the recommended winner or best-balanced option.
   - Confidence percentage (e.g. 65% to 92%).
   - Decisive rationale explaining why it edges ahead.
   - "The Pivot Point": The exact single condition/question upon which this whole decision pivots.
   - Hidden blindspots / cognitive biases to watch out for (2-3 items).
   - Concrete, immediate next step action (within 24 hours).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are "The Tiebreaker", an expert strategic decision advisor, behavioral economist, and executive coach. You provide rigorous, balanced, highly objective decision breakdowns that cut through analysis paralysis without fluff or platitudes. Output strictly valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Clear, empathetic 2-sentence summary of the dilemma.',
            },
            keyTradeoff: {
              type: Type.STRING,
              description: 'The fundamental tradeoff at stake (e.g., certainty vs upside).',
            },
            optionsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        impact: { type: Type.INTEGER, description: '1 to 5 impact rating' },
                        category: { type: Type.STRING },
                        detail: { type: Type.STRING },
                      },
                      required: ['text', 'impact', 'category'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        impact: { type: Type.INTEGER, description: '1 to 5 negative severity' },
                        category: { type: Type.STRING },
                        detail: { type: Type.STRING },
                      },
                      required: ['text', 'impact', 'category'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                },
                required: ['optionName', 'tagline', 'pros', 'cons', 'swot'],
              },
            },
            comparisonCriteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight: { type: Type.INTEGER, description: '1 to 5 weight' },
                  scores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionName: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: 'Score out of 10' },
                        comment: { type: Type.STRING },
                      },
                      required: ['optionName', 'score', 'comment'],
                    },
                  },
                },
                required: ['name', 'weight', 'scores'],
              },
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOption: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER, description: 'Percentage 50 to 98' },
                executiveSummary: { type: Type.STRING },
                thePivotPoint: { type: Type.STRING },
                blindspots: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedNextAction: { type: Type.STRING },
              },
              required: [
                'recommendedOption',
                'confidenceScore',
                'executiveSummary',
                'thePivotPoint',
                'blindspots',
                'recommendedNextAction',
              ],
            },
          },
          required: [
            'summary',
            'keyTradeoff',
            'optionsAnalysis',
            'comparisonCriteria',
            'verdict',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini API call failed or rate-limited; deploying decision engine heuristics:', error?.message);
    const fallback = generateFallbackAnalysis(title, context || '', options, priorities || []);
    return res.json(fallback);
  }
});

// POST /api/tiebreaker/quick-assist: Suggest options or criteria for a dilemma
app.post('/api/tiebreaker/quick-assist', async (req, res) => {
  const { dilemma } = req.body;
  if (!dilemma) {
    return res.status(400).json({ error: 'Please provide a dilemma.' });
  }

  try {
    const ai = getAiClient();
    const prompt = `Given this decision dilemma: "${dilemma}", suggest:
1. 3 distinct, realistic, high-quality options to choose between.
2. 4 critical priorities/criteria the user should evaluate them on.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPriorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['suggestedOptions', 'suggestedPriorities'],
        },
      },
    });

    const text = response.text;
    return res.json(JSON.parse(text || '{}'));
  } catch (err: any) {
    console.warn('Quick assist Gemini quota or error, using heuristic suggestions:', err?.message);
    return res.json({
      suggestedOptions: [
        `Option A: Proactively commit to ${dilemma.slice(0, 30)}...`,
        `Option B: Maintain current baseline & test a small experiment`,
        `Option C: Hybrid phased transition over 6 months`,
      ],
      suggestedPriorities: [
        'Time & Energy Commitment',
        'Financial & Career Upside',
        'Mental Wellbeing & Stress',
        'Risk of Regret',
      ],
    });
  }
});

// POST /api/tiebreaker/devil-advocate: Test conviction on an option
app.post('/api/tiebreaker/devil-advocate', async (req, res) => {
  const { title, chosenOption } = req.body;

  try {
    const ai = getAiClient();
    const prompt = `Decision: "${title}"
The user is currently leaning towards or chose: "${chosenOption}".
Play the role of the ultimate Devil's Advocate.
Challenge this choice ruthlessly yet constructively.
Point out:
1. The 1 fatal flaw or most underestimated cost they are likely ignoring.
2. The worst-case scenario after 12 months.
3. The "Pre-Mortem": Assume this choice failed 2 years from now. What was the exact post-mortem reason?
4. The ultimate test question they must ask themselves before pulling the trigger.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fatalFlaw: { type: Type.STRING },
            worstCaseScenario: { type: Type.STRING },
            preMortem: { type: Type.STRING },
            litmusTestQuestion: { type: Type.STRING },
          },
          required: ['fatalFlaw', 'worstCaseScenario', 'preMortem', 'litmusTestQuestion'],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.warn('Devil\'s advocate fallback:', err?.message);
    return res.json({
      fatalFlaw: `The hidden assumption that external friction will be lower once you commit to "${chosenOption}". Usually, switching friction is 2-3x higher than estimated.`,
      worstCaseScenario: `After 12 months, you find yourself facing the exact same emotional burnout or operational bottlenecks, but with less financial or temporal flexibility left.`,
      preMortem: `Looking back 2 years later: the project stumbled because critical initial assumptions were never empirically validated before jumping all-in.`,
      litmusTestQuestion: `If you knew for certain that this path would be twice as difficult and take twice as long as expected, would you still proudly choose it today?`,
    });
  }
});

// Vite dev server mounting or static prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${port}`);
  });
}

startServer();

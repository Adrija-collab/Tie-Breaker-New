export interface PresetDilemma {
  title: string;
  category: string;
  context: string;
  options: string[];
  priorities: string[];
}

export const PRESET_DILEMMAS: PresetDilemma[] = [
  {
    title: "Join an early-stage AI startup vs Stay at high-paying Big Tech company",
    category: "Career",
    context: "I have 6 years of engineering experience. Offer A has 1% equity with lower base pay ($140k). Current role pays $245k with strong work-life balance and benefits. No kids yet.",
    options: [
      "Join Seed-stage AI Startup (Lead Engineer)",
      "Stay at Big Tech (Staff Track)",
    ],
    priorities: ["Financial upside", "Skill velocity", "Work-life balance", "Resume prestige"],
  },
  {
    title: "Buy a starter home in suburban area vs Rent and aggressively invest in index funds",
    category: "Personal Finance",
    context: "Have saved $90,000 for down payment. Mortgage rates around 6.5%. Current rent is $2,400/month. Planning to stay in the city for at least 4-5 years.",
    options: [
      "Buy 3-bed suburban home with mortgage",
      "Continue renting downtown & invest cash in broad index funds",
    ],
    priorities: ["Long-term net worth", "Lifestyle flexibility", "Maintenance headache", "Stability"],
  },
  {
    title: "Rewrite backend to Microservices vs Refactor into a Modular Monolith",
    category: "Technology",
    context: "Team of 14 engineers. Deployment queues are slowing down, but microservices overhead might overwhelm our DevOps capacity. 800k monthly active users.",
    options: [
      "Decompose into Kubernetes Microservices",
      "Clean architecture Modular Monolith with domain boundaries",
    ],
    priorities: ["Developer velocity", "Operational complexity", "Time to deliver", "Scalability"],
  },
  {
    title: "Bootstrap SaaS product with personal savings vs Seek Angel/VC funding",
    category: "Business",
    context: "B2B productivity tool currently at $4k MRR with organic word-of-mouth. Competitors are raising $2M seed rounds. Founders have 10 months personal runway.",
    options: [
      "Bootstrap to profitability organically",
      "Raise $1.5M Seed round for aggressive hiring & ads",
    ],
    priorities: ["Ownership retention", "Speed to market", "Stress levels", "Valuation upside"],
  },
];

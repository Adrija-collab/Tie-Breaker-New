export interface ProConItem {
  text: string;
  impact: number; // 1 to 5
  category: string;
  detail?: string;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  optionName: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SWOTData;
}

export interface CriterionScore {
  optionName: string;
  score: number; // 1-10
  comment: string;
}

export interface ComparisonCriterion {
  name: string;
  description: string;
  weight: number; // 1-5 default
  scores: CriterionScore[];
}

export interface DecisionVerdict {
  recommendedOption: string;
  confidenceScore: number; // 0-100
  executiveSummary: string;
  thePivotPoint: string;
  blindspots: string[];
  recommendedNextAction: string;
}

export interface DecisionAnalysis {
  summary: string;
  keyTradeoff: string;
  optionsAnalysis: OptionAnalysis[];
  comparisonCriteria: ComparisonCriterion[];
  verdict: DecisionVerdict;
}

export interface DevilsAdvocateData {
  fatalFlaw: string;
  worstCaseScenario: string;
  preMortem: string;
  litmusTestQuestion: string;
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  title: string;
  context?: string;
  options: string[];
  priorities?: string[];
  analysis: DecisionAnalysis;
}

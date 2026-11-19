// ==============================================================================
// MicroCFO: AI Copilot & Risk Types
// ==============================================================================

export interface HiddenRiskItem {
  riskTitle: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  explanation: string;
  preventiveMitigation: string;
}

export interface TacticalDirective {
  title: string;
  expectedProfitImpact: string; // e.g. "+18% Net Margin"
  actionableStep: string;
}

export interface StressScenarioResult {
  scenarioName: string; // e.g. "Campus Exam Slump (-40% Volume)" or "Raw Material Price Spike (+25%)"
  adjustedMonthlyNetProfit: number;
  survivalStatus: "SURVIVES" | "BREAK_EVEN" | "INSOLVENT";
  cfoSurvivalAdvice: string;
}

export interface HustleAIAnalysisResponse {
  isMock: boolean;
  modelUsed: string;
  cfoExecutiveVerdict: string;
  sustainabilityScore: number; // 0 to 100
  hiddenRisks: HiddenRiskItem[];
  tacticalDirectives: TacticalDirective[];
  stressScenarios: StressScenarioResult[];
}

export interface ReceiptLineItem {
  name: string;
  quantity?: number;
  price: number;
}

export interface ReceiptScanResponse {
  isMock: boolean;
  merchantName: string;
  date: string;
  lineItems: ReceiptLineItem[];
  totalAmount: number;
  category: "VARIABLE_EXPENSE" | "FIXED_EXPENSE";
  taxOrFees: number;
  notes: string;
}

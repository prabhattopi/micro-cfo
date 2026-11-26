// ==============================================================================
// MicroCFO: Core Financial Types & Metrics
// ==============================================================================

export type CurrencyCode = "HKD" | "USD" | "INR" | "EUR" | "GBP";

export interface HustleInputs {
  name: string;
  category: string;
  currency: CurrencyCode;
  
  // Pricing & Direct Costs
  sellingPrice: number;            // P: Price charged to customer
  variableCostPerUnit: number;     // V: Direct raw materials, packaging, delivery per unit
  
  // Platform & Payment Friction
  platformFeePercent: number;      // e.g. 0.05 for 5% (Etsy, Stripe, Shopify, IG checkout)
  fixedPaymentFee: number;         // e.g. HK$2.50 per transaction
  
  // Fixed Monthly Overheads
  fixedMonthlyCosts: number;       // F: Subscriptions (Canva/Adobe), stall rent, equipment amort.
  
  // Labor & Capacity
  hoursPerUnit: number;            // Time invested per product or client delivery
  monthlyVolumeTarget: number;     // Q: Expected or target units sold per month
  
  // Capital & Runway
  initialCapital: number;          // Starting cash pool in bank / wallet
}

export type FinancialHealthGrade = "A+" | "A" | "B" | "C" | "D" | "F";

export interface FinancialAnalysis {
  // Revenue & Margins
  grossRevenue: number;            // P * Q
  totalVariableCosts: number;      // V * Q
  totalPlatformFees: number;       // (P * fee% + fixedFee) * Q
  totalCosts: number;              // totalVariableCosts + totalPlatformFees + fixedMonthlyCosts
  
  // Unit Economics
  unitContributionMargin: number;  // P - V - (P * fee% + fixedFee)
  contributionMarginRatio: number; // unitContributionMargin / P
  
  // Net Profit & Profitability
  monthlyNetProfit: number;        // Gross Revenue - Total Costs
  netProfitMargin: number;         // monthlyNetProfit / Gross Revenue
  
  // Break-Even Metrics
  breakEvenUnits: number;          // Fixed Costs / Unit Contribution Margin
  breakEvenRevenue: number;        // breakEvenUnits * P
  isBreakEvenFeasible: boolean;    // monthlyVolumeTarget >= breakEvenUnits
  
  // Labor & Opportunity Cost (Reality Check)
  totalHoursInvested: number;      // hoursPerUnit * Q
  realHourlyWage: number;          // monthlyNetProfit / totalHoursInvested
  isWageAboveCampusMinimum: boolean;// Compare against benchmark (~HK$60/hr or $15/hr)
  
  // Cash Runway
  cashRunwayMonths: number;        // initialCapital / fixedMonthlyCosts (at zero sales)
  
  // Comprehensive Health Assessment
  healthScore: number;             // 0 to 100
  grade: FinancialHealthGrade;
  riskFlags: string[];
  positiveHighlights: string[];
}

export interface HustlePreset {
  id: string;
  title: string;
  category: string;
  tagline: string;
  iconName: string;
  defaultInputs: HustleInputs;
}

export type TransactionType = "INCOME" | "VARIABLE_EXPENSE" | "FIXED_EXPENSE";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  receiptNote?: string;
}


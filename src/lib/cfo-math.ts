import type { HustleInputs, FinancialAnalysis, FinancialHealthGrade, CurrencyCode } from "@/types/finance";

// Standard FX exchange rates relative to USD (1 USD = X)
export const FX_RATES_TO_USD: Record<CurrencyCode, number> = {
  USD: 1.0,
  HKD: 7.80,    // 1 USD = 7.80 HKD (Pegged standard)
  INR: 83.50,   // 1 USD = 83.50 INR
  EUR: 0.92,    // 1 USD = 0.92 EUR
  GBP: 0.79,    // 1 USD = 0.79 GBP
};

/**
 * Converts any monetary amount from one currency to another using base USD parity.
 */
export function convertAmount(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to || amount === 0) return amount;
  const rateFrom = FX_RATES_TO_USD[from] || 1;
  const rateTo = FX_RATES_TO_USD[to] || 1;

  // Convert to USD base first, then to target currency
  const inUSD = amount / rateFrom;
  const inTarget = inUSD * rateTo;

  if (to === "INR") {
    // Round cleanly to nearest 5 or 10 in INR
    return Math.round(inTarget / 5) * 5;
  }
  if (to === "HKD") {
    // Round to nearest 0.5 in HKD
    return Math.round(inTarget * 2) / 2;
  }
  return Math.round(inTarget * 100) / 100;
}

/**
 * Converts all monetary fields in a HustleInputs model to target currency while keeping counts/time intact.
 */
export function convertHustleInputs(inputs: HustleInputs, targetCurrency: CurrencyCode): HustleInputs {
  if (inputs.currency === targetCurrency) return inputs;
  const from = inputs.currency;
  const to = targetCurrency;

  return {
    ...inputs,
    currency: to,
    sellingPrice: convertAmount(inputs.sellingPrice, from, to),
    variableCostPerUnit: convertAmount(inputs.variableCostPerUnit, from, to),
    fixedPaymentFee: convertAmount(inputs.fixedPaymentFee, from, to),
    fixedMonthlyCosts: convertAmount(inputs.fixedMonthlyCosts, from, to),
    initialCapital: convertAmount(inputs.initialCapital, from, to),
  };
}

// Standard campus student minimum wage benchmarks (for opportunity cost reality check)
export const MIN_HOURLY_WAGE_BENCHMARKS: Record<string, number> = {
  HKD: 60.0,  // Standard Hong Kong statutory / campus tutoring minimum wage (~HK$60)
  USD: 15.0,  // Standard US campus student worker wage ($15)
  INR: 200.0, // Standard India student freelance benchmark (₹200)
  EUR: 12.0,  // Standard EU minimum wage (~€12)
  GBP: 11.44, // UK National Living Wage (£11.44)
};

/**
 * Calculates complete corporate-grade unit economics and cash runway for student side-hustles.
 */
export function calculateFinancials(inputs: HustleInputs): FinancialAnalysis {
  const {
    sellingPrice,
    variableCostPerUnit,
    platformFeePercent,
    fixedPaymentFee,
    fixedMonthlyCosts,
    hoursPerUnit,
    monthlyVolumeTarget,
    initialCapital,
    currency,
  } = inputs;

  const P = Math.max(0, sellingPrice);
  const V = Math.max(0, variableCostPerUnit);
  const Q = Math.max(0, monthlyVolumeTarget);
  const F = Math.max(0, fixedMonthlyCosts);
  const H = Math.max(0.1, hoursPerUnit);
  const Cap = Math.max(0, initialCapital);

  // 1. Transaction Fee per unit (e.g. Stripe 3% + $0.30, or Etsy take-rate)
  const unitPlatformFee = (P * platformFeePercent) + fixedPaymentFee;

  // 2. Unit Contribution Margin: How much cash each unit contributes toward paying fixed overhead
  const unitContributionMargin = P - V - unitPlatformFee;
  const contributionMarginRatio = P > 0 ? unitContributionMargin / P : 0;

  // 3. Totals for the month
  const grossRevenue = P * Q;
  const totalVariableCosts = V * Q;
  const totalPlatformFees = unitPlatformFee * Q;
  const totalCosts = totalVariableCosts + totalPlatformFees + F;
  const monthlyNetProfit = grossRevenue - totalCosts;
  const netProfitMargin = grossRevenue > 0 ? monthlyNetProfit / grossRevenue : 0;

  // 4. Break-Even Calculations
  // If unitContributionMargin <= 0, the business loses money on every single sale!
  let breakEvenUnits = Infinity;
  let breakEvenRevenue = Infinity;

  if (unitContributionMargin > 0) {
    breakEvenUnits = F === 0 ? 0 : Math.ceil(F / unitContributionMargin);
    breakEvenRevenue = breakEvenUnits * P;
  }

  const isBreakEvenFeasible = isFinite(breakEvenUnits) && Q >= breakEvenUnits;

  // 5. Labor & Opportunity Cost (Reality Check)
  const totalHoursInvested = H * Q;
  const realHourlyWage = totalHoursInvested > 0 ? monthlyNetProfit / totalHoursInvested : 0;
  const campusBenchmark = MIN_HOURLY_WAGE_BENCHMARKS[currency] || 15.0;
  const isWageAboveCampusMinimum = realHourlyWage >= campusBenchmark;

  // 6. Cash Runway
  const cashRunwayMonths = F > 0 ? Cap / F : Cap > 0 ? 99 : 0;

  // 7. Health Scoring & Risk Flagging
  const riskFlags: string[] = [];
  const positiveHighlights: string[] = [];

  if (unitContributionMargin <= 0) {
    riskFlags.push("Negative Unit Margin: You lose money on every unit sold. Raise price or lower variable costs.");
  } else if (contributionMarginRatio < 0.25) {
    riskFlags.push("Razor Thin Margin: Contribution margin is under 25%. Minor inflation or shipping fee jumps will cause net losses.");
  } else {
    positiveHighlights.push(`Healthy Unit Margin: ${(contributionMarginRatio * 100).toFixed(0)}% contribution margin protects against price shocks.`);
  }

  if (!isBreakEvenFeasible) {
    if (!isFinite(breakEvenUnits)) {
      riskFlags.push("Unreachable Break-Even: Pricing cannot cover overhead. Business model is currently insolvent.");
    } else {
      riskFlags.push(`Volume Gap: Target (${Q} units) is below break-even point (${breakEvenUnits} units). Need ${breakEvenUnits - Q} more sales/mo.`);
    }
  } else {
    positiveHighlights.push(`Profitable Volume: Hitting target volume yields ${isFinite(breakEvenUnits) ? `${Q - breakEvenUnits} units of pure profit` : "profit"}.`);
  }

  if (realHourlyWage < 0) {
    riskFlags.push("Paying to Work: Net profit is negative, meaning you are currently working for negative hourly return.");
  } else if (realHourlyWage < campusBenchmark) {
    riskFlags.push(`Below Minimum Wage: Your real return is ${(realHourlyWage).toFixed(1)}/hr, which is below typical campus wage (${campusBenchmark}/hr).`);
  } else {
    positiveHighlights.push(`High Return on Time: Your real hourly wage (${realHourlyWage.toFixed(1)}/hr) comfortably beats campus job benchmarks.`);
  }

  if (cashRunwayMonths < 2 && F > 0) {
    riskFlags.push(`Critical Runway: At zero sales, current cash reserves last only ${cashRunwayMonths.toFixed(1)} months.`);
  }

  // Calculate composite score (0 to 100)
  let healthScore = 50;

  // Margin weight (30 pts)
  if (unitContributionMargin <= 0) healthScore -= 30;
  else if (contributionMarginRatio > 0.5) healthScore += 30;
  else if (contributionMarginRatio > 0.3) healthScore += 15;

  // Break-even weight (30 pts)
  if (isBreakEvenFeasible) healthScore += 30;
  else healthScore -= 20;

  // Hourly wage weight (20 pts)
  if (isWageAboveCampusMinimum) healthScore += 20;
  else if (realHourlyWage > 0) healthScore += 5;
  else healthScore -= 20;

  // Runway weight (20 pts)
  if (cashRunwayMonths >= 3 || F === 0) healthScore += 20;
  else if (cashRunwayMonths >= 1) healthScore += 10;

  healthScore = Math.max(0, Math.min(100, healthScore));

  let grade: FinancialHealthGrade = "F";
  if (healthScore >= 90) grade = "A+";
  else if (healthScore >= 80) grade = "A";
  else if (healthScore >= 70) grade = "B";
  else if (healthScore >= 55) grade = "C";
  else if (healthScore >= 40) grade = "D";

  return {
    grossRevenue,
    totalVariableCosts,
    totalPlatformFees,
    totalCosts,
    unitContributionMargin,
    contributionMarginRatio,
    monthlyNetProfit,
    netProfitMargin,
    breakEvenUnits,
    breakEvenRevenue,
    isBreakEvenFeasible,
    totalHoursInvested,
    realHourlyWage,
    isWageAboveCampusMinimum,
    cashRunwayMonths,
    healthScore,
    grade,
    riskFlags,
    positiveHighlights,
  };
}

/**
 * Generates sensitivity matrix: how profit changes if price shifts by ±10%, ±20%
 */
export function generateSensitivityMatrix(inputs: HustleInputs) {
  const priceVariations = [-0.2, -0.1, 0, 0.1, 0.2];
  return priceVariations.map((variance) => {
    const adjustedPrice = Math.round(inputs.sellingPrice * (1 + variance));
    const analysis = calculateFinancials({
      ...inputs,
      sellingPrice: adjustedPrice,
    });
    return {
      priceChangePercent: variance * 100,
      newPrice: adjustedPrice,
      netProfit: analysis.monthlyNetProfit,
      breakEvenUnits: isFinite(analysis.breakEvenUnits) ? analysis.breakEvenUnits : null,
      realHourlyWage: analysis.realHourlyWage,
    };
  });
}

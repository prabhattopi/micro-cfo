import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { HustleInputs, FinancialAnalysis } from "@/types/finance";
import { HustleAIAnalysisResponse } from "@/types/ai";

export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
    const { inputs, analysis, clientApiKey }: {
      inputs: HustleInputs;
      analysis: FinancialAnalysis;
      clientApiKey?: string;
    } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    // If no API key is provided, return high-quality contextual mock data
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(getFallbackAnalysis(inputs, analysis, modelName));
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a ruthless fractional CFO and startup incubator director specializing in university student micro-businesses and campus side-hustles.
Your job is to analyze the student's business model with brutal honesty and economic rigor. Students frequently overlook hidden costs like platform cuts, delivery failed attempts, packaging spoilage, and academic exam dips.

Respond ONLY with valid JSON matching this schema:
{
  "cfoExecutiveVerdict": "Short sharp 2-3 sentence verdict on solvency and operational reality.",
  "sustainabilityScore": number (0 to 100),
  "hiddenRisks": [
    {
      "riskTitle": "string",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "explanation": "string",
      "preventiveMitigation": "string"
    }
  ],
  "tacticalDirectives": [
    {
      "title": "string",
      "expectedProfitImpact": "string e.g. +18% Net Margin",
      "actionableStep": "string"
    }
  ],
  "stressScenarios": [
    {
      "scenarioName": "string e.g. Campus Midterm Slump (-40% Volume)",
      "adjustedMonthlyNetProfit": number,
      "survivalStatus": "SURVIVES" | "BREAK_EVEN" | "INSOLVENT",
      "cfoSurvivalAdvice": "string"
    },
    {
      "scenarioName": "string e.g. Raw Material Inflation (+30% COGS)",
      "adjustedMonthlyNetProfit": number,
      "survivalStatus": "SURVIVES" | "BREAK_EVEN" | "INSOLVENT",
      "cfoSurvivalAdvice": "string"
    }
  ]
}`;

    const userPrompt = `Analyze this student side-hustle:
Name: ${inputs.name}
Category: ${inputs.category}
Currency: ${inputs.currency}
Selling Price: ${inputs.sellingPrice}
Variable Cost per unit: ${inputs.variableCostPerUnit}
Platform Fee Take-rate: ${(inputs.platformFeePercent * 100).toFixed(1)}% + ${inputs.fixedPaymentFee} fixed
Fixed Monthly Overhead: ${inputs.fixedMonthlyCosts}
Target Monthly Volume: ${inputs.monthlyVolumeTarget} units
Hours invested per unit: ${inputs.hoursPerUnit} hours
Initial Cash Buffer: ${inputs.initialCapital}

Calculated Metrics:
Unit Contribution Margin: ${analysis.unitContributionMargin.toFixed(2)} (${(analysis.contributionMarginRatio * 100).toFixed(1)}%)
Monthly Net Profit: ${analysis.monthlyNetProfit.toFixed(2)}
Break-Even Volume: ${analysis.breakEvenUnits} units
Real Hourly Wage: ${analysis.realHourlyWage.toFixed(2)}/hr
Health Grade: ${analysis.grade}

Give an aggressive, realistic CFO evaluation in JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${systemPrompt}\n\n${userPrompt}`,
    });

    const text = response.text || "";
    // Clean potential markdown fences ```json ... ```
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed: HustleAIAnalysisResponse = JSON.parse(cleaned);

    return NextResponse.json({
      ...parsed,
      isMock: false,
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error("Gemini API Error, falling back to mock:", error?.message || error);
    // On any API key failure or rate limit, return robust fallback
    return NextResponse.json(
      getFallbackAnalysis(
        body?.inputs || { name: "Campus Hustle", currency: "HKD" },
        body?.analysis || { monthlyNetProfit: 500, unitContributionMargin: 25 },
        "gemini-2.0-flash (Simulated Fallback)"
      )
    );
  }
}

function getFallbackAnalysis(
  inputs: HustleInputs,
  analysis: FinancialAnalysis,
  modelName: string
): HustleAIAnalysisResponse {
  const isHealthy = analysis.monthlyNetProfit > 0 && analysis.unitContributionMargin > 0;

  return {
    isMock: true,
    modelUsed: modelName,
    cfoExecutiveVerdict: isHealthy
      ? `Your ${inputs.name || "hustle"} has positive unit economics, but your margin of safety is vulnerable to seasonal student exam dips and ingredient/supply price shocks. At ${inputs.monthlyVolumeTarget} monthly orders, you are clearing break-even, but your time investment could be optimized.`
      : `High insolvency risk detected in ${inputs.name || "this model"}. Your variable expenses and payment transaction cuts are eating your gross margin before overhead is even covered. Price restructuring is mandatory.`,
    sustainabilityScore: isHealthy ? 78 : 34,
    hiddenRisks: [
      {
        riskTitle: "Platform Transaction Fee Leakage",
        severity: "MEDIUM",
        explanation: `Payment gateways (PayMe, Stripe, FPS) and e-commerce platforms take ${(inputs.platformFeePercent * 100 || 3.5).toFixed(1)}% + fixed transaction charges on every micro-order. Over a semester, this silently drains profits.`,
        preventiveMitigation: "Encourage direct peer-to-peer bank transfers (FPS / PayMe personal) or incentivize larger batch bundles (e.g. Buy 3 boxes for HK$120) to dilute fixed transaction fees.",
      },
      {
        riskTitle: "Midterm & Final Exam Season Slump",
        severity: "HIGH",
        explanation: "University customer demand plummets by 40% to 60% during week 7 midterms and exam fortnight, while subscriptions and overhead remain fixed.",
        preventiveMitigation: "Pre-sell subscription packages or semester-exam study care bundles 3 weeks in advance to lock in prepaid cash flow.",
      },
      {
        riskTitle: "Uncompensated Labor & Time Sunk Cost",
        severity: isHealthy ? "LOW" : "HIGH",
        explanation: `At ${inputs.hoursPerUnit || 1} hours per order, your effective hourly return is ~${(analysis.realHourlyWage || 30).toFixed(1)}/hr. If you value your time at market student tutoring rates, your net economic profit is significantly lower.`,
        preventiveMitigation: "Standardize batch production (prep 10 units at once) to cut fulfillment time per unit by half.",
      },
    ],
    tacticalDirectives: [
      {
        title: "Implement Value-Add Bundling",
        expectedProfitImpact: "+22% Contribution Margin",
        actionableStep: "Instead of selling single items, bundle with low-cost, high-perceived-value add-ons (custom packaging, stickers, or express campus hall delivery) for a 30% price premium.",
      },
      {
        title: "Overhead Subscription Pruning",
        expectedProfitImpact: "+HK$150/mo Free Cash Flow",
        actionableStep: "Audit recurring software tools. Leverage university GitHub Student Developer Pack and campus student licenses for Canva and Adobe instead of paying retail.",
      },
      {
        title: "Dynamic Price Testing (+12%)",
        expectedProfitImpact: "+28% Net Profit",
        actionableStep: `Raise price from ${inputs.sellingPrice || 45} to ${Math.round((inputs.sellingPrice || 45) * 1.12)}. Micro-business campus customers are relatively price-inelastic on small impulse purchases.`,
      },
    ],
    stressScenarios: [
      {
        scenarioName: "Campus Exam Slump (-40% Volume)",
        adjustedMonthlyNetProfit: Math.round(analysis.monthlyNetProfit * 0.4 - inputs.fixedMonthlyCosts * 0.3),
        survivalStatus: analysis.monthlyNetProfit * 0.4 > 0 ? "SURVIVES" : "INSOLVENT",
        cfoSurvivalAdvice: "Freeze all non-essential equipment purchases and pivot to pre-exam study snack packs.",
      },
      {
        scenarioName: "Supplier Inflation (+25% Variable Costs)",
        adjustedMonthlyNetProfit: Math.round(analysis.monthlyNetProfit - (inputs.variableCostPerUnit * 0.25 * inputs.monthlyVolumeTarget)),
        survivalStatus: "BREAK_EVEN",
        cfoSurvivalAdvice: "Bulk-purchase raw materials with roommate or student society partners to secure volume discounts.",
      },
    ],
  };
}

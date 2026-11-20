import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { HustleInputs, CurrencyCode } from "@/types/finance";

export async function POST(req: NextRequest) {
  let body: any = null;
  try {
    body = await req.json();
    const { ideaPrompt, currency, clientApiKey }: {
      ideaPrompt: string;
      currency: CurrencyCode;
      clientApiKey?: string;
    } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!ideaPrompt || !ideaPrompt.trim()) {
      return NextResponse.json({ error: "Please provide an idea description" }, { status: 400 });
    }

    // Fallback if no key or sample key
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(getFallbackBlueprint(ideaPrompt, currency));
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert campus startup incubator CFO and financial modeler for university students (especially in Asian / Hong Kong university ecosystems like PolyU).
Given a student's raw side-hustle idea, construct a realistic, economically sound micro-business unit economics model.

Be realistic:
- Student customers have limited budgets, but appreciate campus convenience.
- Variable costs must include ingredients/materials, packaging/bags, and small buffer for waste.
- Fixed monthly costs should cover small software/tools, electricity, or basic equipment depreciation.
- Platform fee take-rate is typically 3% to 5% for digital payment gateway (PayMe/FPS/Stripe).
- Target volume should be realistic for a busy college student to fulfill per month (e.g. 15 to 50 units).

Respond ONLY with valid JSON matching this schema:
{
  "name": "Catchy student business brand name",
  "category": "E-Commerce / Food & Beverage / Services / Tech / Apparel",
  "tagline": "One sentence value proposition",
  "currency": "${currency}",
  "sellingPrice": number (retail price charged),
  "variableCostPerUnit": number (COGS + packaging + direct friction),
  "platformFeePercent": number (e.g. 0.035 for 3.5%),
  "fixedPaymentFee": number (e.g. 1.0),
  "fixedMonthlyCosts": number (monthly subscriptions, stall/storage, tools),
  "hoursPerUnit": number (time spent producing and delivering per unit),
  "monthlyVolumeTarget": number (achievable orders per month),
  "initialCapital": number (initial cash required to launch),
  "cfoRationale": "2 sentences explaining why this price and cost structure was chosen."
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: `${systemPrompt}\n\nStudent Hustle Idea: "${ideaPrompt}"\nTarget Currency: ${currency}`,
    });

    const text = response.text || "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      ...parsed,
      isMock: false,
    });
  } catch (error: any) {
    console.error("Blueprint generation error, using fallback:", error?.message || error);
    return NextResponse.json(
      getFallbackBlueprint(body?.ideaPrompt || "Custom Student Hustle", body?.currency || "HKD")
    );
  }
}

function getFallbackBlueprint(ideaPrompt: string, currency: CurrencyCode): HustleInputs & { tagline: string; cfoRationale: string; isMock: boolean } {
  const promptLower = ideaPrompt.toLowerCase();

  // Smart heuristic contextual fallback based on keywords:
  if (promptLower.includes("coffee") || promptLower.includes("tea") || promptLower.includes("drink") || promptLower.includes("brew")) {
    return {
      name: "PolyBrew Cold-Craft Delivery",
      category: "Food & Beverage",
      tagline: "Slow-steeped cold brew coffee delivered directly to student hall doorsteps",
      currency,
      sellingPrice: 35.0,
      variableCostPerUnit: 11.5,
      platformFeePercent: 0.035,
      fixedPaymentFee: 1.0,
      fixedMonthlyCosts: 220.0,
      hoursPerUnit: 0.35,
      monthlyVolumeTarget: 40,
      initialCapital: 850.0,
      cfoRationale: "Priced competitively against campus Starbucks (HK$42) while preserving a 60%+ contribution margin per bottle.",
      isMock: true,
    };
  }

  if (promptLower.includes("3d") || promptLower.includes("print") || promptLower.includes("keycap") || promptLower.includes("toy")) {
    return {
      name: "PolyLayer 3D Lab",
      category: "Hardware & Design",
      tagline: "Custom PLA keycaps, headphone stands, and dorm gadget holders on demand",
      currency,
      sellingPrice: 85.0,
      variableCostPerUnit: 22.0,
      platformFeePercent: 0.04,
      fixedPaymentFee: 1.5,
      fixedMonthlyCosts: 180.0,
      hoursPerUnit: 0.8,
      monthlyVolumeTarget: 22,
      initialCapital: 1400.0,
      cfoRationale: "High margin on raw PLA filament allows strong profitability once base printer amortization is covered.",
      isMock: true,
    };
  }

  if (promptLower.includes("bike") || promptLower.includes("repair") || promptLower.includes("cycle") || promptLower.includes("fix")) {
    return {
      name: "Campus WheelWorks Repair",
      category: "Campus Services",
      tagline: "Fast on-campus bicycle puncture repair, chain tuning, and brake replacement",
      currency,
      sellingPrice: 90.0,
      variableCostPerUnit: 18.0,
      platformFeePercent: 0.02,
      fixedPaymentFee: 0.0,
      fixedMonthlyCosts: 120.0,
      hoursPerUnit: 0.75,
      monthlyVolumeTarget: 18,
      initialCapital: 600.0,
      cfoRationale: "Service businesses carry virtually zero raw material inventory; primary cost is tool amortisation and tubes.",
      isMock: true,
    };
  }

  // General default student business
  return {
    name: "Campus MicroCraft Studio",
    category: "Student Micro-Business",
    tagline: `Student venture centered around: ${ideaPrompt.slice(0, 50)}...`,
    currency,
    sellingPrice: 75.0,
    variableCostPerUnit: 24.0,
    platformFeePercent: 0.035,
    fixedPaymentFee: 1.0,
    fixedMonthlyCosts: 160.0,
    hoursPerUnit: 0.6,
    monthlyVolumeTarget: 25,
    initialCapital: 900.0,
    cfoRationale: "Balanced model balancing modest campus price sensitivity with healthy 60%+ contribution margins.",
    isMock: true,
  };
}

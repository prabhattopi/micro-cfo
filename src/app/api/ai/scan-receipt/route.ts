import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ReceiptScanResponse } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, clientApiKey }: {
      imageBase64?: string;
      mimeType?: string;
      clientApiKey?: string;
    } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";
    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash-lite";

    // If no API key or sample mode, return realistic sample parse
    if (!apiKey || apiKey === "your_gemini_api_key_here" || !imageBase64) {
      return NextResponse.json(getFallbackReceiptParse());
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a financial receipt parser for student side-hustles.
Extract the merchant name, date, line items with prices, total amount, taxes/fees, and classify whether this is a VARIABLE_EXPENSE (raw materials, packaging, inventory) or FIXED_EXPENSE (tools, subscriptions, equipment).

Return ONLY valid JSON matching this schema:
{
  "merchantName": "string",
  "date": "YYYY-MM-DD",
  "lineItems": [
    { "name": "string", "quantity": number, "price": number }
  ],
  "totalAmount": number,
  "category": "VARIABLE_EXPENSE" | "FIXED_EXPENSE",
  "taxOrFees": number,
  "notes": "string"
}`;

    // Multimodal call
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ""),
          },
        },
        prompt,
      ],
    });

    const text = response.text || "";
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed: ReceiptScanResponse = JSON.parse(cleaned);

    return NextResponse.json({
      ...parsed,
      isMock: false,
    });
  } catch (error: any) {
    console.error("Gemini Receipt Scan Error, using fallback:", error?.message || error);
    return NextResponse.json(getFallbackReceiptParse());
  }
}

function getFallbackReceiptParse(): ReceiptScanResponse {
  return {
    isMock: true,
    merchantName: "CitySuper Bakery Ingredients (Kowloon)",
    date: new Date().toISOString().split("T")[0],
    lineItems: [
      { name: "Unsalted French Butter (500g x 2)", quantity: 2, price: 68.0 },
      { name: "Callebaut Belgian Dark Chocolate Callets", quantity: 1, price: 54.0 },
      { name: "Kraft Bakery Pastry Boxes (Pack of 20)", quantity: 1, price: 35.0 },
      { name: "Baking Parchment Roll (10m)", quantity: 1, price: 18.0 },
    ],
    totalAmount: 175.0,
    category: "VARIABLE_EXPENSE",
    taxOrFees: 0.0,
    notes: "Direct COGS for student campus cookie batches. Successfully classified as Variable Expense.",
  };
}

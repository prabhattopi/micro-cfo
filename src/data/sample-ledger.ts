import { Transaction, CurrencyCode } from "@/types/finance";
import { convertAmount } from "@/lib/cfo-math";

export function getSampleTransactions(currency: CurrencyCode = "HKD"): Transaction[] {
  const baseTransactions: Array<Omit<Transaction, "id" | "amount"> & { baseAmountHKD: number }> = [
    {
      title: "Batch Pre-order: 8 Cookie Boxes (Hall 4)",
      baseAmountHKD: 360.0,
      type: "INCOME",
      category: "Customer Orders",
      date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    },
    {
      title: "CitySuper: French Butter & Baking Flour",
      baseAmountHKD: 68.0,
      type: "VARIABLE_EXPENSE",
      category: "Raw Materials",
      date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
      receiptNote: "Scanned via Gemini Multimodal OCR",
    },
    {
      title: "Kraft Bakery Boxes & Ribbon Roll (Pack of 20)",
      baseAmountHKD: 35.0,
      type: "VARIABLE_EXPENSE",
      category: "Packaging",
      date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
    },
    {
      title: "Canva Pro Student Subscription (Monthly)",
      baseAmountHKD: 45.0,
      type: "FIXED_EXPENSE",
      category: "Software Overhead",
      date: new Date(Date.now() - 86400000 * 10).toISOString().split("T")[0],
    },
    {
      title: "Campus Pop-up Stall Table Booking (FJ Podium)",
      baseAmountHKD: 100.0,
      type: "FIXED_EXPENSE",
      category: "Venue & Permits",
      date: new Date(Date.now() - 86400000 * 12).toISOString().split("T")[0],
    },
    {
      title: "Direct Order: 4 Boxes (PolyU Library Study Group)",
      baseAmountHKD: 180.0,
      type: "INCOME",
      category: "Customer Orders",
      date: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0],
    },
  ];

  return baseTransactions.map((tx, idx) => ({
    id: `sample-tx-${idx + 1}`,
    title: tx.title,
    amount: convertAmount(tx.baseAmountHKD, "HKD", currency),
    type: tx.type,
    category: tx.category,
    date: tx.date,
    receiptNote: tx.receiptNote,
  }));
}

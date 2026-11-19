import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "HKD"): string {
  const symbolMap: Record<string, string> = {
    HKD: "HK$",
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };
  const sym = symbolMap[currency] || `${currency} `;
  return `${sym}${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`;
}

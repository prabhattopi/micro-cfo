"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { SimulatorDashboard } from "@/components/SimulatorDashboard";
import { AICopilotTab } from "@/components/AICopilotTab";
import { CashLedgerTab } from "@/components/CashLedgerTab";
import { CurrencyCode, HustleInputs, Transaction } from "@/types/finance";
import { calculateFinancials, convertHustleInputs, convertAmount } from "@/lib/cfo-math";
import { STUDENT_HUSTLE_PRESETS } from "@/data/hustle-presets";
import { getSampleTransactions } from "@/data/sample-ledger";

export default function Home() {
  const [currency, setCurrency] = useState<CurrencyCode>("HKD");
  const [activeTab, setActiveTab] = useState<"simulator" | "ai" | "ledger">("simulator");

  // Shared Hustle State across all tabs
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>("campus-bakery");
  const [inputs, setInputs] = useState<HustleInputs>({
    ...STUDENT_HUSTLE_PRESETS[0].defaultInputs,
    currency,
  });

  // Ledger Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("microcfo_transactions");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fall through
        }
      }
    }
    return getSampleTransactions("HKD");
  });

  // Auto-persist transactions
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("microcfo_transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const analysis = calculateFinancials({ ...inputs, currency });

  // Add Transaction Handler
  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Delete Transaction Handler
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset / Seed Sample Data
  const handleSeedSampleData = () => {
    const seeded = getSampleTransactions(currency);
    setTransactions(seeded);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        currency={currency}
        onCurrencyChange={(newCurr) => {
          const oldCurr = currency;
          setCurrency(newCurr);
          setInputs((prev) => convertHustleInputs(prev, newCurr));
          // Also convert existing transaction amounts proportionally
          setTransactions((prev) =>
            prev.map((t) => ({
              ...t,
              amount: convertAmount(t.amount, oldCurr, newCurr),
            }))
          );
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === "simulator" && (
          <SimulatorDashboard
            inputs={inputs}
            setInputs={setInputs}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
            currency={currency}
            onNavigateToAI={() => setActiveTab("ai")}
          />
        )}

        {activeTab === "ai" && (
          <AICopilotTab
            inputs={inputs}
            analysis={analysis}
            currency={currency}
            onAddTransactionFromReceipt={(scan) => {
              const newTx: Transaction = {
                id: `rcpt-${Date.now()}`,
                title: `${scan.merchantName} (${scan.lineItems.length} items)`,
                amount: convertAmount(scan.totalAmount, "HKD", currency),
                type: scan.category,
                category: scan.category === "VARIABLE_EXPENSE" ? "Raw Materials" : "Equipment",
                date: scan.date || new Date().toISOString().split("T")[0],
                receiptNote: "Auto-synced from Gemini Vision Receipt Scanner",
              };
              setTransactions((prev) => [newTx, ...prev]);
              setActiveTab("ledger");
            }}
          />
        )}

        {activeTab === "ledger" && (
          <CashLedgerTab
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onSeedSampleData={handleSeedSampleData}
            currency={currency}
            inputs={inputs}
            analysis={analysis}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            MicroCFO • Built for <strong className="text-slate-400">SMBP FinHack (Hong Kong PolyU)</strong>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Finance Track</span>
            <span>•</span>
            <span>PWA Enabled</span>
            <span>•</span>
            <span>Gemini AI Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

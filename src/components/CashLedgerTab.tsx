"use client";

import { useState } from "react";
import { Transaction, CurrencyCode, TransactionType, HustleInputs, FinancialAnalysis } from "@/types/finance";
import { formatCurrency } from "@/lib/utils";
import { getSampleTransactions } from "@/data/sample-ledger";
import { PitchDeckExportModal } from "@/components/PitchDeckExportModal";
import {
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Trash2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";

interface CashLedgerTabProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
  onSeedSampleData: () => void;
  currency: CurrencyCode;
  inputs: HustleInputs;
  analysis: FinancialAnalysis;
}

export function CashLedgerTab({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onSeedSampleData,
  currency,
  inputs,
  analysis,
}: CashLedgerTabProps) {
  const [filterType, setFilterType] = useState<"ALL" | TransactionType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPitchExportOpen, setIsPitchExportOpen] = useState(false);

  // New Transaction Form State
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<TransactionType>("VARIABLE_EXPENSE");
  const [newCategory, setNewCategory] = useState("Supplies");

  // Calculations
  const totalInflow = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalVariable = transactions
    .filter((t) => t.type === "VARIABLE_EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFixed = transactions
    .filter((t) => t.type === "FIXED_EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = totalVariable + totalFixed;
  const netCashFlow = totalInflow - totalOutflow;

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    const matchesType = filterType === "ALL" || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || parseFloat(newAmount) <= 0) return;

    onAddTransaction({
      title: newTitle.trim(),
      amount: parseFloat(newAmount),
      type: newType,
      category: newCategory,
      date: new Date().toISOString().split("T")[0],
    });

    setNewTitle("");
    setNewAmount("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Pitch Deck Export Modal */}
      <PitchDeckExportModal
        isOpen={isPitchExportOpen}
        onClose={() => setIsPitchExportOpen(false)}
        inputs={inputs}
        analysis={analysis}
        currency={currency}
        transactions={transactions}
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Cash-Flow Accounting
            </span>
            <span className="text-xs text-slate-400">Offline-First & Cloud Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {inputs.name} — Operating Ledger
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mt-1">
            Track real physical cash inflows, ingredient costs, and software subscriptions. Export formal pitch reports for student incubator grants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {transactions.length === 0 && (
            <button
              onClick={onSeedSampleData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seed Sample Data</span>
            </button>
          )}

          <button
            onClick={() => setIsPitchExportOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:brightness-110 cursor-pointer transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Pitch Summary</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Total Cash Inflow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">
            {formatCurrency(totalInflow, currency)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Customer sales & orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Variable Outflow (COGS)</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-rose-400">
            {formatCurrency(totalVariable, currency)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Raw materials & packaging</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Fixed Overhead Spent</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-mono text-amber-400">
            {formatCurrency(totalFixed, currency)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Tools, software & stall rent</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Net Cash Surplus</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-2xl font-extrabold font-mono ${
              netCashFlow >= 0 ? "text-cyan-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(netCashFlow, currency)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {netCashFlow >= 0 ? "Cash positive" : "Cash deficit"}
          </span>
        </div>
      </div>

      {/* Transaction Table Controls & Filters */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["ALL", "INCOME", "VARIABLE_EXPENSE", "FIXED_EXPENSE"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterType === type
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                {type === "ALL"
                  ? "All Activity"
                  : type === "INCOME"
                  ? "Inflow"
                  : type === "VARIABLE_EXPENSE"
                  ? "Variable (COGS)"
                  : "Fixed Overhead"}
              </button>
            ))}
          </div>

          {/* Search & Add Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Entry</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length > 0 ? (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors text-slate-300">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{tx.title}</div>
                      {tx.receiptNote && (
                        <div className="text-[10px] text-emerald-400/90 mt-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{tx.receiptNote}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{tx.category}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          tx.type === "INCOME"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : tx.type === "VARIABLE_EXPENSE"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {tx.type === "INCOME"
                          ? "Inflow"
                          : tx.type === "VARIABLE_EXPENSE"
                          ? "Variable"
                          : "Fixed"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span
                        className={
                          tx.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                        }
                      >
                        {tx.type === "INCOME" ? "+" : "-"}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    No transactions found. Record an entry or click "Seed Sample Data".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Record New Cash Entry</span>
            </h4>

            <form onSubmit={handleCreateTransaction} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sold 5 Cookie Boxes to Roommate"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Amount ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="120"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="INCOME">Inflow (Revenue)</option>
                    <option value="VARIABLE_EXPENSE">Variable Cost (COGS)</option>
                    <option value="FIXED_EXPENSE">Fixed Overhead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Raw Materials, Software, Orders"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

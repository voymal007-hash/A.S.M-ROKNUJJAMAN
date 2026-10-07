import React from 'react';
import { CheckCircle2, AlertCircle, Coins, Layers, ArrowUpRight, Percent, TrendingUp } from 'lucide-react';
import { LedgerSummary, FilterStatus } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface SummaryCardsProps {
  summary: LedgerSummary;
  currency: string;
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  currency,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner / Sumeri All Paid Highlight */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-850 via-emerald-800 to-green-900 p-5 sm:p-6 text-white shadow-xl shadow-emerald-950/15 border border-emerald-700/50">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-emerald-200">
                Sumeri All Paid & Due Ledger
              </h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-emerald-100 border border-white/15">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>{summary.collectionRate.toFixed(1)}% Collected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. SUMERI ALL PAID (Main requested highlight) */}
            <div
              onClick={() => onFilterChange(activeFilter === 'paid' ? 'all' : 'paid')}
              className={`cursor-pointer rounded-xl p-4 transition border ${
                activeFilter === 'paid'
                  ? 'bg-emerald-600/60 border-emerald-300 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between text-emerald-200 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Sumeri All Paid (জমা)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {formatCurrency(summary.totalPaid, currency)}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium">
                <span>{summary.fullyPaidCount} Fully Cleared</span>
                <span className="underline underline-offset-2">Filter Paid →</span>
              </div>
            </div>

            {/* 2. TOTAL DUE (Pending dues) */}
            <div
              onClick={() => onFilterChange(activeFilter === 'due' ? 'all' : 'due')}
              className={`cursor-pointer rounded-xl p-4 transition border ${
                activeFilter === 'due'
                  ? 'bg-amber-600/50 border-amber-300 shadow-md ring-2 ring-amber-300'
                  : 'bg-white/10 border-white/15 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center justify-between text-amber-200 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Total Deu / Due (বাকি)</span>
                <AlertCircle className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-200">
                {formatCurrency(summary.totalDue, currency)}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-amber-200/90 font-medium">
                <span>{summary.pendingDueCount} Pending dues</span>
                <span className="underline underline-offset-2">Filter Due →</span>
              </div>
            </div>

            {/* 3. GRAND TOTAL (Total Amount) */}
            <div className="rounded-xl p-4 bg-white/10 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Grand Total (মোট)</span>
                <Coins className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {formatCurrency(summary.totalRevenue, currency)}
              </div>
              <div className="mt-1 text-[11px] text-emerald-200/80 font-medium">
                Across {summary.totalRecords} total records
              </div>
            </div>

            {/* 4. TOTAL LAND AREA */}
            <div className="rounded-xl p-4 bg-white/10 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">Total Land (জমি)</span>
                <Layers className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {formatNumber(summary.totalLand)}
              </div>
              <div className="mt-1 text-[11px] text-emerald-200/80 font-medium">
                Total land units logged
              </div>
            </div>
          </div>

          {/* Recovery Progress Bar */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between text-xs mb-2 text-emerald-100">
              <span className="font-semibold">Collection Recovery Status</span>
              <span className="font-bold">
                {formatCurrency(summary.totalPaid, currency)} / {formatCurrency(summary.totalRevenue, currency)}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/30 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300 transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(100, Math.max(0, summary.collectionRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

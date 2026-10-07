import React, { useState } from 'react';
import { X, CheckCircle, DollarSign, Calendar, FileText, CreditCard } from 'lucide-react';
import { LandRecord, PaymentItem } from '../types';
import { formatCurrency, getTodayDateString } from '../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  record: LandRecord | null;
  currency: string;
  onClose: () => void;
  onAddPayment: (recordId: string, payment: PaymentItem) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  record,
  currency,
  onClose,
  onAddPayment,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState(getTodayDateString());
  const [method, setMethod] = useState<PaymentItem['method']>('Cash');
  const [note, setNote] = useState('');

  if (!isOpen || !record) return null;

  const currentDue = record.due;
  const paymentAmount = parseFloat(amount) || 0;
  const remainingAfterPayment = Math.max(0, currentDue - paymentAmount);

  const handlePayFullDue = () => {
    setAmount(currentDue.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    const newPayment: PaymentItem = {
      id: `pay-${Date.now()}`,
      amount: paymentAmount,
      date,
      method,
      note: note.trim() || undefined,
    };

    onAddPayment(record.id, newPayment);
    onClose();
    setAmount('');
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Record Payment (জমা গ্রহণ)</h2>
            <p className="text-xs text-emerald-100">{record.name} • {record.land} {record.unit}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Summary Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-white border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Total</span>
            <span className="font-bold text-slate-800">{formatCurrency(record.total, currency)}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700 block text-[10px] uppercase font-semibold">Paid so far</span>
            <span className="font-bold text-emerald-800">{formatCurrency(record.paid, currency)}</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
            <span className="text-amber-700 block text-[10px] uppercase font-semibold">Current Deu</span>
            <span className="font-bold text-amber-800">{formatCurrency(record.due, currency)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Clear All Button */}
          {currentDue > 0 && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
              <span className="text-xs text-amber-900 font-medium">Pending: {formatCurrency(currentDue, currency)}</span>
              <button
                type="button"
                onClick={handlePayFullDue}
                className="text-xs px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-xs"
              >
                Clear Full Due
              </button>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              Received Amount ({currency}) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              required
              autoFocus
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-lg font-extrabold text-emerald-950 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
            {paymentAmount > 0 && (
              <p className="text-[11px] text-slate-600 mt-1.5 flex items-center justify-between">
                <span>Remaining Due after this:</span>
                <span className="font-bold text-emerald-800">
                  {formatCurrency(remainingAfterPayment, currency)}
                </span>
              </p>
            )}
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Payment Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-400" />
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-800 bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Cash">Cash (নগদ)</option>
                <option value="UPI/Online">UPI / Online / GPay</option>
                <option value="Bank Transfer">Bank Transfer / NEFT</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              Payment Note / Cheque No. (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 2nd installment, receipt #104"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

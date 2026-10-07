import React, { useState } from 'react';
import { X, Printer, Share2, Copy, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { LandRecord } from '../types';
import { formatCurrency, formatDate, generateWhatsAppMessage } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  record: LandRecord | null;
  currency: string;
  businessName: string;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  record,
  currency,
  businessName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !record) return null;

  const isFullyPaid = record.due <= 0;
  const whatsappText = generateWhatsAppMessage(record, currency);

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappText);
    const phoneClean = record.phone?.replace(/[^0-9]/g, '') || '';
    const url = phoneClean
      ? `https://wa.me/${phoneClean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold tracking-tight">Land Receipt & Voucher</h2>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isFullyPaid ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'
              }`}
            >
              {isFullyPaid ? 'Fully Paid' : 'Due Pending'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 overflow-y-auto space-y-5 bg-white text-slate-800" id="printable-receipt">
          {/* Header of Voucher */}
          <div className="text-center pb-4 border-b-2 border-emerald-700 border-dashed">
            <h3 className="text-xl font-black text-emerald-900 tracking-tight">{businessName}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Land & Property Transaction Receipt</p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              VOUCHER REF: {record.id.toUpperCase()}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Party / Client Name:</span>
              <span className="font-bold text-slate-900 text-sm">{record.name}</span>
            </div>

            {record.plotNumber && (
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Plot / Survey No.:</span>
                <span className="font-medium text-slate-800">{record.plotNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Transaction Date:</span>
              <span className="font-medium text-slate-800">{formatDate(record.date)}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Land Area (জমি):</span>
              <span className="font-bold text-emerald-900 text-sm">
                {record.land} {record.unit}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Rate per {record.unit}:</span>
              <span className="font-semibold text-slate-800">{formatCurrency(record.rate, currency)}</span>
            </div>

            <div className="flex items-center justify-between text-sm py-2 bg-slate-50 px-3 rounded-lg font-bold border border-slate-200">
              <span className="text-slate-700">Total Contract Value (মোট):</span>
              <span className="text-slate-900">{formatCurrency(record.total, currency)}</span>
            </div>

            {/* Paid & Due Box */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">Total Paid (জমা)</span>
                <span className="text-lg font-extrabold text-emerald-900 block mt-0.5">
                  {formatCurrency(record.paid, currency)}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${isFullyPaid ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-200'}`}>
                <span className={`text-[11px] font-bold uppercase block ${isFullyPaid ? 'text-slate-500' : 'text-amber-800'}`}>
                  Deu / Due Balance (বাকি)
                </span>
                <span className={`text-lg font-extrabold block mt-0.5 ${isFullyPaid ? 'text-emerald-700' : 'text-amber-900'}`}>
                  {isFullyPaid ? 'NIL (All Paid)' : formatCurrency(record.due, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History List */}
          {record.payments && record.payments.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Payment Installments History:
              </h4>
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                {record.payments.map((p, idx) => (
                  <div key={p.id || idx} className="p-2.5 flex items-center justify-between bg-white">
                    <div>
                      <span className="font-bold text-slate-800">{formatCurrency(p.amount, currency)}</span>
                      <span className="text-[10px] text-slate-500 ml-2">via {p.method || 'Cash'}</span>
                      {p.note && <p className="text-[10px] text-slate-500 italic mt-0.5">{p.note}</p>}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">{formatDate(p.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document / Land Photo Attachment */}
          {record.photoUrl && (
            <div className="pt-2">
              <span className="font-bold block text-slate-500 text-[10px] uppercase mb-1">
                সংযুক্ত দলিল / জমির ছবি (Attached Document / Photo):
              </span>
              <img
                src={record.photoUrl}
                alt="Attached Document"
                className="w-full max-h-48 object-cover rounded-xl border border-slate-300"
              />
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-700 border border-slate-200">
              <span className="font-bold block text-slate-500 text-[10px] uppercase">Remarks:</span>
              <p className="mt-0.5">{record.notes}</p>
            </div>
          )}

          {/* Seal / Sign */}
          <div className="pt-6 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200">
            <div>
              <p className="text-slate-700 font-medium">Customer Signature</p>
              <div className="h-10 border-b border-slate-300 w-28 mt-2" />
            </div>
            <div className="text-right">
              <p className="text-slate-700 font-medium">Authorized Signatory</p>
              <div className="h-10 border-b border-slate-300 w-28 mt-2 ml-auto" />
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={handleWhatsApp}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Receipt</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

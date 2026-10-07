import React, { useRef } from 'react';
import { X, FileSpreadsheet, Download, Upload, Printer, Database, Trash2 } from 'lucide-react';
import { LandRecord, LedgerSummary } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ExportModalProps {
  isOpen: boolean;
  records: LandRecord[];
  summary: LedgerSummary;
  currency: string;
  businessName: string;
  onClose: () => void;
  onImportRecords: (imported: LandRecord[]) => void;
  onResetData: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  records,
  summary,
  currency,
  businessName,
  onClose,
  onImportRecords,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Phone',
      'Plot/Survey',
      'Land',
      'Unit',
      'Rate',
      'Total',
      'Date',
      'Paid',
      'Due',
      'Status',
      'Notes',
    ];

    const rows = records.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.plotNumber || '').replace(/"/g, '""')}"`,
      r.land,
      `"${r.unit}"`,
      r.rate,
      r.total,
      r.date,
      r.paid,
      r.due,
      r.due <= 0 ? 'PAID' : 'DUE',
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    // Add summary row at the bottom
    rows.push([
      '"--- MASTER SUMERI ---"',
      '""',
      '""',
      summary.totalLand,
      '""',
      '""',
      summary.totalRevenue,
      '""',
      summary.totalPaid,
      summary.totalDue,
      '""',
      `"Fully Paid: ${summary.fullyPaidCount}, Pending Due: ${summary.pendingDueCount}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Land_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export to JSON Backup
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Land_Ledger_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportRecords(parsed);
          alert(`Successfully imported ${parsed.length} records!`);
          onClose();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-200" />
            <div>
              <h2 className="text-base font-bold tracking-tight">Data Backup & Reports</h2>
              <p className="text-xs text-emerald-100">Export CSV, Excel & Full Ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          {/* Quick Master Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Ledger Status</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Entries:</span>
                <span className="font-bold text-slate-800">{records.length} records</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Land:</span>
                <span className="font-bold text-slate-800">{summary.totalLand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-emerald-700 font-semibold">Sumeri All Paid:</span>
                <span className="font-bold text-emerald-800">{formatCurrency(summary.totalPaid, currency)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-amber-700 font-semibold">Pending Deu:</span>
                <span className="font-bold text-amber-800">{formatCurrency(summary.totalDue, currency)}</span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2.5">
            <a
              href="/Land_Ledger_App.zip"
              download="Land_Ledger_App.zip"
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/60 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-emerald-950">📦 সম্পূর্ণ অফলাইন অ্যাপ জিপ (App ZIP)</h4>
                  <p className="text-xs text-emerald-800">ফোনে বা কম্পিউটারে আনজিপ করে ইন্টারনেট ছাড়া সম্পূর্ণ অ্যাপ চালান</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-emerald-700" />
            </a>

            <button
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-emerald-900">Export to Excel / CSV</h4>
                  <p className="text-xs text-slate-500">Downloads complete spreadsheet with Name, Land, Rate, Total, Paid & Due</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
            </button>

            <button
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-900">Download Full JSON Backup</h4>
                  <p className="text-xs text-slate-500">Transfer records safely to another phone or computer</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-700" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 group-hover:text-purple-900">Restore / Import from Backup</h4>
                  <p className="text-xs text-slate-500">Load records from a previously exported JSON file</p>
                </div>
              </div>
              <Upload className="w-4 h-4 text-slate-400 group-hover:text-purple-700" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Reset button */}
          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              onClick={() => {
                if (window.confirm('Reset to sample data? Current customized data will be replaced.')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset to Sample Records
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

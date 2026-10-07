/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Smartphone,
  Plus,
  Database,
  Settings as SettingsIcon,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
  Sparkles,
  Edit2,
  Check,
  X,
  Languages,
  Camera,
  WifiOff,
} from 'lucide-react';

import { LandRecord, FilterStatus, LedgerSummary } from './types';
import {
  loadRecords,
  saveRecords,
  loadSettings,
  saveSettings,
  AppSettings,
  INITIAL_RECORDS,
} from './utils/storage';
import { SummaryCards } from './components/SummaryCards';
import { RecordList } from './components/RecordList';
import { RecordModal } from './components/RecordModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';
import { APKInstallModal } from './components/APKInstallModal';
import { LogoUploadModal } from './components/LogoUploadModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [records, setRecords] = useState<LandRecord[]>(() => loadRecords());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LandRecord | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetRecord, setPaymentTargetRecord] = useState<LandRecord | null>(null);

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptTargetRecord, setReceiptTargetRecord] = useState<LandRecord | null>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Header title inline editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(settings.businessName);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) {
      setTempTitle(settings.businessName);
      setTimeout(() => titleInputRef.current?.focus(), 50);
    }
  }, [isEditingTitle, settings.businessName]);

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setSettings((prev) => ({ ...prev, businessName: tempTitle.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleToggleLanguage = () => {
    setSettings((prev) => ({
      ...prev,
      language: prev.language === 'bn' ? 'en' : 'bn',
    }));
  };

  // Synchronize records to localStorage
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  // Synchronize settings to localStorage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Compute master ledger summary
  const summary: LedgerSummary = useMemo(() => {
    let totalLand = 0;
    let totalRevenue = 0;
    let totalPaid = 0;
    let totalDue = 0;
    let fullyPaidCount = 0;
    let pendingDueCount = 0;

    records.forEach((r) => {
      totalLand += r.land || 0;
      totalRevenue += r.total || 0;
      totalPaid += r.paid || 0;
      totalDue += r.due || 0;

      if (r.due <= 0) {
        fullyPaidCount += 1;
      } else {
        pendingDueCount += 1;
      }
    });

    const collectionRate = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0;

    return {
      totalRecords: records.length,
      totalLand: Number(totalLand.toFixed(2)),
      totalRevenue,
      totalPaid,
      totalDue,
      fullyPaidCount,
      pendingDueCount,
      collectionRate,
    };
  }, [records]);

  // Handlers
  const handleSaveRecord = (recordData: Omit<LandRecord, 'createdAt' | 'updatedAt'>) => {
    const existingIndex = records.findIndex((r) => r.id === recordData.id);
    const now = Date.now();

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...records];
      updated[existingIndex] = {
        ...recordData,
        createdAt: records[existingIndex].createdAt,
        updatedAt: now,
      };
      setRecords(updated);
    } else {
      // Add new
      const newRecord: LandRecord = {
        ...recordData,
        createdAt: now,
        updatedAt: now,
      };
      setRecords([newRecord, ...records]);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddPayment = (recordId: string, payment: any) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;
        const newPaid = r.paid + payment.amount;
        const newDue = Math.max(0, r.total - newPaid);
        const newPayments = [...(r.payments || []), payment];
        return {
          ...r,
          paid: newPaid,
          due: newDue,
          payments: newPayments,
          updatedAt: Date.now(),
        };
      })
    );
  };

  const handleImportRecords = (imported: LandRecord[]) => {
    setRecords(imported);
  };

  const handleResetData = () => {
    setRecords(INITIAL_RECORDS);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24 sm:pb-12 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & App Name with Direct Inline Edit */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 mr-2">
            <div
              onClick={() => setIsLogoModalOpen(true)}
              className="relative group cursor-pointer w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-800/20 shrink-0 border border-emerald-400/50 hover:ring-2 hover:ring-emerald-400 transition"
              title="ছবি / লোগো পরিবর্তন করুন (Click to set photo/logo)"
            >
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="App Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white">
                  <Layers className="w-5 h-5 text-emerald-100" />
                </div>
              )}
              {/* Subtle camera overlay on hover/tap */}
              <div className="absolute inset-0 bg-black/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-2xs">
                <Camera className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-1.5 max-w-md">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    placeholder="নাম লিখুন..."
                    className="w-full rounded-lg border-2 border-emerald-600 bg-white px-2.5 py-1 text-sm font-bold text-slate-900 focus:outline-hidden"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs shrink-0"
                    title="সংরক্ষণ করুন (Save)"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 shrink-0"
                    title="বাতিল (Cancel)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1
                    onClick={() => setIsEditingTitle(true)}
                    className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 cursor-pointer hover:text-emerald-800 transition truncate max-w-[220px] sm:max-w-md"
                    title="ক্লিক করে নাম এডিট করুন (Click to edit title)"
                  >
                    {settings.businessName}
                  </h1>

                  {/* Prominent Edit Button */}
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold transition shadow-2xs cursor-pointer active:scale-95"
                    title="নাম এডিট করুন (Edit Business / Ledger Title)"
                  >
                    <Edit2 className="w-3 h-3 text-emerald-700" />
                    <span>এডিট</span>
                  </button>

                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider shrink-0">
                    APK
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ১০০% অফলাইন
                  </span>
                </div>
              )}

              <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate">
                {settings.language === 'bn'
                  ? 'নাম • জমি • দর • মোট • তারিখ • জমা • বাকি'
                  : 'Name • Land • Rate • Total • Date • Paid • Deu'}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={handleToggleLanguage}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1"
              title="ভাষা পরিবর্তন করুন (Toggle Language: বাংলা / English)"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-700" />
              <span>{settings.language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>
            {/* Install APK / PWA button */}
            <PWAInstallButton onOpenModal={() => setIsAPKModalOpen(true)} />

            {/* Export / Backup */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="Backup, CSV & Excel Export"
            >
              <Database className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="Settings (Currency, Title)"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6 space-y-6">
        {/* Sumeri All Paid & Statistics Cards */}
        <SummaryCards
          summary={summary}
          currency={settings.currency}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Main Records Table & Card List */}
        <RecordList
          records={records}
          currency={settings.currency}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddNew={() => {
            setEditingRecord(null);
            setIsRecordModalOpen(true);
          }}
          onEdit={(record) => {
            setEditingRecord(record);
            setIsRecordModalOpen(true);
          }}
          onDelete={handleDeleteRecord}
          onOpenPayment={(record) => {
            setPaymentTargetRecord(record);
            setIsPaymentModalOpen(true);
          }}
          onOpenReceipt={(record) => {
            setReceiptTargetRecord(record);
            setIsReceiptModalOpen(true);
          }}
        />
      </main>

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-6 right-5 z-40">
        <button
          onClick={() => {
            setEditingRecord(null);
            setIsRecordModalOpen(true);
          }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-900/30 active:scale-90 transition border-2 border-emerald-500"
          aria-label="Add Record"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Mobile Bottom Bar for App-like navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-600 print:hidden">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
            activeFilter === 'all' ? 'text-emerald-800' : 'text-slate-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Records</span>
        </button>

        <button
          onClick={() => setActiveFilter('paid')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
            activeFilter === 'paid' ? 'text-emerald-800' : 'text-slate-500'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>All Paid</span>
        </button>

        <button
          onClick={() => setActiveFilter('due')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
            activeFilter === 'due' ? 'text-amber-700' : 'text-slate-500'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Deu</span>
        </button>

        <button
          onClick={() => setIsAPKModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-emerald-700"
        >
          <Smartphone className="w-4 h-4" />
          <span>APK App</span>
        </button>
      </nav>

      {/* Modals */}
      <RecordModal
        isOpen={isRecordModalOpen}
        initialRecord={editingRecord}
        currency={settings.currency}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        record={paymentTargetRecord}
        currency={settings.currency}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setPaymentTargetRecord(null);
        }}
        onAddPayment={handleAddPayment}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        record={receiptTargetRecord}
        currency={settings.currency}
        businessName={settings.businessName}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setReceiptTargetRecord(null);
        }}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        records={records}
        summary={summary}
        currency={settings.currency}
        businessName={settings.businessName}
        onClose={() => setIsExportModalOpen(false)}
        onImportRecords={handleImportRecords}
        onResetData={handleResetData}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={setSettings}
      />

      <LogoUploadModal
        isOpen={isLogoModalOpen}
        currentLogoUrl={settings.logoUrl}
        onClose={() => setIsLogoModalOpen(false)}
        onSaveLogo={(url) => setSettings((prev) => ({ ...prev, logoUrl: url }))}
      />

      <APKInstallModal
        isOpen={isAPKModalOpen}
        onClose={() => setIsAPKModalOpen(false)}
      />

      <OfflineIndicator />
    </div>
  );
}

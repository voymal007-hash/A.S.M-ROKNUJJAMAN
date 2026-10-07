import React, { useState, useRef } from 'react';
import { X, Settings, DollarSign, Building2, Layers, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { AppSettings } from '../utils/storage';
import { compressImageFile } from '../utils/imageUtils';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  const [currency, setCurrency] = useState(settings.currency);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [defaultUnit, setDefaultUnit] = useState(settings.defaultUnit);
  const [language, setLanguage] = useState<'bn' | 'en'>(settings.language || 'bn');
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 400, 0.85);
      setLogoUrl(dataUrl);
    } catch {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      currency,
      businessName: businessName.trim() || 'Land Ledger APK',
      defaultUnit,
      phone: settings.phone,
      language,
      logoUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold tracking-tight">App & Ledger Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Logo / Photo Setting */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              হেডার লোগো / ছবি (App Logo / Picture)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-emerald-500 flex items-center justify-center shrink-0 shadow-xs">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white">
                    <Layers className="w-6 h-6 text-emerald-100" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ছবি আপলোড করুন</span>
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition"
                      title="ছবি মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">গ্যালারি বা ক্যামেরা থেকে ছবি সেট করুন</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              Ledger / Business Title
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              placeholder="e.g. Kisan Land & Due Registry"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="₹">₹ (INR - Rupee)</option>
                <option value="$">$ (USD - Dollar)</option>
                <option value="৳">৳ (BDT - Taka)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - Pound)</option>
                <option value="₨">₨ (PKR - Pakistani Rupee)</option>
                <option value="Rs.">Rs. (General Rupee)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                Default Unit
              </label>
              <select
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="Bigha">Bigha</option>
                <option value="Acre">Acre</option>
                <option value="Katha">Katha</option>
                <option value="Cent">Cent</option>
                <option value="Guntha">Guntha</option>
                <option value="Hectare">Hectare</option>
                <option value="Decimal">Decimal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Language (ভাষা)
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'bn' | 'en')}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-hidden"
            >
              <option value="bn">বাংলা (Bengali)</option>
              <option value="en">English</option>
            </select>
          </div>

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
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

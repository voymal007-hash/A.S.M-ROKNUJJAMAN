import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, Calendar, User, Layers, Tag, DollarSign, FileText, CheckCircle2, Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { LandRecord, LandUnit } from '../types';
import { getTodayDateString } from '../utils/formatters';
import { compressImageFile } from '../utils/imageUtils';

interface RecordModalProps {
  isOpen: boolean;
  initialRecord?: LandRecord | null;
  currency: string;
  onClose: () => void;
  onSave: (record: Omit<LandRecord, 'createdAt' | 'updatedAt'>) => void;
}

const LAND_UNITS: LandUnit[] = [
  'Bigha',
  'Acre',
  'Katha',
  'Cent',
  'Guntha',
  'Hectare',
  'Decimal',
  'Sq. Ft',
  'Marla',
  'Kanal',
];

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  initialRecord,
  currency,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plotNumber, setPlotNumber] = useState('');
  const [land, setLand] = useState<string>('');
  const [unit, setUnit] = useState<LandUnit>('Bigha');
  const [rate, setRate] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [isManualTotal, setIsManualTotal] = useState(false);
  const [date, setDate] = useState(getTodayDateString());
  const [paid, setPaid] = useState<string>('0');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculated fields
  useEffect(() => {
    if (isOpen) {
      if (initialRecord) {
        setName(initialRecord.name);
        setPhone(initialRecord.phone || '');
        setPlotNumber(initialRecord.plotNumber || '');
        setLand(initialRecord.land.toString());
        setUnit(initialRecord.unit);
        setRate(initialRecord.rate.toString());
        setTotal(initialRecord.total.toString());
        setDate(initialRecord.date || getTodayDateString());
        setPaid(initialRecord.paid.toString());
        setNotes(initialRecord.notes || '');
        setPhotoUrl(initialRecord.photoUrl || '');
        setIsManualTotal(false);
      } else {
        setName('');
        setPhone('');
        setPlotNumber('');
        setLand('');
        setUnit('Bigha');
        setRate('');
        setTotal('');
        setDate(getTodayDateString());
        setPaid('0');
        setNotes('');
        setPhotoUrl('');
        setIsManualTotal(false);
      }
    }
  }, [isOpen, initialRecord]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 600, 0.82);
      setPhotoUrl(dataUrl);
    } catch {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে');
    }
  };

  // Recalculate total if land or rate changes (and total not manually locked)
  useEffect(() => {
    if (!isManualTotal) {
      const landVal = parseFloat(land) || 0;
      const rateVal = parseFloat(rate) || 0;
      if (landVal > 0 && rateVal > 0) {
        setTotal((landVal * rateVal).toFixed(2).replace(/\.00$/, ''));
      }
    }
  }, [land, rate, isManualTotal]);

  if (!isOpen) return null;

  const totalNum = parseFloat(total) || 0;
  const paidNum = parseFloat(paid) || 0;
  const dueNum = Math.max(0, totalNum - paidNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const landNum = parseFloat(land) || 0;
    const rateNum = parseFloat(rate) || 0;

    const recordPayload: Omit<LandRecord, 'createdAt' | 'updatedAt'> = {
      id: initialRecord?.id || `rec-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || undefined,
      plotNumber: plotNumber.trim() || undefined,
      land: landNum,
      unit,
      rate: rateNum,
      total: totalNum,
      date,
      paid: paidNum,
      due: dueNum,
      photoUrl: photoUrl || undefined,
      notes: notes.trim() || undefined,
      payments: initialRecord?.payments || [
        ...(paidNum > 0
          ? [
              {
                id: `pay-${Date.now()}`,
                amount: paidNum,
                date,
                method: 'Cash' as const,
                note: 'Initial entry payment',
              },
            ]
          : []),
      ],
    };

    onSave(recordPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {initialRecord ? 'তথ্য এডিট করুন (Edit Record)' : '+ নতুন জমি এন্ট্রি (+ Add Record)'}
            </h2>
            <p className="text-xs text-emerald-100">
              নাম • জমি • দর • মোট • তারিখ • জমা • বাকি
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* 1. NAME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              Name (ব্যক্তি / ক্রেতার নাম) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Patel, John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Phone & Plot No (Optional) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phone (WhatsApp Receipt)
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Plot / Survey No.
              </label>
              <input
                type="text"
                placeholder="Plot 42, Khasra 108"
                value={plotNumber}
                onChange={(e) => setPlotNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 2. LAND & UNIT */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                Land Quantity (জমি) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 4.5"
                value={land}
                onChange={(e) => setLand(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as LandUnit)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:border-emerald-600 focus:outline-hidden"
              >
                {LAND_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. RATE & 4. TOTAL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-700" />
                Rate ({currency} / {unit}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="e.g. 60000"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                  Total (মোট)
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isManualTotal ? 'Manual' : 'Land × Rate'}
                </span>
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                placeholder="Calculated automatically"
                value={total}
                onChange={(e) => {
                  setTotal(e.target.value);
                  setIsManualTotal(true);
                }}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-extrabold text-emerald-950 bg-emerald-50/50 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 5. DATE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              Date (তারিখ) <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* 6. PAID & 7. DEU (DUE) */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Paid (জমা)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
                className="w-full rounded-xl border border-emerald-300 px-3.5 py-2.5 text-base font-extrabold text-emerald-900 bg-white focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-[10px] text-emerald-600 mt-1 block">
                Amount received
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                Deu / Due (বাকি)
              </label>
              <div className="w-full rounded-xl border border-amber-300 px-3.5 py-2.5 text-base font-extrabold text-amber-900 bg-amber-50">
                {currency} {dueNum.toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-700 mt-1 block font-medium">
                {dueNum === 0 ? '✓ All cleared (Fully Paid)' : 'Pending remaining'}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes / Remarks (মন্তব্য)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. North corner, payment terms, witness name..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Document / Land / Party Photo (ছবি যুক্ত করুন) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              দলিল / জমির ছবি (Land Document / Plot Photo)
            </label>
            <div className="flex items-center gap-3">
              {photoUrl ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xs shrink-0 group">
                  <img src={photoUrl} alt="Land Document" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="ছবি মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4 text-rose-300" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{photoUrl ? 'ছবি পরিবর্তন করুন' : 'ছবি যোগ করুন (Attach Photo)'}</span>
                </button>
                <p className="text-[10px] text-slate-500">
                  মোবাইল ক্যামেরা বা গ্যালারি থেকে ছবি আপলোড করুন
                </p>
              </div>
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              className="flex-2 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-700/20 transition active:scale-[0.98]"
            >
              {initialRecord ? '✓ পরিবর্তন সংরক্ষণ (Save Edit)' : '+ তথ্য সংরক্ষণ (Save Record)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

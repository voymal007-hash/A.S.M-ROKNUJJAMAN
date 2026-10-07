import React, { useRef, useState } from 'react';
import { X, Upload, Camera, Trash2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '../utils/imageUtils';

interface LogoUploadModalProps {
  isOpen: boolean;
  currentLogoUrl?: string;
  onClose: () => void;
  onSaveLogo: (url: string) => void;
}

const PRESET_LOGOS = [
  {
    id: 'preset-land',
    label: 'সবুজ জমি (Green Field)',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2315803d"/><path d="M10 80 Q 40 40, 90 70 L 90 90 L 10 90 Z" fill="%2322c55e"/><circle cx="75" cy="30" r="14" fill="%23facc15"/></svg>`,
  },
  {
    id: 'preset-tractor',
    label: 'কৃষি খামার (Agro Farm)',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23047857"/><path d="M20 70 Q 50 20, 80 60 L 80 85 L 20 85 Z" fill="%2310b981"/><path d="M30 75 Q 50 65, 70 75" stroke="%23fef08a" stroke-width="4" fill="none"/></svg>`,
  },
  {
    id: 'preset-gold',
    label: 'সোনালী ফসল (Golden Crop)',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%23b45309"/><circle cx="50" cy="50" r="32" fill="%23f59e0b"/><path d="M50 25 L 50 75 M35 40 Q 50 45, 65 40 M35 55 Q 50 60, 65 55" stroke="%23ffffff" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
  },
  {
    id: 'preset-registry',
    label: 'রেজিস্ট্রি সিল (Registry Seal)',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%231e3a8a"/><circle cx="50" cy="50" r="34" fill="none" stroke="%2360a5fa" stroke-width="4"/><text x="50" y="58" font-family="Arial" font-size="24" font-weight="bold" fill="%23ffffff" text-anchor="middle">LEGAL</text></svg>`,
  },
];

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  currentLogoUrl,
  onClose,
  onSaveLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(currentLogoUrl || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const dataUrl = await compressImageFile(file, 400, 0.85);
      setPreview(dataUrl);
    } catch (err) {
      alert('ছবি আপলোড করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSaveLogo(preview);
    onClose();
  };

  const handleRemove = () => {
    setPreview('');
    onSaveLogo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-200" />
            <h2 className="text-base font-bold tracking-tight">ছবি / লোগো সেট করুন (Set Logo)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Live Preview Box */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  alt="Logo Preview"
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-emerald-500 bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-800 to-green-600 flex items-center justify-center text-white shadow-lg border-2 border-emerald-400">
                  <ImageIcon className="w-10 h-10 text-emerald-100" />
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-xs"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">পরিবর্তন</span>
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-700 mt-3">
              {preview ? 'বর্তমান নির্বাচিত ছবি' : 'ডিফল্ট সবুজ লোগো সক্রিয় আছে'}
            </p>
            <p className="text-[11px] text-slate-400">
              মোবাইল গ্যালারি বা ক্যামেরা থেকে যেকোনো ছবি আপলোড করতে পারবেন
            </p>
          </div>

          {/* Upload Button */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{loading ? 'প্রসেসিং হচ্ছে...' : 'নতুন ছবি আপলোড করুন (Upload Photo)'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Presets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              অথবা নিচের লোগোগুলো বেছে নিন (Presets):
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_LOGOS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setPreview(preset.svg)}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    preview === preset.svg
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.svg} alt={preset.label} className="w-11 h-11 rounded-lg" />
                  <span className="text-[9px] text-slate-600 font-medium truncate w-full text-center">
                    {preset.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Remove logo option if custom exists */}
          {preview && (
            <div className="pt-1 flex justify-center">
              <button
                onClick={handleRemove}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-rose-50 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                ছবি মুছে ডিফল্ট করুন (Reset to Default)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            বাতিল (Cancel)
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Check className="w-4 h-4" />
            ছবি সেট করুন (Set Image)
          </button>
        </div>
      </div>
    </div>
  );
};

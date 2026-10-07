import React from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, X, ShieldCheck, Zap, HardDrive } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APKInstallModal: React.FC<APKInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-emerald-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Smartphone className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Land Ledger APK</h2>
              <p className="text-xs text-emerald-100">Android & Mobile Native App Installation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                {isInstalled ? 'App is Already Installed!' : 'Zero-Install WebAPK Technology'}
              </h4>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                This app runs directly on Android as a high-performance WebAPK with offline support, automatic local ledger saving, and full-screen experience.
              </p>
            </div>
          </div>

          {/* Quick Install Action if browser supports beforeinstallprompt */}
          {isInstallable && !isInstalled && (
            <div className="text-center p-5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-sm font-semibold text-slate-800 mb-3">
                1-Click Direct Installation Available:
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition active:scale-[0.99]"
              >
                <Download className="w-5 h-5" />
                Install Land Ledger on Android (APK)
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                Creates an Android app icon on your home screen and launcher.
              </p>
            </div>
          )}

          {/* Instructions for PC / Computer */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-700" />
              কম্পিউটার বা ল্যাপটপে সেভ / ইনস্টল করার উপায় (PC / Laptop):
            </h3>
            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
              <li className="leading-relaxed">
                <strong>পদ্ধতি ১ (সরাসরি অ্যাপ ইনস্টল):</strong> ব্রাউজারের (Google Chrome / Edge) অ্যাড্রেস বারের একদম ডানপাশে থাকা <strong>Install (ইনস্টল)</strong> আইকনে ক্লিক করে <strong>Install</strong> এ চাপ দিন।
              </li>
              <li className="leading-relaxed">
                <strong>পদ্ধতি ২ (ডেস্কটপ শর্টকাট):</strong> Chrome এর উপরের ডানদিকের তিন ডট মেনুতে (<strong>⋮</strong>) ক্লিক করুন ➔ <strong>Save and share</strong> ➔ <strong>Create shortcut...</strong> ➔ টিক দিন <strong>Open as window</strong> ➔ <strong>Create</strong> চাপুন।
              </li>
              <li className="leading-relaxed">
                এর ফলে আপনার কম্পিউটারের <strong>ডেস্কটপ (Desktop)</strong> এবং স্টার্ট মেনুতে নিজস্ব সফটওয়্যার হিসেবে সেভ হয়ে যাবে এবং ইন্টারনেট ছাড়াই চলবে।
              </li>
              <li className="leading-relaxed">
                <strong>ডাটা সেভ / ব্যাকআপ:</strong> হেডারের ডাটাবেজ (Database) বাটনে চাপ দিয়ে <strong>Export to Excel / CSV</strong> ক্লিক করলেই সমস্ত হিসাব আপনার কম্পিউটারে এক্সেল ফাইল হিসেবে ডাউনলোড হয়ে যাবে।
              </li>
            </ol>
          </div>

          {/* Instructions for Android Users */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              অ্যান্ড্রয়েড মোবাইলে ইনস্টল করার নিয়ম (Android Phone):
            </h3>
            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                মোবাইলের <strong>Google Chrome</strong> ব্রাউজারে অ্যাপটি খুলুন।
              </li>
              <li className="leading-relaxed">
                উপরের ডানদিকের তিন ডট (<strong>⋮</strong>) মেনুতে চাপ দিন।
              </li>
              <li className="leading-relaxed">
                <strong>&quot;Install app&quot;</strong> বা <strong>&quot;Add to Home screen&quot;</strong> এ চাপ দিন।
              </li>
              <li className="leading-relaxed">
                <strong>Install</strong> বাটনে চাপলেই আপনার ফোনে APK অ্যাপের মতো আইকন যুক্ত হবে।
              </li>
            </ol>
          </div>

          {/* iOS Safari Instructions */}
          {isIOS && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-600" />
                How to Install on iPhone / iPad (iOS):
              </h3>
              <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
                <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
              <HardDrive className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Works 100% Offline</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Private Local Storage</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">v1.2 Mobile APK Build</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle,
  ExternalLink,
  X,
  ShieldCheck,
  Zap,
  HardDrive,
  QrCode,
  Copy,
  Check,
  Share2,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface APKInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APKInstallModal: React.FC<APKInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // App URL: Use current location or fallback to shared public URL
  const appUrl = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : 'https://ais-pre-s7ekvwpb22zlxnunvfkg5m-282971768022.asia-southeast1.run.app';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(appUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code error', err));
    }
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendToWhatsApp = () => {
    const text = `আমার ল্যান্ড লেজার অ্যাপের লিংক: ${appUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-emerald-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">মোবাইলে অ্যাপ ইনস্টল করুন (APK)</h2>
              <p className="text-xs text-emerald-100">Android & Mobile Native Installation Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Direct Install Button if supported by current browser session */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-xl bg-emerald-700 text-white text-center shadow-lg shadow-emerald-800/20 space-y-2">
              <p className="text-xs font-semibold text-emerald-100">আপনার বর্তমান ব্রাউজার সরাসরি ইনস্টল সাপোর্ট করছে:</p>
              <button
                onClick={handleDirectInstall}
                className="w-full py-2.5 px-4 rounded-lg bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 transition active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-700" />
                ১-ক্লিকে এখনই ইনস্টল করুন (Install Now)
              </button>
            </div>
          )}

          {/* METHOD 1: QR CODE (Instant for Phone) */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>পদ্ধতি ১: মোবাইলের ক্যামেরা দিয়ে স্ক্যান করুন (সবচেয়ে সহজ)</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              {qrCodeDataUrl ? (
                <div className="p-2.5 bg-white rounded-xl shadow-md border border-emerald-300 inline-block">
                  <img src={qrCodeDataUrl} alt="App QR Code" className="w-44 h-44 sm:w-48 sm:h-48" />
                </div>
              ) : (
                <div className="w-44 h-44 bg-white animate-pulse rounded-xl" />
              )}
              <p className="text-xs text-emerald-950 font-bold mt-2.5">
                আপনার ফোনের ক্যামেরা চালু করে এই কিউআর কোডটিতে ধরুন
              </p>
              <p className="text-[11px] text-emerald-700">
                ক্যামেরার লিংকে চাপ দিলেই সাথে সাথে আপনার মোবাইলে অ্যাপটি খুলে যাবে!
              </p>
            </div>
          </div>

          {/* METHOD 2: WHATSAPP OR LINK COPY */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase">
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              পদ্ধতি ২: লিংকটি নিজের মোবাইলে পাঠিয়ে নিন
            </h4>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-700 select-all font-mono"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
              </button>
            </div>

            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-2.5 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে নিজের ফোনে লিংক পাঠান (Send to WhatsApp)</span>
            </button>
          </div>

          {/* METHOD 3: HOW TO INSTALL IN MOBILE (WHY IT MIGHT NOT WORK DIRECTLY) */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>জরুরী তথ্য:</strong> ফেসবুক বা মেসেঞ্জারের ভেতরের ব্রাউজারে থাকলে ইনস্টল হবে না। আপনাকে অবশ্যই <strong>Google Chrome</strong> এ লিংকটি খুলতে হবে।
              </span>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-700" />
              ফোনের হোম স্ক্রিনে APK হিসেবে সেভ করার ৩টি সহজ ধাপ:
            </h4>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ১
                </span>
                <div>
                  <strong className="text-slate-900 block">Google Chrome এ লিংকটি খুলুন</strong>
                  <span>আপনার মোবাইলের গুগল ক্রোম ব্রাউজারে গিয়ে ওপরের লিংকটি পেস্ট করে ওপেন করুন।</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ২
                </span>
                <div>
                  <strong className="text-slate-900 block">উপরে ৩টি ফোঁটা মেনু (⋮) তে চাপ দিন</strong>
                  <span>ক্রোম ব্রাউজারের একদম উপরের ডানদিকের তিন ডট (⋮) অপশনে চাপ দিন।</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ৩
                </span>
                <div>
                  <strong className="text-slate-900 block">&quot;Install app&quot; বা &quot;Add to Home screen&quot; চাপুন</strong>
                  <span>তালিকায় থাকা &quot;হোম স্ক্রিনে যোগ করুন&quot; বা &quot;ইনস্টল করুন&quot; বাটনে চাপলেই আপনার ফোনে সাধারণ অ্যাপের মতো লোগো তৈরি হয়ে যাবে।</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">১০০% অফলাইনে চলবে • ইন্টারনেট লাগবে না</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

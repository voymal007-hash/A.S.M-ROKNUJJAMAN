import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  MessageSquare,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileArchive,
} from 'lucide-react';
import QRCode from 'qrcode';

export const MobileSetupBanner: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const sharedUrl = 'https://ais-pre-s7ekvwpb22zlxnunvfkg5m-282971768022.asia-southeast1.run.app';

  useEffect(() => {
    QRCode.toDataURL(sharedUrl, {
      width: 220,
      margin: 2,
      color: {
        dark: '#064e3b',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [sharedUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const msg = `আমার ল্যান্ড লেজার অ্যাপ: ${sharedUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Download standalone offline HTML file
  const handleDownloadOfflineHTML = () => {
    const a = document.createElement('a');
    a.href = '/Land_Ledger_Mobile_App.html';
    a.download = 'Land_Ledger_Mobile_App.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download complete offline app ZIP
  const handleDownloadAppZip = () => {
    const a = document.createElement('a');
    a.href = '/Land_Ledger_App.zip';
    a.download = 'Land_Ledger_App.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download complete source code ZIP
  const handleDownloadSourceZip = () => {
    const a = document.createElement('a');
    a.href = '/Land_Ledger_Source_Code.zip';
    a.download = 'Land_Ledger_Source_Code.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-emerald-300 shadow-md overflow-hidden text-slate-800">
      {/* Banner Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer bg-gradient-to-r from-emerald-800 to-green-700 px-5 py-3.5 text-white flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-emerald-200 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
              📱 মোবাইলে অ্যাপটি নামানো ও ব্যবহারের সহজ গাইড
              <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full uppercase">
                সহজ উপায়
              </span>
            </h3>
            <p className="text-[11px] text-emerald-100 hidden sm:block">
              যদি ইনস্টল অপশন খুঁজে না পান, তবে নিচের যেকোনো ১টি উপায়ে চেষ্টা করুন
            </p>
          </div>
        </div>
        <button className="p-1 rounded-lg hover:bg-white/10 text-emerald-100">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 space-y-5 bg-emerald-50/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Left: Live QR Code for instant phone scan */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-emerald-200 text-center shadow-xs">
              <span className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5 uppercase">
                <QrCode className="w-4 h-4 text-emerald-700" />
                ১. ক্যামেরা দিয়ে সরাসরি স্ক্যান করুন
              </span>

              {qrCodeUrl ? (
                <div className="p-2 bg-white rounded-xl border-2 border-emerald-500 shadow-sm">
                  <img src={qrCodeUrl} alt="App QR" className="w-36 h-36 sm:w-40 sm:h-40" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-xl" />
              )}

              <p className="text-xs font-bold text-slate-800 mt-2">
                ফোনের ক্যামেরা অন করে স্ক্রিনে ধরুন
              </p>
              <p className="text-[11px] text-slate-500">
                ক্যামেরায় আসা লিংকে চাপ দিলেই সাথে সাথে ফোনে ওপেন হবে।
              </p>
            </div>

            {/* Right: Direct Actions & Instructions */}
            <div className="space-y-3.5">
              <div>
                <span className="text-xs font-bold text-slate-900 block mb-1.5 uppercase">
                  ২. সরাসরি লিংক কপি বা হোয়াটসঅ্যাপে পাঠান
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sharedUrl}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 flex items-center gap-1 hover:bg-black transition active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadAppZip}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                  title="সম্পূর্ণ অ্যাপ জিপ ফাইল ডাউনলোড করুন"
                >
                  <FileArchive className="w-4 h-4 text-emerald-200" />
                  <span>📦 জিপ ফাইল ডাউনলোড (App ZIP)</span>
                </button>

                <button
                  onClick={handleDownloadSourceZip}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                  title="সম্পূর্ণ সোর্স কোড জিপ ডাউনলোড"
                >
                  <Download className="w-4 h-4 text-slate-300" />
                  <span>📁 সোর্স কোড ZIP (Source Code)</span>
                </button>

                <button
                  onClick={handleDownloadOfflineHTML}
                  className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>📄 অফলাইন HTML ফাইল</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>হোয়াটসঅ্যাপে লিংক পাঠান</span>
                </button>
              </div>

              {/* Exact 3 steps for mobile */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5">
                <strong className="text-emerald-900 block text-[11px] uppercase tracking-wider">
                  ⚠️ &quot;Add to Home screen&quot; না আসলে কী করবেন?
                </strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  ১. লিংকটি <strong>Google Chrome</strong> ব্রাউজারে খুলতে হবে (ফেসবুক বা মেসেঞ্জারের ভেতর নয়)।<br />
                  ২. Chrome এর উপরের ডানদিকের <strong>তিনটি ডট (⋮)</strong> মেনুতে চাপুন।<br />
                  ৩. মেনুর নিচের দিকে থাকা <strong>&quot;Add to Home screen&quot;</strong> (হোম স্ক্রিনে যোগ করুন) অথবা <strong>&quot;Install app&quot;</strong> এ চাপ দিন।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

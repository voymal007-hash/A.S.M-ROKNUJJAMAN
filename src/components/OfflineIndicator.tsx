import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:right-auto sm:w-auto z-50 flex items-center justify-center gap-2 rounded-xl bg-emerald-800 border border-emerald-400 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-emerald-950/30">
      <WifiOff className="w-4 h-4 text-emerald-300" />
      <span>অফলাইন মোড: ইন্টারনেট ছাড়াই সব হিসাব আপনার ফোনে সম্পূর্ণ কাজ করছে</span>
    </div>
  );
};

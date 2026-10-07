import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenModal }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (isInstalled) {
    return (
      <button
        onClick={onOpenModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold border border-emerald-300 transition"
        title="App Installed / View APK Info"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">Installed</span>
        <span className="sm:hidden">APK</span>
      </button>
    );
  }

  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        onOpenModal();
      }
    } else {
      onOpenModal();
    }
  };

  return (
    <button
      onClick={handleAction}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs active:scale-95 transition"
      title="Install Land Ledger as Android APK / App"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Install APK</span>
    </button>
  );
};

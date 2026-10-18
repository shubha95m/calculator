import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  theme: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ theme }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA / Play Store app, hide the button
  if (isInstalled) {
    return null;
  }

  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        title="Install Calculator as App"
        className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
          isDark
            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
            : isRetro
            ? 'bg-[#7bfb9d]/20 text-[#7bfb9d] hover:bg-[#7bfb9d]/30'
            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
        }`}
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          title="Install on iPhone / iPad"
          className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
            isDark
              ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
              : isRetro
              ? 'hover:bg-[#233528] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
              : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl relative ${
                isDark
                  ? 'bg-neutral-900 text-white border border-neutral-800'
                  : 'bg-white text-neutral-900 border border-neutral-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-semibold mb-2">Install on iPhone / iPad</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-4">
                1. Tap the <strong>Share</strong> button in your Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl font-medium text-sm bg-neutral-800 text-white hover:bg-neutral-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

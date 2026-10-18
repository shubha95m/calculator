import React, { useState } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { formatDisplayValue } from '../utils/calculator';

interface DisplayProps {
  expression: string;
  displayValue: string;
  hasMemory: boolean;
  onBackspace: () => void;
  theme: string;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  displayValue,
  hasMemory,
  onBackspace,
  theme,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!displayValue || displayValue === 'Error') return;
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatted = formatDisplayValue(displayValue);

  // Dynamic font sizing based on string length
  const getFontSize = () => {
    const len = formatted.length;
    if (len > 14) return 'text-2xl sm:text-3xl';
    if (len > 10) return 'text-3xl sm:text-4xl';
    if (len > 7) return 'text-4xl sm:text-5xl';
    return 'text-5xl sm:text-6xl';
  };

  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  return (
    <div
      className={`relative px-5 pt-4 pb-3 rounded-2xl flex flex-col justify-end transition-all duration-300 min-h-[140px] select-none ${
        isDark
          ? 'bg-neutral-900/90 text-white border border-neutral-800 shadow-inner'
          : isRetro
          ? 'bg-[#18231c] text-[#7bfb9d] border-2 border-[#2b3e32] font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]'
          : 'bg-neutral-100 text-neutral-900 border border-neutral-200 shadow-inner'
      }`}
    >
      {/* Top row: Memory indicator, active expression & action buttons */}
      <div className="flex items-center justify-between gap-2 mb-1 min-h-[26px]">
        <div className="flex items-center gap-1.5">
          {hasMemory && (
            <span
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                isDark
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : isRetro
                  ? 'bg-[#7bfb9d]/20 text-[#7bfb9d] border border-[#7bfb9d]/30'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              M
            </span>
          )}
          <span
            className={`text-xs font-medium truncate max-w-[200px] ${
              isDark
                ? 'text-neutral-400'
                : isRetro
                ? 'text-[#7bfb9d]/70'
                : 'text-neutral-500'
            }`}
          >
            {expression || ' '}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onBackspace}
            title="Backspace (Delete)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                : isRetro
                ? 'hover:bg-[#25372c] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Delete className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied to clipboard' : 'Copy number'}
            className={`p-1.5 rounded-lg transition-colors relative cursor-pointer ${
              isDark
                ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                : isRetro
                ? 'hover:bg-[#25372c] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                : 'hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied && (
              <span className="absolute -top-7 right-0 text-[10px] font-sans font-semibold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main big display value */}
      <div className="w-full text-right overflow-x-auto overflow-y-hidden no-scrollbar">
        <span
          className={`font-semibold tracking-tight tabular-nums block transition-all duration-150 ${getFontSize()}`}
        >
          {formatted}
        </span>
      </div>
    </div>
  );
};

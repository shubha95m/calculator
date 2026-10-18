import React from 'react';
import { HistoryItem } from '../types';
import { X, Trash2, Clock, ArrowRight } from 'lucide-react';
import { formatDisplayValue } from '../utils/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  theme: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative z-10 w-full max-w-sm h-full flex flex-col shadow-2xl transition-transform ${
          isDark
            ? 'bg-neutral-900 text-white border-l border-neutral-800'
            : isRetro
            ? 'bg-[#152019] text-[#7bfb9d] border-l border-[#2e4235]'
            : 'bg-white text-neutral-800 border-l border-neutral-200'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDark
              ? 'border-neutral-800'
              : isRetro
              ? 'border-[#2e4235]'
              : 'border-neutral-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold text-base tracking-wide">
              Calculation History
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                title="Clear all history"
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  isDark
                    ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
                    : isRetro
                    ? 'hover:bg-red-950/40 text-red-400 hover:text-red-300'
                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                isDark
                  ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                  : isRetro
                  ? 'hover:bg-[#233528] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                  : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
              <Clock className="w-10 h-10 mb-2 opacity-30 stroke-1" />
              <p className="text-sm font-medium">No history yet</p>
              <p className="text-xs opacity-70 mt-1 max-w-[200px]">
                Completed calculations will be saved here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-right cursor-pointer transition-all group ${
                  isDark
                    ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/60 hover:border-neutral-600'
                    : isRetro
                    ? 'bg-[#1b2a21] hover:bg-[#23372c] border-[#2f4337] hover:border-[#3e5949]'
                    : 'bg-neutral-50 hover:bg-white border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                }`}
              >
                <div
                  className={`text-xs font-mono mb-1 truncate ${
                    isDark
                      ? 'text-neutral-400'
                      : isRetro
                      ? 'text-[#7bfb9d]/70'
                      : 'text-neutral-500'
                  }`}
                >
                  {item.expression} =
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Load <ArrowRight className="w-3 h-3" />
                  </span>
                  <div className="text-xl font-semibold tracking-tight font-mono">
                    {formatDisplayValue(item.result)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div
          className={`px-5 py-3 border-t text-[11px] text-center opacity-60 ${
            isDark
              ? 'border-neutral-800 text-neutral-400'
              : isRetro
              ? 'border-[#2e4235] text-[#7bfb9d]'
              : 'border-neutral-100 text-neutral-500'
          }`}
        >
          Click any calculation to recall the result
        </div>
      </div>
    </div>
  );
};

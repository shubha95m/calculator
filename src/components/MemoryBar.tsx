import React from 'react';
import { motion } from 'motion/react';

interface MemoryBarProps {
  hasMemory: boolean;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  theme: string;
}

export const MemoryBar: React.FC<MemoryBarProps> = ({
  hasMemory,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  const baseBtnStyle = `py-1 px-2 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer flex-1 text-center`;

  const enabledStyle = isDark
    ? 'text-neutral-300 hover:text-white hover:bg-neutral-800 active:bg-neutral-700'
    : isRetro
    ? 'text-[#7bfb9d] hover:bg-[#223328] active:bg-[#2b3e32]'
    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300';

  const disabledStyle = isDark
    ? 'text-neutral-600 cursor-not-allowed'
    : isRetro
    ? 'text-[#7bfb9d]/30 cursor-not-allowed'
    : 'text-neutral-300 cursor-not-allowed';

  return (
    <div
      className={`grid grid-cols-4 gap-1.5 py-1 px-1 rounded-xl mb-3 ${
        isDark
          ? 'bg-neutral-900/50'
          : isRetro
          ? 'bg-[#18231c]/60'
          : 'bg-neutral-100/70'
      }`}
    >
      <motion.button
        type="button"
        whileTap={hasMemory ? { scale: 0.95 } : undefined}
        onClick={onMemoryClear}
        disabled={!hasMemory}
        className={`${baseBtnStyle} ${hasMemory ? enabledStyle : disabledStyle}`}
        title="Clear Memory (MC)"
      >
        MC
      </motion.button>

      <motion.button
        type="button"
        whileTap={hasMemory ? { scale: 0.95 } : undefined}
        onClick={onMemoryRecall}
        disabled={!hasMemory}
        className={`${baseBtnStyle} ${hasMemory ? enabledStyle : disabledStyle}`}
        title="Recall Memory (MR)"
      >
        MR
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={onMemoryAdd}
        className={`${baseBtnStyle} ${enabledStyle}`}
        title="Add to Memory (M+)"
      >
        M+
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={onMemorySubtract}
        className={`${baseBtnStyle} ${enabledStyle}`}
        title="Subtract from Memory (M-)"
      >
        M-
      </motion.button>
    </div>
  );
};

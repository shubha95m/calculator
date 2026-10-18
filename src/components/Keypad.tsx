import React from 'react';
import { motion } from 'motion/react';
import { Operator } from '../types';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: Operator) => void;
  onEqual: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onDecimal: () => void;
  onBackspace: () => void;
  activeOperator: Operator | null;
  clearLabel: 'AC' | 'C';
  theme: string;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onEqual,
  onClear,
  onToggleSign,
  onPercentage,
  onDecimal,
  onBackspace,
  activeOperator,
  clearLabel,
  theme,
}) => {
  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  // Button style palettes
  const getNumStyle = () => {
    if (isDark) {
      return 'bg-neutral-800 text-white hover:bg-neutral-700 active:bg-neutral-600 shadow-sm shadow-black/20';
    }
    if (isRetro) {
      return 'bg-[#233529] text-[#7bfb9d] hover:bg-[#2c4234] active:bg-[#1a281f] border border-[#354f3e] shadow-sm';
    }
    return 'bg-white text-neutral-800 hover:bg-neutral-50 active:bg-neutral-100 shadow-sm border border-neutral-200/80';
  };

  const getFuncStyle = () => {
    if (isDark) {
      return 'bg-neutral-700/80 text-neutral-200 hover:bg-neutral-700 active:bg-neutral-600';
    }
    if (isRetro) {
      return 'bg-[#1b2b20] text-[#4edb75] hover:bg-[#25392b] border border-[#2b3e32]';
    }
    return 'bg-neutral-200/80 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300';
  };

  const getOpStyle = (op: Operator) => {
    const isActive = activeOperator === op;
    if (isActive) {
      if (isDark) return 'bg-amber-500 text-white ring-2 ring-amber-400 font-bold';
      if (isRetro) return 'bg-[#7bfb9d] text-[#121c15] ring-2 ring-[#7bfb9d] font-bold';
      return 'bg-amber-600 text-white ring-2 ring-amber-400 font-bold';
    }

    if (isDark) {
      return 'bg-amber-600/90 text-white hover:bg-amber-500 active:bg-amber-600';
    }
    if (isRetro) {
      return 'bg-[#2b4433] text-[#7bfb9d] hover:bg-[#34533e] border border-[#3f634b]';
    }
    return 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm';
  };

  const getEqualStyle = () => {
    if (isDark) {
      return 'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-950/40 font-bold';
    }
    if (isRetro) {
      return 'bg-[#7bfb9d] text-[#101913] hover:bg-[#95fdb0] active:bg-[#65e085] font-bold shadow-[0_0_12px_rgba(123,251,157,0.3)]';
    }
    return 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm font-bold';
  };

  const btnBase =
    'h-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-medium transition-colors select-none cursor-pointer focus:outline-none';

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
      {/* Row 1 */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onClear}
        className={`${btnBase} ${getFuncStyle()} font-semibold`}
        title={`Clear (${clearLabel}) - Esc`}
      >
        {clearLabel}
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onBackspace}
        className={`${btnBase} ${getFuncStyle()}`}
        title="Backspace - Backspace"
      >
        ⌫
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onPercentage}
        className={`${btnBase} ${getFuncStyle()}`}
        title="Percent - %"
      >
        %
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onOperator('÷')}
        className={`${btnBase} ${getOpStyle('÷')}`}
        title="Divide - /"
      >
        ÷
      </motion.button>

      {/* Row 2 */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('7')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        7
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('8')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        8
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('9')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        9
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onOperator('×')}
        className={`${btnBase} ${getOpStyle('×')}`}
        title="Multiply - *"
      >
        ×
      </motion.button>

      {/* Row 3 */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('4')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        4
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('5')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        5
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('6')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        6
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onOperator('-')}
        className={`${btnBase} ${getOpStyle('-')}`}
        title="Subtract - -"
      >
        −
      </motion.button>

      {/* Row 4 */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('1')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        1
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('2')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        2
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('3')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        3
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onOperator('+')}
        className={`${btnBase} ${getOpStyle('+')}`}
        title="Add - +"
      >
        +
      </motion.button>

      {/* Row 5 */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onToggleSign}
        className={`${btnBase} ${getNumStyle()} text-lg sm:text-xl`}
        title="Toggle Positive / Negative"
      >
        ±
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => onDigit('0')}
        className={`${btnBase} ${getNumStyle()}`}
      >
        0
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onDecimal}
        className={`${btnBase} ${getNumStyle()}`}
        title="Decimal - ."
      >
        .
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onEqual}
        className={`${btnBase} ${getEqualStyle()}`}
        title="Calculate - Enter / ="
      >
        =
      </motion.button>
    </div>
  );
};

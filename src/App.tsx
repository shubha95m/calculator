/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Display } from './components/Display';
import { MemoryBar } from './components/MemoryBar';
import { Keypad } from './components/Keypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Operator, HistoryItem, ThemeMode } from './types';
import { calculate, formatResultToString } from './utils/calculator';
import { playKeyClick } from './utils/audio';
import { History, Volume2, VolumeX, Moon, Sun, Monitor, Keyboard } from 'lucide-react';

const MAX_DIGITS = 15;

export default function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  
  // Memory
  const [memory, setMemory] = useState<number>(0);

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calculator_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // App settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('calculator_sound') !== 'false';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('calculator_theme');
    return (saved as ThemeMode) || 'dark';
  });
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  // Save state changes
  useEffect(() => {
    try {
      localStorage.setItem('calculator_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  useEffect(() => {
    localStorage.setItem('calculator_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('calculator_theme', theme);
  }, [theme]);

  const playClick = useCallback(
    (type: 'num' | 'op' | 'action' | 'clear' = 'num') => {
      if (soundEnabled) {
        playKeyClick(type);
      }
    },
    [soundEnabled]
  );

  // Input Digit
  const handleDigit = useCallback(
    (digit: string) => {
      playClick('num');

      if (displayValue === 'Error' || displayValue === 'Cannot divide by 0') {
        setDisplayValue(digit);
        setWaitingForOperand(false);
        return;
      }

      if (waitingForOperand) {
        setDisplayValue(digit);
        setWaitingForOperand(false);
      } else {
        if (displayValue === '0') {
          setDisplayValue(digit);
        } else {
          // Limit length to avoid overflow
          const digitsCount = displayValue.replace(/[.,-]/g, '').length;
          if (digitsCount < MAX_DIGITS) {
            setDisplayValue(displayValue + digit);
          }
        }
      }
    },
    [displayValue, waitingForOperand, playClick]
  );

  // Decimal Point
  const handleDecimal = useCallback(() => {
    playClick('num');

    if (waitingForOperand || displayValue === 'Error' || displayValue === 'Cannot divide by 0') {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  }, [displayValue, waitingForOperand, playClick]);

  // Backspace
  const handleBackspace = useCallback(() => {
    playClick('clear');

    if (waitingForOperand || displayValue === 'Error' || displayValue === 'Cannot divide by 0') {
      return;
    }

    if (displayValue.length > 1) {
      // If negative single digit e.g. "-5", backspacing turns to "0"
      if (displayValue.length === 2 && displayValue.startsWith('-')) {
        setDisplayValue('0');
      } else {
        setDisplayValue(displayValue.slice(0, -1));
      }
    } else {
      setDisplayValue('0');
    }
  }, [displayValue, waitingForOperand, playClick]);

  // Operator (+, -, ×, ÷)
  const handleOperator = useCallback(
    (nextOp: Operator) => {
      playClick('op');

      const current = parseFloat(displayValue);

      if (isNaN(current)) return;

      if (prevValue === null) {
        setPrevValue(current);
        setExpression(`${current} ${nextOp}`);
      } else if (operator && !waitingForOperand) {
        // Continuous chaining e.g. 5 + 3 + 2
        const { result, error } = calculate(prevValue, current, operator);
        if (error) {
          setDisplayValue(error);
          setPrevValue(null);
          setOperator(null);
          setExpression('');
          setWaitingForOperand(true);
          return;
        }
        if (result !== undefined) {
          const formattedRes = formatResultToString(result);
          setDisplayValue(formattedRes);
          setPrevValue(result);
          setExpression(`${result} ${nextOp}`);
        }
      } else {
        // User changed operator before typing second operand
        setExpression(`${prevValue} ${nextOp}`);
      }

      setWaitingForOperand(true);
      setOperator(nextOp);
    },
    [displayValue, prevValue, operator, waitingForOperand, playClick]
  );

  // Equals (=)
  const handleEqual = useCallback(() => {
    playClick('action');

    if (prevValue === null || !operator) {
      return;
    }

    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    const fullExpression = `${prevValue} ${operator} ${current}`;
    const { result, error } = calculate(prevValue, current, operator);

    if (error) {
      setDisplayValue(error);
      setExpression(fullExpression);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      return;
    }

    if (result !== undefined) {
      const formattedRes = formatResultToString(result);
      setDisplayValue(formattedRes);
      setExpression(`${fullExpression} =`);
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        expression: fullExpression,
        result: formattedRes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // Keep last 50
    }
  }, [displayValue, prevValue, operator, playClick]);

  // Clear (AC or C)
  const handleClear = useCallback(() => {
    playClick('clear');

    if (displayValue !== '0') {
      // Clear entry only
      setDisplayValue('0');
    } else {
      // Clear all
      setDisplayValue('0');
      setPrevValue(null);
      setOperator(null);
      setExpression('');
      setWaitingForOperand(false);
    }
  }, [displayValue, playClick]);

  // Sign Toggle (±)
  const handleToggleSign = useCallback(() => {
    playClick('num');

    if (displayValue === '0' || displayValue === 'Error' || displayValue === 'Cannot divide by 0') {
      return;
    }

    if (displayValue.startsWith('-')) {
      setDisplayValue(displayValue.slice(1));
    } else {
      setDisplayValue('-' + displayValue);
    }
  }, [displayValue, playClick]);

  // Percentage (%)
  const handlePercentage = useCallback(() => {
    playClick('op');

    const current = parseFloat(displayValue);
    if (isNaN(current)) return;

    let res: number;
    if (prevValue !== null && (operator === '+' || operator === '-')) {
      // e.g. 200 + 10% = 200 + 20
      res = (prevValue * current) / 100;
    } else {
      // standalone or multiplication/division factor e.g. 50% = 0.5
      res = current / 100;
    }

    const formatted = formatResultToString(res);
    setDisplayValue(formatted);
  }, [displayValue, prevValue, operator, playClick]);

  // Memory Handlers
  const handleMemoryClear = useCallback(() => {
    playClick('action');
    setMemory(0);
  }, [playClick]);

  const handleMemoryRecall = useCallback(() => {
    playClick('action');
    setDisplayValue(formatResultToString(memory));
    setWaitingForOperand(false);
  }, [memory, playClick]);

  const handleMemoryAdd = useCallback(() => {
    playClick('action');
    const current = parseFloat(displayValue);
    if (!isNaN(current)) {
      setMemory((prev) => parseFloat((prev + current).toPrecision(12)));
      setWaitingForOperand(true);
    }
  }, [displayValue, playClick]);

  const handleMemorySubtract = useCallback(() => {
    playClick('action');
    const current = parseFloat(displayValue);
    if (!isNaN(current)) {
      setMemory((prev) => parseFloat((prev - current).toPrecision(12)));
      setWaitingForOperand(true);
    }
  }, [displayValue, playClick]);

  // Restore history result
  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setDisplayValue(item.result);
    setWaitingForOperand(false);
    setExpression(`Loaded: ${item.expression}`);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const key = e.key;

      if (key >= '0' && key <= '9') {
        e.preventDefault();
        handleDigit(key);
      } else if (key === '.' || key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (key === '*' || key.toLowerCase() === 'x') {
        e.preventDefault();
        handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEqual();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlePercentage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleDecimal,
    handleOperator,
    handleEqual,
    handleBackspace,
    handleClear,
    handlePercentage,
  ]);

  // Determine clear label (C or AC)
  const clearLabel = displayValue !== '0' ? 'C' : 'AC';

  const isDark = theme === 'dark';
  const isRetro = theme === 'retro';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 transition-colors duration-300 ${
        isDark
          ? 'bg-neutral-950 text-neutral-100'
          : isRetro
          ? 'bg-[#0f1712] text-[#7bfb9d]'
          : 'bg-neutral-100 text-neutral-900'
      }`}
    >
      {/* Outer Calculator Shell */}
      <main
        className={`w-full max-w-sm sm:max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 relative ${
          isDark
            ? 'bg-neutral-900/90 border border-neutral-800 shadow-black/60'
            : isRetro
            ? 'bg-[#142018] border-2 border-[#2b3e32] shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
            : 'bg-white border border-neutral-200 shadow-neutral-300/60'
        }`}
      >
        {/* Header Controls: Brand, Sound, Theme, History */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold uppercase tracking-widest ${
                isDark
                  ? 'text-neutral-400'
                  : isRetro
                  ? 'text-[#7bfb9d]/70'
                  : 'text-neutral-500'
              }`}
            >
              Calculator
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Keyboard shortcut help */}
            <button
              type="button"
              onClick={() => setShowKeyboardHelp((prev) => !prev)}
              title="Keyboard shortcuts"
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                showKeyboardHelp
                  ? 'bg-amber-500/20 text-amber-500'
                  : isDark
                  ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                  : isRetro
                  ? 'hover:bg-[#233528] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                  : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? 'Mute sound' : 'Unmute key clicks'}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                soundEnabled
                  ? isDark
                    ? 'text-amber-400 hover:bg-neutral-800'
                    : isRetro
                    ? 'text-[#7bfb9d] hover:bg-[#233528]'
                    : 'text-amber-600 hover:bg-neutral-100'
                  : isDark
                  ? 'text-neutral-600 hover:bg-neutral-800'
                  : isRetro
                  ? 'text-[#7bfb9d]/30 hover:bg-[#233528]'
                  : 'text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme Toggle (Cycle: dark -> light -> retro -> dark) */}
            <button
              type="button"
              onClick={() => {
                if (theme === 'dark') setTheme('light');
                else if (theme === 'light') setTheme('retro');
                else setTheme('dark');
              }}
              title={`Switch theme (Current: ${theme})`}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                  : isRetro
                  ? 'hover:bg-[#233528] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                  : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              {theme === 'light' && <Sun className="w-4 h-4" />}
              {theme === 'retro' && <Monitor className="w-4 h-4" />}
            </button>

            {/* History Panel Button */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              title="Calculation history"
              className={`p-2 rounded-xl relative transition-colors cursor-pointer ${
                isDark
                  ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                  : isRetro
                  ? 'hover:bg-[#233528] text-[#7bfb9d]/80 hover:text-[#7bfb9d]'
                  : 'hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <History className="w-4 h-4" />
              {history.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-neutral-900" />
              )}
            </button>
          </div>
        </header>

        {/* Keyboard shortcut popover */}
        {showKeyboardHelp && (
          <div
            className={`mb-3 p-3 rounded-xl border text-xs leading-relaxed animate-fade-in ${
              isDark
                ? 'bg-neutral-800/90 border-neutral-700 text-neutral-300'
                : isRetro
                ? 'bg-[#1c2c22] border-[#2e4335] text-[#7bfb9d]'
                : 'bg-neutral-50 border-neutral-200 text-neutral-700'
            }`}
          >
            <div className="font-semibold mb-1 text-[11px] uppercase tracking-wider text-amber-500">
              Keyboard Shortcuts:
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[11px]">
              <div><span className="font-bold">0-9</span> : Numbers</div>
              <div><span className="font-bold">+, -, *, /</span> : Operators</div>
              <div><span className="font-bold">Enter / =</span> : Calculate</div>
              <div><span className="font-bold">Backspace</span> : Delete</div>
              <div><span className="font-bold">Esc / C</span> : Clear</div>
              <div><span className="font-bold">%</span> : Percentage</div>
            </div>
          </div>
        )}

        {/* Main Calculation Display */}
        <div className="mb-3">
          <Display
            expression={expression}
            displayValue={displayValue}
            hasMemory={memory !== 0}
            onBackspace={handleBackspace}
            theme={theme}
          />
        </div>

        {/* Memory Bar (MC, MR, M+, M-) */}
        <MemoryBar
          hasMemory={memory !== 0}
          onMemoryClear={handleMemoryClear}
          onMemoryRecall={handleMemoryRecall}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
          theme={theme}
        />

        {/* Numeric and Operator Keypad */}
        <Keypad
          onDigit={handleDigit}
          onOperator={handleOperator}
          onEqual={handleEqual}
          onClear={handleClear}
          onToggleSign={handleToggleSign}
          onPercentage={handlePercentage}
          onDecimal={handleDecimal}
          onBackspace={handleBackspace}
          activeOperator={waitingForOperand ? operator : null}
          clearLabel={clearLabel}
          theme={theme}
        />
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        theme={theme}
      />
    </div>
  );
}

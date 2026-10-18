import { Operator } from '../types';

/**
 * Perform precise arithmetic calculation
 */
export function calculate(first: number, second: number, operator: Operator): { result?: number; error?: string } {
  let res: number;
  switch (operator) {
    case '+':
      res = first + second;
      break;
    case '-':
      res = first - second;
      break;
    case '×':
      res = first * second;
      break;
    case '÷':
      if (second === 0) {
        return { error: 'Cannot divide by 0' };
      }
      res = first / second;
      break;
    default:
      return { result: second };
  }

  // Handle JavaScript IEEE 754 floating point issues like 0.1 + 0.2
  const cleaned = parseFloat(res.toPrecision(12));
  return { result: cleaned };
}

/**
 * Format a number or numeric string with localized thousand separators
 * while preserving ongoing decimal inputs like "12." or "0.00"
 */
export function formatDisplayValue(val: string): string {
  if (val === 'Error' || val === 'Cannot divide by 0' || val === 'Infinity' || val === '-Infinity' || val === 'NaN') {
    return val;
  }

  const isNegative = val.startsWith('-');
  const raw = isNegative ? val.slice(1) : val;

  const parts = raw.split('.');
  const integerPart = parts[0] || '0';
  const hasDecimal = parts.length > 1;
  const decimalPart = parts[1];

  // Format integer with commas
  const formattedInt = Number(integerPart).toLocaleString('en-US');

  let result = (isNegative ? '-' : '') + formattedInt;
  if (hasDecimal) {
    result += '.' + decimalPart;
  }
  return result;
}

/**
 * Clean scientific or extremely long number for compact display
 */
export function formatResultToString(num: number): string {
  if (!isFinite(num)) {
    return 'Error';
  }
  // If the number is huge or tiny, use exponential notation
  if (Math.abs(num) >= 1e15 || (Math.abs(num) > 0 && Math.abs(num) < 1e-7)) {
    return num.toExponential(6).replace('e+', 'e');
  }
  // Standard rounding up to 10 decimal places to remove floating noise
  const rounded = parseFloat(num.toPrecision(12));
  return rounded.toString();
}

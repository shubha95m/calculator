export type Operator = '+' | '-' | '×' | '÷';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type ThemeMode = 'dark' | 'light' | 'retro';

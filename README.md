# Standard Calculator App

A clean, responsive, tactile standard calculator application built with React, TypeScript, Tailwind CSS, and Motion.

## Features

- **Standard Operations**: Addition (`+`), subtraction (`−`), multiplication (`×`), division (`÷`), equals (`=`).
- **Additional Operations**: Percentage (`%`), sign inversion (`±`), decimal (`.`), backspace (`⌫`), and contextual Clear / All Clear (`C` / `AC`).
- **Memory Functions**: Memory Clear (`MC`), Memory Recall (`MR`), Memory Add (`M+`), and Memory Subtract (`M-`) with visual memory badge indicator.
- **Dynamic LCD Display**: Auto-adjusting font size prevents text clipping, plus live expression breadcrumb line and one-click copy to clipboard.
- **Calculation History**: Slide-over calculation tape to review, recall, or copy previous calculations.
- **Themes**: Dark Onyx, Clean Light, and Retro Digital LCD.
- **Audio Feedback**: Optional tactile key clicks synthesized using Web Audio API (with mute button).
- **Physical Keyboard Support**:
  - `0-9`: Numbers
  - `+`, `-`, `*`, `/`: Operators
  - `Enter` / `=`: Calculate
  - `Backspace`: Delete digit
  - `Esc` / `c`: Clear
  - `%`: Percentage

## Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Motion** (tactile button press animations)
- **Lucide Icons**
- **Vite**

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

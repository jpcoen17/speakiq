# 🎤 SpeakIQ – AI English Speaking Coach

A production-ready Next.js web application for practicing English speaking with real-time AI feedback.

---

## ✨ Features

- **🎤 Real-time Speech Recognition** — Uses Web Speech API (Chrome/Edge)
- **🧠 AI Grammar Analysis** — Rule-based engine detects and corrects grammar mistakes
- **🔊 Pronunciation Feedback** — Flags difficult words with pronunciation tips
- **📊 Scoring System** — Pronunciation, Grammar, Fluency, and Overall scores (0–100)
- **💬 AI Coach Feedback** — Friendly tutor messages with corrections and encouragement
- **🎯 4 Practice Modes** — Daily Conversation, Interview Sim, Travel English, Shadow Repeat
- **📱 Responsive Design** — Works on desktop and mobile
- **🌑 Dark Mode** — Premium dark UI with neon accents

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome or Edge browser (required for Web Speech API)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in Chrome/Edge
open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
speakiq/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Main app page
│   └── globals.css         # Global styles + animations
├── components/
│   ├── MicButton.tsx       # Animated microphone button
│   ├── WaveformVisualizer.tsx  # Live audio waveform
│   ├── TranscriptBox.tsx   # Real-time speech display
│   ├── FeedbackPanel.tsx   # AI feedback + corrections
│   ├── ScoreCard.tsx       # Animated score rings
│   ├── ModeSelector.tsx    # Practice mode tabs
│   ├── SessionHistory.tsx  # Past sessions list
│   └── StatsBar.tsx        # Session statistics
├── lib/
│   ├── aiEngine.ts         # Grammar analysis engine
│   ├── scoring.ts          # Score calculation logic
│   ├── speechProcessor.ts  # Web Speech API wrapper
│   └── store.ts            # Zustand state management
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.mjs
```

---

## 🧠 How the AI Engine Works

`lib/aiEngine.ts` contains a rule-based grammar analysis engine that:

1. **Detects grammar mistakes** using regex pattern matching
2. **Auto-corrects** the transcript
3. **Suggests improved vocabulary** for more natural English
4. **Generates pronunciation flags** for difficult words
5. **Produces friendly feedback** with encouragement

Grammar rules covered:
- Subject-verb agreement (he/she/it + don't → doesn't)
- Article usage (a → an before vowels)
- Double comparatives (more better → better)
- Irregular verbs (goed → went)
- Common errors (could of → could have)
- Capitalization of "I"
- And more...

---

## 🎯 Practice Modes

| Mode | Description |
|------|-------------|
| **Daily Conversation** | Everyday English topics |
| **Interview Simulation** | Job interview questions |
| **Travel English** | Travel scenarios and phrases |
| **Shadow Repeat** | Tongue twisters and repeat phrases |

---

## ⚠️ Browser Requirements

Web Speech API is required for microphone input. Supported browsers:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ⚠️ Safari (limited support)
- ❌ Firefox (not supported)

---

## 🛠️ Tech Stack

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe code
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations and transitions
- **Zustand** — Lightweight state management
- **Web Speech API** — Browser-native speech recognition

---

## 📄 License

MIT License — feel free to use and modify!

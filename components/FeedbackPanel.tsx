"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AIAnalysisResult } from "@/lib/aiEngine";

interface FeedbackPanelProps {
  analysis: AIAnalysisResult | null;
  isLoading?: boolean;
}

function Badge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    "Subject-Verb Agreement": { bg: "rgba(255,150,0,0.1)", text: "#ffaa00", border: "rgba(255,170,0,0.3)" },
    "Article Usage": { bg: "rgba(0,212,255,0.1)", text: "#00d4ff", border: "rgba(0,212,255,0.3)" },
    Capitalization: { bg: "rgba(191,0,255,0.1)", text: "#cc44ff", border: "rgba(191,0,255,0.3)" },
    "Double Comparative": { bg: "rgba(255,68,68,0.1)", text: "#ff6666", border: "rgba(255,68,68,0.3)" },
    "Double Superlative": { bg: "rgba(255,68,68,0.1)", text: "#ff6666", border: "rgba(255,68,68,0.3)" },
    "Irregular Verb": { bg: "rgba(0,255,136,0.1)", text: "#00ff88", border: "rgba(0,255,136,0.3)" },
    "Common Error": { bg: "rgba(255,200,0,0.1)", text: "#ffcc00", border: "rgba(255,200,0,0.3)" },
    "Past Tense": { bg: "rgba(0,255,136,0.1)", text: "#00cc66", border: "rgba(0,255,136,0.3)" },
  };

  const style = colors[type] || {
    bg: "rgba(100,100,100,0.1)",
    text: "#aaaaaa",
    border: "rgba(100,100,100,0.3)",
  };

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-mono"
      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      {type}
    </span>
  );
}

export default function FeedbackPanel({ analysis, isLoading }: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
            Processing...
          </span>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 bg-slate-800 rounded animate-pulse w-4/5" />
          </div>
        ))}
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-slate-300 text-sm font-medium"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            AI Feedback
          </span>
        </div>
        <div className="space-y-3 opacity-30">
          {["Grammar Analysis", "Pronunciation Tips", "Coach Message"].map((section) => (
            <div key={section} className="border border-slate-800 rounded-xl p-3">
              <p className="text-slate-600 text-xs uppercase tracking-wider font-mono mb-2">{section}</p>
              <div className="space-y-1">
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">Feedback will appear after you speak</p>
      </div>
    );
  }

  const hasNoMistakes = analysis.mistakes.length === 0;
  const hasNoPronunciation = analysis.pronunciationFlags.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-slate-300 text-sm font-medium" style={{ fontFamily: "'Exo 2', sans-serif" }}>
          AI Feedback
        </span>
      </div>

      {/* Coach message */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl p-4"
        style={{
          background: "rgba(0,212,255,0.05)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}
      >
        <div className="flex gap-3">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
            style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}
          >
            🤖
          </div>
          <div>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">SpeakIQ Coach</p>
            <p className="text-slate-200 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {analysis.feedbackMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Corrected text */}
      <AnimatePresence>
        {analysis.correctedText !== analysis.originalText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.15)",
            }}
          >
            <p className="text-xs font-mono uppercase tracking-wider text-green-500/70">
              ✓ Corrected Version
            </p>
            <p className="text-slate-200 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {analysis.correctedText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Improved text */}
      <AnimatePresence>
        {analysis.improvedText !== analysis.correctedText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.25 }}
            className="rounded-xl p-4 space-y-2"
            style={{
              background: "rgba(191,0,255,0.04)",
              border: "1px solid rgba(191,0,255,0.15)",
            }}
          >
            <p className="text-xs font-mono uppercase tracking-wider text-purple-400/70">
              ✨ Enhanced Version
            </p>
            <p className="text-slate-200 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {analysis.improvedText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grammar Mistakes */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Grammar Analysis
        </p>

        {hasNoMistakes ? (
          <div
            className="rounded-lg p-3 flex items-center gap-2"
            style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.1)" }}
          >
            <span className="text-green-400">✓</span>
            <span className="text-slate-300 text-sm">No grammar errors found! Perfect sentence.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {analysis.mistakes.map((mistake, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + idx * 0.08 }}
                className="rounded-lg p-3 space-y-2"
                style={{ background: "rgba(255,100,0,0.05)", border: "1px solid rgba(255,100,0,0.12)" }}
              >
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs line-through font-mono opacity-70">
                      {mistake.original}
                    </span>
                    <span className="text-slate-500 text-xs">→</span>
                    <span className="text-green-400 text-xs font-mono">{mistake.correction}</span>
                  </div>
                  <Badge type={mistake.type} />
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {mistake.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pronunciation Flags */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pronunciation Tips
        </p>

        {hasNoPronunciation ? (
          <div
            className="rounded-lg p-3 flex items-center gap-2"
            style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}
          >
            <span className="text-cyan-400">✓</span>
            <span className="text-slate-300 text-sm">No pronunciation concerns detected.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {analysis.pronunciationFlags.map((flag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + idx * 0.07 }}
                className="rounded-lg p-3 space-y-1"
                style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-xs font-bold">&quot;{flag.word}&quot;</span>
                  <span className="text-slate-500 text-xs">—</span>
                  <span className="text-slate-400 text-xs">{flag.issue}</span>
                </div>
                <p className="text-slate-500 text-xs">💡 {flag.tip}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl p-3 border border-slate-700/50"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-1">Summary</p>
        <p className="text-slate-400 text-xs leading-relaxed">{analysis.explanation}</p>
      </motion.div>
    </motion.div>
  );
}

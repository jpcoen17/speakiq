"use client";

import { motion } from "framer-motion";
import type { SessionScore } from "@/lib/scoring";
import { getScoreColor, getScoreLabel } from "@/lib/scoring";

interface ScoreCardProps {
  scores: SessionScore | null;
  isLoading?: boolean;
}

function ScoreRing({
  score,
  label,
  color,
  size = 80,
  delay = 0,
}: {
  score: number;
  label: string;
  color: string;
  size?: number;
  delay?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Score arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="font-display font-bold text-white"
            style={{ fontSize: size * 0.22, fontFamily: "'Exo 2', sans-serif" }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="text-center">
        <p
          className="text-slate-400 text-xs uppercase tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {label}
        </p>
        <p className="text-xs font-medium" style={{ color, fontFamily: "'DM Sans', sans-serif" }}>
          {getScoreLabel(score)}
        </p>
      </div>
    </motion.div>
  );
}

export default function ScoreCard({ scores, isLoading }: ScoreCardProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span
            className="text-slate-400 text-xs uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Analyzing...
          </span>
        </div>
        <div className="flex justify-around">
          {["Pronunciation", "Grammar", "Fluency"].map((label) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-slate-800/50 animate-pulse border border-slate-700/30" />
              <div className="w-16 h-3 rounded bg-slate-800 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!scores) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-slate-300 text-sm font-medium"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            Performance Score
          </span>
        </div>
        <div className="flex justify-around opacity-30">
          {[
            { label: "Pronunciation", score: 0 },
            { label: "Grammar", score: 0 },
            { label: "Fluency", score: 0 },
          ].map(({ label, score }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-20 rounded-full border-4 border-slate-700 flex items-center justify-center"
              >
                <span className="text-slate-600 font-bold text-lg">–</span>
              </div>
              <p
                className="text-slate-600 text-xs uppercase tracking-wider"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">
          Speak to receive your score
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-slate-300 text-sm font-medium"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            Performance Score
          </span>
        </div>

        {/* Overall grade badge */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.8 }}
          className="flex flex-col items-center px-3 py-1 rounded-lg"
          style={{
            background: `${scores.gradeColor}15`,
            border: `1px solid ${scores.gradeColor}40`,
          }}
        >
          <span
            className="text-2xl font-black"
            style={{ color: scores.gradeColor, fontFamily: "'Exo 2', sans-serif", lineHeight: 1 }}
          >
            {scores.grade}
          </span>
          <span
            className="text-xs"
            style={{ color: scores.gradeColor, opacity: 0.7, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {scores.overall}/100
          </span>
        </motion.div>
      </div>

      {/* Score rings */}
      <div className="flex justify-around mb-5">
        <ScoreRing
          score={scores.pronunciation}
          label="Pronunciation"
          color={getScoreColor(scores.pronunciation)}
          delay={0}
        />
        <ScoreRing
          score={scores.grammar}
          label="Grammar"
          color={getScoreColor(scores.grammar)}
          delay={0.15}
        />
        <ScoreRing
          score={scores.fluency}
          label="Fluency"
          color={getScoreColor(scores.fluency)}
          delay={0.3}
        />
      </div>

      {/* Overall bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span
            className="text-slate-400 uppercase tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Overall
          </span>
          <span className="font-mono text-white font-bold">{scores.overall}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${scores.overall}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #00d4ff, ${scores.gradeColor})`,
              boxShadow: `0 0 10px ${scores.gradeColor}60`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

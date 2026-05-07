"use client";

import { motion } from "framer-motion";
import type { SessionEntry } from "@/lib/store";

interface StatsBarProps {
  sessions: SessionEntry[];
  totalSessions: number;
}

export default function StatsBar({ sessions, totalSessions }: StatsBarProps) {
  const avgOverall =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.scores.overall, 0) / sessions.length
        )
      : 0;

  const avgGrammar =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.scores.grammar, 0) / sessions.length
        )
      : 0;

  const avgPronunciation =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.scores.pronunciation, 0) / sessions.length
        )
      : 0;

  const stats = [
    { label: "Sessions", value: totalSessions, unit: "", color: "#00d4ff" },
    { label: "Avg Score", value: avgOverall, unit: "%", color: "#00ff88" },
    { label: "Grammar", value: avgGrammar, unit: "%", color: "#bf00ff" },
    { label: "Pronunciation", value: avgPronunciation, unit: "%", color: "#ffcc00" },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: `${stat.color}08`,
            border: `1px solid ${stat.color}20`,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
          <span className="text-slate-500 text-xs font-mono">{stat.label}:</span>
          <span className="text-white text-xs font-bold font-mono">
            {stat.value}{stat.unit}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

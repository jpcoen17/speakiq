"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SessionEntry } from "@/lib/store";
import { getScoreColor } from "@/lib/scoring";

interface SessionHistoryProps {
  sessions: SessionEntry[];
  onSelectSession: (session: SessionEntry) => void;
  currentSessionId?: string;
}

export default function SessionHistory({
  sessions,
  onSelectSession,
  currentSessionId,
}: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-4">
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-3">
          Session History
        </p>
        <p className="text-slate-600 text-xs text-center py-4">
          No sessions yet. Start speaking!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-3">
        Session History ({sessions.length})
      </p>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        <AnimatePresence>
          {sessions.map((session, idx) => {
            const isActive = session.id === currentSessionId;
            const time = new Date(session.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.button
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onSelectSession(session)}
                className={`w-full text-left rounded-lg p-2.5 transition-all duration-200 ${
                  isActive ? "ring-1" : "hover:bg-slate-800/40"
                }`}
                style={{
                  background: isActive ? "rgba(0,212,255,0.06)" : "rgba(255,255,255,0.02)",
                  borderLeft: `3px solid ${getScoreColor(session.scores.overall)}`,
                  ringColor: isActive ? "rgba(0,212,255,0.3)" : "transparent",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-slate-300 text-xs leading-snug line-clamp-1 flex-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {session.transcript}
                  </p>
                  <span
                    className="text-xs font-bold flex-shrink-0"
                    style={{ color: getScoreColor(session.scores.overall) }}
                  >
                    {session.scores.overall}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-600 text-xs font-mono">{time}</span>
                  <span className="text-slate-700 text-xs">·</span>
                  <span className="text-slate-600 text-xs capitalize">{session.mode}</span>
                  <span className="text-slate-700 text-xs">·</span>
                  <span className="text-slate-600 text-xs">{Math.round(session.duration)}s</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

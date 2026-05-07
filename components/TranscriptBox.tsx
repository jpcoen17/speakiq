"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TranscriptBoxProps {
  interimText: string;
  finalText: string;
  isRecording: boolean;
  promptText: string;
}

export default function TranscriptBox({
  interimText,
  finalText,
  isRecording,
  promptText,
}: TranscriptBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interimText, finalText]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 min-h-[140px]">
      {/* Prompt */}
      <div className="flex items-start gap-2">
        <div
          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#00d4ff" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="text-cyan-500/60 text-xs font-mono uppercase tracking-wider mr-2">Prompt:</span>
          {promptText}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700/50" />

      {/* Transcript area */}
      <div className="flex-1 min-h-[60px] relative">
        <AnimatePresence mode="wait">
          {!finalText && !interimText && !isRecording ? (
            <motion.p
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-600 text-sm italic"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Your speech will appear here in real-time...
            </motion.p>
          ) : (
            <motion.div
              key="transcript"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {finalText && (
                <p
                  className="text-slate-100 text-base leading-relaxed mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                >
                  {finalText}
                </p>
              )}
              {interimText && (
                <p
                  className="text-slate-400 text-base leading-relaxed italic"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px" }}
                >
                  {interimText}
                  {isRecording && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 ml-1 bg-cyan-400 align-middle"
                    />
                  )}
                </p>
              )}
              {isRecording && !interimText && (
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-5 bg-cyan-400"
                  />
                  <span className="text-slate-500 text-sm italic">Listening...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Word count */}
      {(finalText || interimText) && (
        <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>
            {(finalText + " " + interimText)
              .trim()
              .split(/\s+/)
              .filter(Boolean).length}{" "}
            words
          </span>
          {isRecording && (
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-red-400"
            >
              ● LIVE
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}

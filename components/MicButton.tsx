"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MicButtonProps {
  isRecording: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({
  isRecording,
  isSupported,
  onStart,
  onStop,
}: MicButtonProps) {
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!ringRef.current) return;
    // Reset animation on state change
    ringRef.current.style.animation = "none";
    void ringRef.current.getBoundingClientRect();
    ringRef.current.style.animation = "";
  }, [isRecording]);

  const handleClick = () => {
    if (!isSupported) return;
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Outer ring indicators */}
      <div className="relative flex items-center justify-center">
        {/* Animated rings when recording */}
        <AnimatePresence>
          {isRecording && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-red-500/30"
                  initial={{ width: 120, height: 120, opacity: 0.8 }}
                  animate={{ width: 120 + i * 40, height: 120 + i * 40, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Static outer ring */}
        <AnimatePresence>
          {!isRecording && (
            <>
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-cyan-500/20"
                  initial={{ width: 120 + i * 30, height: 120 + i * 30, opacity: 0.5 }}
                  animate={{
                    width: [120 + i * 30, 140 + i * 30, 120 + i * 30],
                    height: [120 + i * 30, 140 + i * 30, 120 + i * 30],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          onClick={handleClick}
          disabled={!isSupported}
          whileHover={isSupported ? { scale: 1.05 } : {}}
          whileTap={isSupported ? { scale: 0.95 } : {}}
          className={`
            relative z-10 w-28 h-28 rounded-full flex items-center justify-center
            transition-all duration-300 cursor-pointer
            ${!isSupported ? "opacity-40 cursor-not-allowed" : ""}
            ${
              isRecording
                ? "bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400 mic-button recording"
                : "bg-gradient-to-br from-slate-800 to-dark-800 border-2 border-cyan-500/50 mic-button"
            }
          `}
          style={{
            boxShadow: isRecording
              ? "0 0 40px rgba(255,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 0 30px rgba(0,212,255,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Inner glow */}
          <div
            className={`absolute inset-2 rounded-full opacity-20 ${
              isRecording ? "bg-red-400" : "bg-cyan-400"
            }`}
          />

          {/* Mic icon */}
          <div className="relative z-10 flex flex-col items-center">
            {isRecording ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center"
              >
                {/* Stop icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="6" width="12" height="12" rx="2" fill="#ff4444" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                {/* Microphone icon */}
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="9"
                    y="2"
                    width="6"
                    height="11"
                    rx="3"
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="2"
                  />
                  <path
                    d="M5 11a7 7 0 0 0 14 0"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="18"
                    x2="12"
                    y2="22"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="22"
                    x2="16"
                    y2="22"
                    stroke="#00d4ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.button>
      </div>

      {/* Status label */}
      <motion.div
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-1"
      >
        {isRecording ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-red-400 font-mono text-sm font-medium tracking-wider uppercase">
              Recording...
            </span>
          </div>
        ) : (
          <span
            className="text-cyan-400/70 font-mono text-sm tracking-wider uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {isSupported ? "Tap to Speak" : "Not Supported"}
          </span>
        )}
        <span className="text-slate-600 text-xs font-mono">
          {isSupported ? "Web Speech API Active" : "Use Chrome/Edge for best results"}
        </span>
      </motion.div>
    </div>
  );
}

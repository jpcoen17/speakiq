"use client";

import { motion, AnimatePresence } from "framer-motion";

interface WaveformVisualizerProps {
  isRecording: boolean;
}

export default function WaveformVisualizer({ isRecording }: WaveformVisualizerProps) {
  const bars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-16 w-full max-w-xs mx-auto">
      <AnimatePresence>
        {isRecording ? (
          bars.map((i) => (
            <motion.div
              key={i}
              className="wave-bar flex-shrink-0"
              style={{
                width: "3px",
                borderRadius: "2px",
                background: "linear-gradient(to top, #00ff88, #00d4ff)",
              }}
              animate={{
                scaleY: [0.2, Math.random() * 0.8 + 0.2, 0.2],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.6,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
              initial={{ scaleY: 0.2 }}
            />
          ))
        ) : (
          bars.map((i) => (
            <motion.div
              key={i}
              className="flex-shrink-0"
              style={{
                width: "3px",
                height: "4px",
                borderRadius: "2px",
                background: "rgba(0,212,255,0.2)",
              }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}

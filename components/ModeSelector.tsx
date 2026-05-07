"use client";

import { motion } from "framer-motion";
import type { PracticeMode } from "@/lib/store";

interface Mode {
  id: PracticeMode;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const modes: Mode[] = [
  {
    id: "daily",
    label: "Daily Conversation",
    icon: "💬",
    description: "Everyday English for real life",
    color: "#00d4ff",
  },
  {
    id: "interview",
    label: "Interview Sim",
    icon: "💼",
    description: "Ace your next job interview",
    color: "#00ff88",
  },
  {
    id: "travel",
    label: "Travel English",
    icon: "✈️",
    description: "Navigate the world confidently",
    color: "#ffcc00",
  },
  {
    id: "shadow",
    label: "Shadow Repeat",
    icon: "🔁",
    description: "Repeat & perfect your accent",
    color: "#bf00ff",
  },
];

interface ModeSelectorProps {
  currentMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  disabled?: boolean;
}

export default function ModeSelector({
  currentMode,
  onModeChange,
  disabled,
}: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {modes.map((mode, idx) => {
        const isActive = currentMode === mode.id;
        return (
          <motion.button
            key={mode.id}
            onClick={() => !disabled && onModeChange(mode.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07 }}
            whileHover={!disabled ? { scale: 1.03 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            disabled={disabled}
            className={`relative rounded-xl p-3 text-left transition-all duration-300 cursor-pointer
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            style={{
              background: isActive
                ? `${mode.color}12`
                : "rgba(255,255,255,0.03)",
              border: isActive
                ? `1px solid ${mode.color}40`
                : "1px solid rgba(255,255,255,0.06)",
              boxShadow: isActive ? `0 0 20px ${mode.color}15` : "none",
            }}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: `${mode.color}08`,
                  border: `1px solid ${mode.color}30`,
                }}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg leading-none">{mode.icon}</span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full ml-auto"
                    style={{ background: mode.color }}
                  />
                )}
              </div>
              <p
                className="text-xs font-semibold leading-tight"
                style={{
                  color: isActive ? mode.color : "#94a3b8",
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                {mode.label}
              </p>
              <p className="text-slate-600 text-xs mt-0.5 leading-tight hidden sm:block">
                {mode.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

import { create } from "zustand";
import type { AIAnalysisResult } from "./aiEngine";
import type { SessionScore } from "./scoring";

export type PracticeMode = "daily" | "interview" | "travel" | "shadow";

export interface SessionEntry {
  id: string;
  transcript: string;
  analysis: AIAnalysisResult;
  scores: SessionScore;
  timestamp: number;
  duration: number;
  mode: PracticeMode;
}

interface SpeakIQState {
  mode: PracticeMode;
  isRecording: boolean;
  interimTranscript: string;
  currentPrompt: string;
  sessions: SessionEntry[];
  currentSession: SessionEntry | null;
  totalSessions: number;

  setMode: (mode: PracticeMode) => void;
  setIsRecording: (val: boolean) => void;
  setInterimTranscript: (text: string) => void;
  setCurrentPrompt: (prompt: string) => void;
  addSession: (entry: SessionEntry) => void;
  setCurrentSession: (entry: SessionEntry | null) => void;
  clearSessions: () => void;
}

export const useSpeakIQStore = create<SpeakIQState>((set) => ({
  mode: "daily",
  isRecording: false,
  interimTranscript: "",
  currentPrompt: "Tell me about yourself.",
  sessions: [],
  currentSession: null,
  totalSessions: 0,

  setMode: (mode) => set({ mode }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  setCurrentPrompt: (currentPrompt) => set({ currentPrompt }),
  addSession: (entry) =>
    set((state) => ({
      sessions: [entry, ...state.sessions].slice(0, 20),
      currentSession: entry,
      totalSessions: state.totalSessions + 1,
    })),
  setCurrentSession: (currentSession) => set({ currentSession }),
  clearSessions: () => set({ sessions: [], currentSession: null, totalSessions: 0 }),
}));

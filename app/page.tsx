"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MicButton from "@/components/MicButton";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import TranscriptBox from "@/components/TranscriptBox";
import FeedbackPanel from "@/components/FeedbackPanel";
import ScoreCard from "@/components/ScoreCard";
import ModeSelector from "@/components/ModeSelector";
import SessionHistory from "@/components/SessionHistory";
import StatsBar from "@/components/StatsBar";
import { SpeechProcessor } from "@/lib/speechProcessor";
import { analyzeText, getContextualPrompt } from "@/lib/aiEngine";
import { calculateScores } from "@/lib/scoring";
import { useSpeakIQStore, type SessionEntry, type PracticeMode } from "@/lib/store";

export default function SpeakIQPage() {
  const {
    mode,
    isRecording,
    interimTranscript,
    currentPrompt,
    sessions,
    currentSession,
    totalSessions,
    setMode,
    setIsRecording,
    setInterimTranscript,
    setCurrentPrompt,
    addSession,
    setCurrentSession,
    clearSessions,
  } = useSpeakIQStore();

  const speechProcessorRef = useRef<SpeechProcessor | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const durationRef = useRef(0);

  // Initialize speech processor
  useEffect(() => {
    const processor = new SpeechProcessor();
    speechProcessorRef.current = processor;
    setIsSupported(processor.isSupported());

    return () => {
      processor.stop();
    };
  }, []);

  // Set initial prompt
  useEffect(() => {
    setCurrentPrompt(getContextualPrompt(mode));
  }, [mode, setCurrentPrompt]);

  const handleStartRecording = useCallback(() => {
    const processor = speechProcessorRef.current;
    if (!processor) return;

    setErrorMessage("");
    setFinalTranscript("");
    setInterimTranscript("");
    setIsRecording(true);

    processor.start(
      (text, isFinal) => {
        if (isFinal) {
          setFinalTranscript(text);
          setInterimTranscript("");
        } else {
          setInterimTranscript(text);
        }
      },
      (error) => {
        setErrorMessage(error);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
        durationRef.current = processor.getDuration();
      }
    );
  }, [setInterimTranscript, setIsRecording]);

  const handleStopRecording = useCallback(() => {
    const processor = speechProcessorRef.current;
    if (processor) {
      processor.stop();
      durationRef.current = processor.getDuration();
    }
    setIsRecording(false);
  }, [setIsRecording]);

  // Process transcript when recording ends and we have text
  useEffect(() => {
    if (!isRecording && finalTranscript && finalTranscript.trim().length > 0) {
      processTranscript(finalTranscript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, finalTranscript]);

  const processTranscript = async (text: string) => {
    setIsAnalyzing(true);

    // Simulate slight processing delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const analysis = analyzeText(text);
    const scores = calculateScores(analysis, text, durationRef.current || 5);

    const entry: SessionEntry = {
      id: Date.now().toString(),
      transcript: text,
      analysis,
      scores,
      timestamp: Date.now(),
      duration: durationRef.current || 5,
      mode,
    };

    addSession(entry);
    setIsAnalyzing(false);

    // Get next prompt
    setCurrentPrompt(getContextualPrompt(mode));
  };

  const handleModeChange = (newMode: PracticeMode) => {
    if (isRecording) handleStopRecording();
    setMode(newMode);
    setFinalTranscript("");
    setInterimTranscript("");
  };

  const handleSelectSession = (session: SessionEntry) => {
    setCurrentSession(session);
    setFinalTranscript(session.transcript);
  };

  const handleNewPrompt = () => {
    if (!isRecording) {
      setCurrentPrompt(getContextualPrompt(mode));
    }
  };

  const displayAnalysis = currentSession?.analysis ?? null;
  const displayScores = currentSession?.scores ?? null;

  return (
    <div
      className="min-h-screen bg-grid relative overflow-x-hidden"
      style={{ background: "var(--dark-950)" }}
    >
      {/* Grid overlay */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Ambient glows */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed bottom-1/4 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,255,136,0.1))",
                border: "1px solid rgba(0,212,255,0.3)",
                boxShadow: "0 0 20px rgba(0,212,255,0.15)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="11" rx="3" stroke="#00d4ff" strokeWidth="2" />
                <path d="M5 11a7 7 0 0 0 14 0" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="18" x2="12" y2="22" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="22" x2="16" y2="22" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1
                className="gradient-text text-2xl font-black leading-none"
                style={{ fontFamily: "'Exo 2', sans-serif" }}
              >
                SpeakIQ
              </h1>
              <p className="text-slate-600 text-xs font-mono mt-0.5">AI English Speaking Coach</p>
            </div>
          </div>

          {/* Stats + controls */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="hidden md:block">
              <StatsBar sessions={sessions} totalSessions={totalSessions} />
            </div>
            {sessions.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 transition-colors font-mono border border-slate-800 hover:border-red-500/30"
              >
                Clear
              </button>
            )}
          </div>
        </motion.header>

        {/* ── Mode Selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <ModeSelector
            currentMode={mode}
            onModeChange={handleModeChange}
            disabled={isRecording}
          />
        </motion.div>

        {/* ── Error message ── */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2"
              style={{ background: "rgba(255,68,68,0.08)", border: "1px solid rgba(255,68,68,0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-red-400 text-sm">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage("")}
                className="ml-auto text-red-400/50 hover:text-red-400"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ═══ LEFT: Mic + Transcript ═══ */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mic Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="glass-card rounded-2xl p-6 flex flex-col items-center gap-5"
            >
              {/* Waveform */}
              <WaveformVisualizer isRecording={isRecording} />

              {/* Mic button */}
              <MicButton
                isRecording={isRecording}
                isSupported={isSupported}
                onStart={handleStartRecording}
                onStop={handleStopRecording}
              />

              {/* Recording tip */}
              <div
                className="w-full rounded-xl p-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <p className="text-slate-600 text-xs">
                  {isRecording
                    ? "🎙️ Speak clearly — tap again to stop"
                    : "Press the mic button and start speaking in English"}
                </p>
              </div>
            </motion.div>

            {/* Prompt card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-xs font-mono uppercase tracking-wider">
                  Today&apos;s Prompt
                </p>
                <button
                  onClick={handleNewPrompt}
                  disabled={isRecording}
                  className="text-xs text-cyan-400/60 hover:text-cyan-400 transition-colors font-mono disabled:opacity-30"
                >
                  ↻ New
                </button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                &quot;{currentPrompt}&quot;
              </p>
            </motion.div>

            {/* Transcript box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <TranscriptBox
                interimText={interimTranscript}
                finalText={finalTranscript}
                isRecording={isRecording}
                promptText={currentPrompt}
              />
            </motion.div>

            {/* Session history (mobile/tablet visible) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden"
            >
              <SessionHistory
                sessions={sessions}
                onSelectSession={handleSelectSession}
                currentSessionId={currentSession?.id}
              />
            </motion.div>
          </div>

          {/* ═══ RIGHT: Feedback + Scores ═══ */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ScoreCard scores={displayScores} isLoading={isAnalyzing} />
            </motion.div>

            {/* Feedback panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="flex-1"
            >
              <FeedbackPanel analysis={displayAnalysis} isLoading={isAnalyzing} />
            </motion.div>

            {/* Session History — desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <SessionHistory
                sessions={sessions}
                onSelectSession={handleSelectSession}
                currentSessionId={currentSession?.id}
              />
            </motion.div>
          </div>
        </div>

        {/* ── Footer ── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: isSupported ? "#00ff88" : "#ff4444",
                boxShadow: isSupported
                  ? "0 0 8px rgba(0,255,136,0.8)"
                  : "0 0 8px rgba(255,68,68,0.8)",
              }}
            />
            <span className="text-slate-600 text-xs font-mono">
              {isSupported ? "Web Speech API Connected" : "Speech API Unavailable — use Chrome/Edge"}
            </span>
          </div>
          <p className="text-slate-700 text-xs font-mono">
            SpeakIQ v1.0 · AI English Coach · Powered by Web Speech API
          </p>
        </motion.footer>
      </div>

      {/* ── Clear Confirm Modal ── */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(2,4,8,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                Clear All Sessions?
              </h3>
              <p className="text-slate-400 text-sm mb-5">
                This will remove all {sessions.length} session{sessions.length !== 1 ? "s" : ""} from your history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearSessions();
                    setFinalTranscript("");
                    setInterimTranscript("");
                    setShowClearConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import type { AIAnalysisResult } from "./aiEngine";

export interface SessionScore {
  pronunciation: number;
  grammar: number;
  fluency: number;
  overall: number;
  grade: string;
  gradeColor: string;
}

export function calculateScores(
  analysis: AIAnalysisResult,
  transcript: string,
  durationSeconds: number
): SessionScore {
  // Grammar Score: Start at 100, deduct per mistake
  const grammarBase = 100;
  const grammarDeduction = analysis.mistakes.length * 12;
  const grammarScore = Math.max(20, grammarBase - grammarDeduction);

  // Pronunciation Score: Based on flags and word difficulty
  const pronunciationBase = 90;
  const pronunciationDeduction = analysis.pronunciationFlags.length * 8;
  // Add some randomness for realism (±10)
  const pronunciationRandom = Math.floor(Math.random() * 20) - 10;
  const pronunciationScore = Math.min(
    100,
    Math.max(30, pronunciationBase - pronunciationDeduction + pronunciationRandom)
  );

  // Fluency Score: Based on word count, pace, and sentence length
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wordsPerMinute = durationSeconds > 0 ? (wordCount / durationSeconds) * 60 : 100;

  let fluencyScore: number;
  if (wordsPerMinute >= 100 && wordsPerMinute <= 160) {
    fluencyScore = 90 + Math.floor(Math.random() * 10);
  } else if (wordsPerMinute >= 70 && wordsPerMinute < 100) {
    fluencyScore = 70 + Math.floor(Math.random() * 15);
  } else if (wordsPerMinute > 160 && wordsPerMinute <= 200) {
    fluencyScore = 75 + Math.floor(Math.random() * 10);
  } else if (wordsPerMinute < 70) {
    fluencyScore = 50 + Math.floor(Math.random() * 20);
  } else {
    fluencyScore = 60 + Math.floor(Math.random() * 15);
  }

  // Bonus for longer sentences (shows confidence)
  if (wordCount >= 10) fluencyScore = Math.min(100, fluencyScore + 5);
  if (wordCount >= 20) fluencyScore = Math.min(100, fluencyScore + 5);

  // Overall: weighted average
  const overall = Math.round(
    grammarScore * 0.35 + pronunciationScore * 0.35 + fluencyScore * 0.30
  );

  // Grade
  let grade: string;
  let gradeColor: string;

  if (overall >= 90) {
    grade = "A+";
    gradeColor = "#00ff88";
  } else if (overall >= 80) {
    grade = "A";
    gradeColor = "#00d4ff";
  } else if (overall >= 70) {
    grade = "B+";
    gradeColor = "#00d4ff";
  } else if (overall >= 60) {
    grade = "B";
    gradeColor = "#ffcc00";
  } else if (overall >= 50) {
    grade = "C";
    gradeColor = "#ff8800";
  } else {
    grade = "D";
    gradeColor = "#ff4444";
  }

  return {
    pronunciation: pronunciationScore,
    grammar: grammarScore,
    fluency: fluencyScore,
    overall,
    grade,
    gradeColor,
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Needs Work";
  return "Keep Practicing";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#00d4ff";
  if (score >= 40) return "#ffcc00";
  return "#ff4444";
}

export interface AIAnalysisResult {
  originalText: string;
  correctedText: string;
  improvedText: string;
  explanation: string;
  feedbackMessage: string;
  mistakes: GrammarMistake[];
  pronunciationFlags: PronunciationFlag[];
}

export interface GrammarMistake {
  original: string;
  correction: string;
  type: string;
  explanation: string;
}

export interface PronunciationFlag {
  word: string;
  issue: string;
  tip: string;
}

// Grammar rules
const grammarRules: Array<{
  pattern: RegExp;
  fix: (match: string, ...groups: string[]) => string;
  type: string;
  explanation: string;
}> = [
  {
    pattern: /\bi am\b/gi,
    fix: () => "I am",
    type: "Capitalization",
    explanation: "The pronoun 'I' should always be capitalized.",
  },
  {
    pattern: /\b(he|she|it) (don't)\b/gi,
    fix: (_m, subj) => `${subj} doesn't`,
    type: "Subject-Verb Agreement",
    explanation: "Use 'doesn't' with third-person singular subjects (he/she/it).",
  },
  {
    pattern: /\b(i) (was|were) going\b/gi,
    fix: () => "I was going",
    type: "Past Tense",
    explanation: "'I' always takes 'was' in past tense, not 'were'.",
  },
  {
    pattern: /\bthey was\b/gi,
    fix: () => "they were",
    type: "Subject-Verb Agreement",
    explanation: "Use 'were' with 'they', not 'was'.",
  },
  {
    pattern: /\bmore better\b/gi,
    fix: () => "better",
    type: "Double Comparative",
    explanation: "'Better' is already comparative. Don't use 'more' before it.",
  },
  {
    pattern: /\bmost fastest\b/gi,
    fix: () => "fastest",
    type: "Double Superlative",
    explanation: "'Fastest' is already superlative. Don't use 'most' before it.",
  },
  {
    pattern: /\b(i) (goed|went) to\b/gi,
    fix: (_m, subj) => `${subj} went to`,
    type: "Irregular Verb",
    explanation: "The past tense of 'go' is 'went', not 'goed'.",
  },
  {
    pattern: /\b(i|we|they|you) has\b/gi,
    fix: (_m, subj) => `${subj} have`,
    type: "Subject-Verb Agreement",
    explanation: "Use 'have' with I/we/they/you, and 'has' only with he/she/it.",
  },
  {
    pattern: /\b(he|she|it) have\b/gi,
    fix: (_m, subj) => `${subj} has`,
    type: "Subject-Verb Agreement",
    explanation: "Use 'has' with he/she/it.",
  },
  {
    pattern: /\bcould of\b/gi,
    fix: () => "could have",
    type: "Common Error",
    explanation: "The correct phrase is 'could have', not 'could of'.",
  },
  {
    pattern: /\bshould of\b/gi,
    fix: () => "should have",
    type: "Common Error",
    explanation: "The correct phrase is 'should have', not 'should of'.",
  },
  {
    pattern: /\bwould of\b/gi,
    fix: () => "would have",
    type: "Common Error",
    explanation: "The correct phrase is 'would have', not 'would of'.",
  },
  {
    pattern: /\bthere is (\w+s)\b/gi,
    fix: (_m, noun) => `there are ${noun}`,
    type: "Subject-Verb Agreement",
    explanation: "Use 'there are' with plural nouns.",
  },
  {
    pattern: /\b(a) ([aeiou]\w+)/gi,
    fix: (_m, _art, noun) => {
      const startsWithVowel = /^[aeiou]/i.test(noun);
      return startsWithVowel ? `an ${noun}` : `a ${noun}`;
    },
    type: "Article Usage",
    explanation: "Use 'an' before words that begin with a vowel sound.",
  },
];

// Pronunciation-difficult word patterns
const pronunciationPatterns: Array<{
  pattern: RegExp;
  issue: string;
  tip: string;
}> = [
  { pattern: /\bimportant\b/i, issue: "Stress on second syllable: im-POR-tant", tip: "Stress the middle syllable: im-POR-tant." },
  { pattern: /\bcomfortable\b/i, issue: "Often mispronounced as 4 syllables", tip: "Pronounce as 3 syllables: COMF-ter-ble." },
  { pattern: /\bvegetable\b/i, issue: "Often mispronounced as 4 syllables", tip: "Pronounce as 3 syllables: VEJ-ta-ble." },
  { pattern: /\bpronunciation\b/i, issue: "Commonly confused with 'pronounciation'", tip: "Note: it's pro-nun-ci-A-tion, not pro-nounce-iation." },
  { pattern: /\bspecifically\b/i, issue: "Complex syllable structure", tip: "Break it down: spe-SIF-i-klee." },
  { pattern: /\bparticularly\b/i, issue: "Often reduced too much in speech", tip: "Pronounce all syllables: par-TIK-yoo-lar-lee." },
  { pattern: /\bthough\b/i, issue: "Silent 'gh' confusion", tip: "Pronounce like 'tho' — the 'gh' is silent." },
  { pattern: /\bthrough\b/i, issue: "Silent 'gh' + vowel sound", tip: "Sounds like 'throo' — don't say 'th-row'." },
  { pattern: /\bworld\b/i, issue: "Difficult 'r' + 'l' combination", tip: "Practice: 'wur-ld', not 'wold'." },
  { pattern: /\bwoman\b/i, issue: "Spelling vs pronunciation mismatch", tip: "Sounds like 'WOO-man', not 'WOH-man'." },
  { pattern: /\bwomen\b/i, issue: "Counterintuitive vowel sound", tip: "Sounds like 'WIM-in', not 'WOH-men'." },
  { pattern: /\bdifferent\b/i, issue: "Middle syllable often dropped", tip: "Say all 3 syllables: DIF-er-ent." },
  { pattern: /\binteresting\b/i, issue: "Often reduced to 3 syllables", tip: "You can say IN-trest-ing (3) or IN-ter-est-ing (4) — both are correct." },
  { pattern: /\bconversation\b/i, issue: "Vowel reduction in unstressed syllables", tip: "Stress the 3rd syllable: con-ver-SAY-shun." },
  { pattern: /\bphotograph\b/i, issue: "Stress pattern shifts in related words", tip: "PHO-to-graph but pho-TOG-ra-phy." },
];

// Sentence improvement suggestions
const improvementPhrases: Array<{ from: RegExp; to: string }> = [
  { from: /\bgood\b/gi, to: "excellent/outstanding" },
  { from: /\bbig\b/gi, to: "substantial/significant" },
  { from: /\bnice\b/gi, to: "pleasant/delightful" },
  { from: /\bget\b/gi, to: "obtain/acquire" },
  { from: /\bvery good\b/gi, to: "exceptional" },
  { from: /\bvery big\b/gi, to: "enormous/massive" },
  { from: /\bvery small\b/gi, to: "tiny/minute" },
  { from: /\bvery fast\b/gi, to: "rapid/swift" },
  { from: /\bvery slow\b/gi, to: "sluggish/gradual" },
  { from: /\bvery happy\b/gi, to: "ecstatic/elated" },
  { from: /\bvery sad\b/gi, to: "devastated/heartbroken" },
  { from: /\ba lot of\b/gi, to: "numerous/abundant" },
  { from: /\bi think that\b/gi, to: "I believe/In my opinion" },
  { from: /\buse\b/gi, to: "utilize/employ" },
  { from: /\bstart\b/gi, to: "initiate/commence" },
  { from: /\bend\b/gi, to: "conclude/finalize" },
];

const encouragementMessages = [
  "Excellent effort! Keep pushing your limits! 🌟",
  "Great job! You're making real progress every day!",
  "Well spoken! Your English is improving significantly! 💪",
  "Fantastic! Native speakers would be impressed!",
  "You're doing brilliantly! Keep up this momentum! 🚀",
  "Nice work! Small corrections lead to big improvements!",
  "Superb attempt! You should be proud of your progress!",
  "Outstanding! Your confidence in speaking is growing! ⚡",
];

const correctionIntros = [
  "Here's a small adjustment to polish your sentence:",
  "Nearly perfect! Let me refine this slightly:",
  "Great attempt! Here's the corrected version:",
  "Almost there! Consider this improved version:",
];

export function analyzeText(transcript: string): AIAnalysisResult {
  let correctedText = transcript.trim();
  const mistakes: GrammarMistake[] = [];

  // Apply grammar rules
  for (const rule of grammarRules) {
    const matches = correctedText.match(rule.pattern);
    if (matches) {
      for (const match of matches) {
        const fixed = correctedText.replace(rule.pattern, rule.fix as never);
        if (fixed !== correctedText) {
          mistakes.push({
            original: match,
            correction: fixed.match(rule.pattern)
              ? match
              : match.replace(rule.pattern, rule.fix as never),
            type: rule.type,
            explanation: rule.explanation,
          });
          correctedText = fixed;
        }
      }
    }
  }

  // Capitalize first letter
  correctedText =
    correctedText.charAt(0).toUpperCase() + correctedText.slice(1);

  // Add period if missing
  if (correctedText && !/[.!?]$/.test(correctedText)) {
    correctedText += ".";
  }

  // Improve vocabulary
  let improvedText = correctedText;
  for (const { from, to } of improvementPhrases) {
    if (from.test(improvedText)) {
      improvedText = improvedText.replace(from, to.split("/")[0]);
      break; // Only one improvement per sentence to feel natural
    }
  }

  // Pronunciation flags
  const pronunciationFlags: PronunciationFlag[] = [];
  const words = transcript.toLowerCase().split(/\s+/);

  for (const pp of pronunciationPatterns) {
    if (pp.pattern.test(transcript)) {
      const wordMatch = transcript.match(pp.pattern);
      if (wordMatch) {
        pronunciationFlags.push({
          word: wordMatch[0],
          issue: pp.issue,
          tip: pp.tip,
        });
      }
    }
  }

  // Generate explanation
  let explanation = "";
  if (mistakes.length === 0) {
    explanation =
      "No grammar errors detected! Your sentence structure is correct and natural.";
  } else if (mistakes.length === 1) {
    explanation = `One grammar correction: ${mistakes[0].explanation}`;
  } else {
    explanation = `Found ${mistakes.length} areas to improve: ${mistakes
      .map((m) => m.explanation)
      .slice(0, 2)
      .join(" Also, ")}`;
  }

  // Generate feedback message
  const randomEncouragement =
    encouragementMessages[
      Math.floor(Math.random() * encouragementMessages.length)
    ];
  const randomIntro =
    correctionIntros[Math.floor(Math.random() * correctionIntros.length)];

  const feedbackMessage =
    mistakes.length > 0
      ? `${randomIntro} "${correctedText}" — ${randomEncouragement}`
      : `Your sentence is grammatically correct! ${randomEncouragement}`;

  return {
    originalText: transcript,
    correctedText,
    improvedText: improvedText !== correctedText ? improvedText : correctedText,
    explanation,
    feedbackMessage,
    mistakes,
    pronunciationFlags,
  };
}

export function getContextualPrompt(mode: string): string {
  const prompts: Record<string, string[]> = {
    daily: [
      "Tell me about your morning routine.",
      "What did you have for breakfast today?",
      "Describe your neighborhood.",
      "What are your hobbies and interests?",
      "Talk about your favorite weekend activity.",
      "How do you usually spend your evenings?",
      "Tell me about a recent movie you watched.",
    ],
    interview: [
      "Tell me about yourself and your background.",
      "What are your greatest professional strengths?",
      "Describe a challenging situation you overcame at work.",
      "Where do you see yourself in five years?",
      "Why do you want to work for this company?",
      "What motivates you in your career?",
      "Describe your ideal work environment.",
    ],
    travel: [
      "Ask for directions to the nearest train station.",
      "Order a meal at a restaurant.",
      "Check into a hotel and ask about amenities.",
      "Ask for help finding a lost item.",
      "Describe an emergency situation to get help.",
      "Buy tickets for a tourist attraction.",
      "Ask about local transportation options.",
    ],
    shadow: [
      "The quick brown fox jumps over the lazy dog.",
      "She sells seashells by the seashore.",
      "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
      "I scream, you scream, we all scream for ice cream.",
      "Peter Piper picked a peck of pickled peppers.",
      "Red lorry, yellow lorry, red lorry, yellow lorry.",
      "Whether the weather be fine, or whether the weather be not.",
    ],
  };

  const modePrompts = prompts[mode] || prompts.daily;
  return modePrompts[Math.floor(Math.random() * modePrompts.length)];
}

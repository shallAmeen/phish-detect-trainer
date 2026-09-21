export type Verdict = "phishing" | "legitimate";

export type ClueType = "domain" | "urgency" | "link" | "attachment" | "greeting" | "header" | "content";

export interface EmailLink {
  displayText: string;
  actualUrl: string;
  isSuspicious: boolean;
}

export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
  isMalicious: boolean;
}

export interface Clue {
  type: ClueType;
  label: string;
  explanation: string;
  severity: "critical" | "warning" | "info";
}

export interface EmailScenario {
  id: number;
  category: string;
  verdict: Verdict;
  difficulty: "easy" | "medium" | "hard";
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;
  recipient: string;
  date: string;
  subject: string;
  bodyHtml: string;
  links: EmailLink[];
  attachments: EmailAttachment[];
  clues: Clue[];
  rawHeaders: string;
  explanation: string;
  tip: string;
}

export interface QuizResult {
  scenarioId: number;
  userAnswer: Verdict;
  correct: boolean;
  timeSpent: number;
  score: number;
}

export interface SessionStats {
  totalScore: number;
  accuracy: number;
  bestStreak: number;
  currentStreak: number;
  results: QuizResult[];
}

export type AppScreen = "welcome" | "quiz" | "feedback" | "results";

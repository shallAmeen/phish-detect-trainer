import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ShieldCheck,
  ShieldWarning,
  ArrowCounterClockwise,
  CheckCircle,
  XCircle,
  Brain,
  Clock,
  Sparkle,
  Warning
} from "@phosphor-icons/react";
import { EmailScenario, SessionStats, QuizResult } from "@/types/quiz";
import { toast } from "sonner";

interface ResultsScoreboardProps {
  stats: SessionStats;
  results: QuizResult[];
  scenarios: EmailScenario[];
  onRestart: () => void;
  onRetryMistakes?: () => void;
}

export default function ResultsScoreboard({
  stats,
  results,
  scenarios,
  onRestart,
  onRetryMistakes
}: ResultsScoreboardProps) {
  const [expandedScenarioId, setExpandedScenarioId] = useState<number | null>(null);

  const totalQuestions = scenarios.length;
  const correctCount = results.filter((r) => r.correct).length;
  const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const totalTimeSeconds = results.reduce((acc, r) => acc + r.timeSpent, 0);
  const avgTimeSeconds = results.length > 0 ? (totalTimeSeconds / results.length).toFixed(1) : "0";

  // Mastery tier calculation
  let rankTitle = "Security Novice";
  let rankDescription = "You are vulnerable to basic social engineering tricks. Review the red flags below and try again.";
  let rankBadgeColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";

  if (accuracyPercentage === 100) {
    rankTitle = "SOC Threat Hunter";
    rankDescription = "Flawless detection! You successfully identified every deceptive tactic and legitimate message.";
    rankBadgeColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  } else if (accuracyPercentage >= 80) {
    rankTitle = "Cyber Defense Specialist";
    rankDescription = "Impressive security awareness! With slight refinement on subtle spoofs, you will be unstoppable.";
    rankBadgeColor = "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
  } else if (accuracyPercentage >= 60) {
    rankTitle = "Phish Buster Guard";
    rankDescription = "Solid fundamentals, but advanced BEC and lookalike domains slipped through. Keep practicing!";
    rankBadgeColor = "text-indigo-400 border-indigo-500/30 bg-indigo-500/10";
  }

  // Attack category analysis
  const categoriesMap = new Map<string, { total: number; correct: number }>();
  scenarios.forEach((sc) => {
    const existing = categoriesMap.get(sc.category) || { total: 0, correct: 0 };
    const res = results.find((r) => r.scenarioId === sc.id);
    categoriesMap.set(sc.category, {
      total: existing.total + 1,
      correct: existing.correct + (res?.correct ? 1 : 0)
    });
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, data]) => ({
    name,
    total: data.total,
    correct: data.correct,
    percentage: Math.round((data.correct / data.total) * 100)
  }));

  const mistakes = results.filter((r) => !r.correct);

  const copyResults = () => {
    const text = `PhishGuard Training Score: ${stats.totalScore} pts | Accuracy: ${accuracyPercentage}% (${correctCount}/${totalQuestions}) | Rank: ${rankTitle}`;
    navigator.clipboard.writeText(text);
    toast.success("Score summary copied to clipboard!");
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-950 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Performance Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Trophy className="h-8 w-8 text-amber-400" weight="fill" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkle className="h-3.5 w-3.5 text-amber-400" weight="fill" />
            <span className={rankBadgeColor}>{rankTitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Training Session Complete
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400 leading-relaxed">
            {rankDescription}
          </p>

          {/* Quick Metrics Ribbon */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-2xl font-bold text-white">{stats.totalScore}</div>
              <div className="text-xs text-slate-400">Total Points</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-2xl font-bold text-emerald-400">{accuracyPercentage}%</div>
              <div className="text-xs text-slate-400">Accuracy ({correctCount}/{totalQuestions})</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-2xl font-bold text-cyan-400">{stats.bestStreak}</div>
              <div className="text-xs text-slate-400">Best Streak</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-2xl font-bold text-amber-300">{avgTimeSeconds}s</div>
              <div className="text-xs text-slate-400">Avg Decision Time</div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              <ArrowCounterClockwise className="h-4 w-4" weight="bold" />
              Retake All Scenarios
            </button>

            {mistakes.length > 0 && onRetryMistakes && (
              <button
                onClick={onRetryMistakes}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-6 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.98]"
              >
                <Warning className="h-4 w-4" weight="fill" />
                Practice {mistakes.length} Missed {mistakes.length === 1 ? "Email" : "Emails"}
              </button>
            )}

            <button
              onClick={copyResults}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-700 active:scale-[0.98]"
            >
              Share Results
            </button>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Brain className="h-5 w-5 text-cyan-400" weight="fill" />
              <h2 className="text-base font-semibold text-white">Performance by Attack Category</h2>
            </div>
            <span className="text-xs text-slate-500">Breakdown of defense accuracy</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200">{cat.name}</span>
                  <span
                    className={`text-xs font-semibold ${
                      cat.percentage === 100
                        ? "text-emerald-400"
                        : cat.percentage >= 50
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {cat.correct} / {cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      cat.percentage === 100
                        ? "bg-emerald-500"
                        : cat.percentage >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scenario-by-Scenario Review List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-400" weight="fill" />
              <h2 className="text-base font-semibold text-white">Detailed Scenario Review</h2>
            </div>
            <span className="text-xs text-slate-400">Click any scenario to inspect red flags</span>
          </div>

          <div className="space-y-3">
            {scenarios.map((scenario) => {
              const res = results.find((r) => r.scenarioId === scenario.id);
              const isCorrect = res ? res.correct : false;
              const isExpanded = expandedScenarioId === scenario.id;

              return (
                <div
                  key={scenario.id}
                  className={`overflow-hidden rounded-xl border transition-all ${
                    isExpanded
                      ? "border-slate-700 bg-slate-950"
                      : "border-slate-800/80 bg-slate-950/40 hover:border-slate-700"
                  }`}
                >
                  <button
                    onClick={() => setExpandedScenarioId(isExpanded ? null : scenario.id)}
                    className="flex w-full items-center justify-between p-4 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5" weight="fill" />
                        ) : (
                          <XCircle className="h-5 w-5" weight="fill" />
                        )}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {scenario.subject}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              scenario.verdict === "phishing"
                                ? "bg-rose-500/15 text-rose-400"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}
                          >
                            {scenario.verdict}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate">
                          From: {scenario.senderName} ({scenario.senderEmail})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-medium text-slate-300">
                          {isCorrect ? `+${res?.score || 100} pts` : "0 pts"}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {res?.timeSpent ? `${res.timeSpent}s` : ""}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 hover:text-white">
                        {isExpanded ? "Collapse" : "Inspect"}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-800 bg-slate-900/60 p-5 space-y-4"
                      >
                        {/* Explanation analysis */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                            Key Analysis
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {scenario.explanation}
                          </p>
                        </div>

                        {/* Clues */}
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                            Observed Indicators
                          </h4>
                          <div className="space-y-2">
                            {scenario.clues.map((clue, idx) => (
                              <div
                                key={idx}
                                className={`rounded-lg border p-3 text-xs leading-relaxed ${
                                  clue.severity === "critical"
                                    ? "border-rose-500/20 bg-rose-500/5 text-rose-300"
                                    : clue.severity === "warning"
                                    ? "border-amber-500/20 bg-amber-500/5 text-amber-300"
                                    : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
                                }`}
                              >
                                <span className="font-semibold uppercase mr-1">[{clue.label}]:</span>
                                {clue.explanation}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                          <span className="text-xs font-semibold text-cyan-300">Defense Rule: </span>
                          <span className="text-xs text-slate-300">{scenario.tip}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

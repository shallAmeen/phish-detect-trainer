import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Warning,
  ShieldCheck,
  ArrowRight,
  Brain,
  Sparkle
} from "@phosphor-icons/react";
import { EmailScenario, Verdict } from "@/types/quiz";

interface ExplanationFeedbackProps {
  scenario: EmailScenario;
  userAnswer: Verdict;
  score: number;
  isCorrect: boolean;
  onNext: () => void;
  isLast: boolean;
}

export default function ExplanationFeedback({
  scenario,
  userAnswer,
  score,
  isCorrect,
  onNext,
  isLast
}: ExplanationFeedbackProps) {
  const isPhish = scenario.verdict === "phishing";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-950 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Verdict Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl border p-6 sm:p-7 ${
            isCorrect
              ? "border-emerald-500/30 bg-emerald-950/20"
              : "border-rose-500/30 bg-rose-950/20"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                  isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="h-8 w-8" weight="fill" />
                ) : (
                  <XCircle className="h-8 w-8" weight="fill" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-2xl font-bold tracking-tight ${
                      isCorrect ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {isCorrect ? "Spot On!" : "Deceptive Catch!"}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      isPhish
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {isPhish ? "Phishing Attempt" : "Legitimate Email"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  You classified this email as{" "}
                  <strong className="text-white uppercase">{userAnswer}</strong>.
                  {isCorrect
                    ? " Great eye recognizing the indicators!"
                    : " This scenario was designed to catch subtleties."}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <div
                className={`text-2xl sm:text-3xl font-extrabold ${
                  isCorrect ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {isCorrect ? `+${score}` : "+0"}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {isCorrect ? "points earned" : "no points awarded"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkle className="h-4 w-4 text-cyan-400" weight="fill" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Threat Analysis &amp; Context
            </h3>
          </div>
          <p className="leading-relaxed text-slate-200 text-sm sm:text-base">
            {scenario.explanation}
          </p>
        </motion.div>

        {/* Clues & Red Flags Dissection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isPhish ? "Red Flags Dissected" : "Safety Verification Indicators"}
            </h3>
            <span className="text-xs text-slate-500">
              {scenario.clues.length} key {scenario.clues.length === 1 ? "indicator" : "indicators"}
            </span>
          </div>

          <div className="space-y-3">
            {scenario.clues.map((clue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.25 + i * 0.08 }}
                className={`rounded-xl border p-4 transition-colors ${
                  clue.severity === "critical"
                    ? "border-rose-500/30 bg-rose-950/20"
                    : clue.severity === "warning"
                    ? "border-amber-500/30 bg-amber-950/20"
                    : "border-emerald-500/30 bg-emerald-950/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {clue.severity === "critical" ? (
                    <Warning className="h-4 w-4 text-rose-400 shrink-0" weight="fill" />
                  ) : clue.severity === "warning" ? (
                    <Warning className="h-4 w-4 text-amber-400 shrink-0" weight="fill" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" weight="fill" />
                  )}

                  <span
                    className={`font-semibold text-sm ${
                      clue.severity === "critical"
                        ? "text-rose-300"
                        : clue.severity === "warning"
                        ? "text-amber-300"
                        : "text-emerald-300"
                    }`}
                  >
                    {clue.label}
                  </span>

                  <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 uppercase tracking-wider">
                    {clue.type}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                  {clue.explanation}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Defense Rule / Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5"
        >
          <div className="flex items-start gap-3">
            <Brain className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" weight="fill" />
            <div>
              <h4 className="text-sm font-semibold text-cyan-300">Defense Rule to Remember</h4>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {scenario.tip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
          className="pt-2 text-center"
        >
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98]"
          >
            <span>{isLast ? "View Final Scoreboard" : "Next Email Scenario"}</span>
            <ArrowRight className="h-5 w-5" weight="bold" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

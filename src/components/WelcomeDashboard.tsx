import { motion } from "framer-motion";
import { ShieldCheck, Warning, Link, Paperclip, Clock, Play, Eye } from "@phosphor-icons/react";

interface WelcomeDashboardProps {
  onStart: () => void;
  bestScore?: number;
  bestStreak?: number;
}

const tips = [
  {
    icon: Warning,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Mismatched Domains",
    desc: "Check sender addresses for character substitutions like 0 for O, 1 for I, or added words."
  },
  {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Artificial Urgency",
    desc: "Attackers create panic with deadlines, account threats, and pressure to act immediately."
  },
  {
    icon: Link,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    title: "URL Disguises",
    desc: "Hover over links to reveal the real destination. Mismatched display text is a major red flag."
  },
  {
    icon: Paperclip,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    title: "Suspicious Attachments",
    desc: "Unexpected files, double extensions (.pdf.exe), and ZIP archives often contain malware."
  }
];

export default function WelcomeDashboard({ onStart, bestScore = 0, bestStreak = 0 }: WelcomeDashboardProps) {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <ShieldCheck className="h-8 w-8 text-emerald-400" weight="fill" />
          </div>

          {bestScore > 0 && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <span>Personal Record: {bestScore} pts</span>
              <span>&bull;</span>
              <span>Best Streak: {bestStreak}</span>
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Can You Spot the Phish?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Test your ability to identify phishing attacks across 8 realistic email scenarios. Learn to spot red flags before attackers exploit them.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-colors hover:bg-emerald-400"
          >
            <Play className="h-5 w-5" weight="fill" />
            Start Training Simulation
          </motion.button>
        </motion.div>

        {/* Tips Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <Eye className="h-5 w-5 text-slate-400" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              How to Spot Phishing
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${tip.bg}`}>
                  <tip.icon className={`h-5 w-5 ${tip.color}`} weight="fill" />
                </div>
                <h3 className="font-semibold text-white">{tip.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-4 text-center"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-slate-500">Scenarios</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-slate-500">Attack Types</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4">
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-xs text-slate-500">Difficulty Levels</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
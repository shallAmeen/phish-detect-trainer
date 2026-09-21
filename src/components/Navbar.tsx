import { ShieldCheck, Trophy, Brain } from "@phosphor-icons/react";
import { SessionStats } from "@/types/quiz";

interface NavbarProps {
  screen: string;
  stats: SessionStats;
  onHome?: () => void;
}

export default function Navbar({ screen, stats, onHome }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onHome}
          className="flex items-center gap-3 text-left transition hover:opacity-90 active:scale-[0.99]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <ShieldCheck className="h-5 w-5 text-emerald-400" weight="fill" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">PhishGuard</span>
            <span className="ml-2 hidden text-xs font-medium uppercase tracking-widest text-slate-500 sm:inline">
              Training Simulator
            </span>
          </div>
        </button>

        <div className="flex items-center gap-4">
          {screen !== "welcome" && (
            <>
              <div className="flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1.5">
                <Trophy className="h-4 w-4 text-amber-400" weight="fill" />
                <span className="text-sm font-semibold text-amber-300">{stats.totalScore}</span>
                <span className="text-xs text-slate-400">pts</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1.5">
                <Brain className="h-4 w-4 text-cyan-400" weight="fill" />
                <span className="text-sm font-semibold text-cyan-300">{stats.currentStreak}</span>
                <span className="text-xs text-slate-400">streak</span>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
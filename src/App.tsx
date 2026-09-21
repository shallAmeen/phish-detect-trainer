import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import Navbar from "@/components/Navbar";
import WelcomeDashboard from "@/components/WelcomeDashboard";
import EmailSimulator from "@/components/EmailSimulator";
import ExplanationFeedback from "@/components/ExplanationFeedback";
import ResultsScoreboard from "@/components/ResultsScoreboard";
import { phishingScenarios } from "@/data/phishingScenarios";
import { AppScreen, EmailScenario, SessionStats, Verdict, QuizResult } from "@/types/quiz";

// Sound synthesis helper using native Web Audio API (zero external assets needed)
function playTone(type: "correct" | "incorrect" | "celebrate") {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "correct") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "incorrect") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(146.83, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "celebrate") {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    }
  } catch {
    // Ignore audio context autoplay limitations gracefully
  }
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [activeScenarios, setActiveScenarios] = useState<EmailScenario[]>(phishingScenarios);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [stats, setStats] = useState<SessionStats>(() => {
    const savedBestScore = Number(localStorage.getItem("phishguard_best_score") || "0");
    const savedBestStreak = Number(localStorage.getItem("phishguard_best_streak") || "0");
    return {
      totalScore: 0,
      accuracy: 0,
      bestStreak: savedBestStreak,
      currentStreak: 0,
      results: []
    };
  });

  const [lastDecision, setLastDecision] = useState<{
    scenario: EmailScenario;
    userAnswer: Verdict;
    score: number;
    isCorrect: boolean;
  } | null>(null);

  // Timer interval for quiz screen
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (screen === "quiz") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screen]);

  // Start a fresh training run
  const handleStart = (scenariosToUse = phishingScenarios) => {
    setActiveScenarios(scenariosToUse);
    setCurrentIndex(0);
    setTimeElapsed(0);
    setStats((prev) => ({
      ...prev,
      totalScore: 0,
      currentStreak: 0,
      results: []
    }));
    setLastDecision(null);
    setScreen("quiz");
  };

  // Process user's classification verdict
  const handleAnswer = (userAnswer: Verdict) => {
    const scenario = activeScenarios[currentIndex];
    const isCorrect = userAnswer === scenario.verdict;

    // Base score + speed bonus for quick accurate decisions
    let points = 0;
    if (isCorrect) {
      const basePoints = scenario.difficulty === "hard" ? 150 : scenario.difficulty === "medium" ? 120 : 100;
      const speedBonus = Math.max(0, 30 - timeElapsed); // up to 30 extra points if decided within 30s
      points = basePoints + speedBonus;
      playTone("correct");
    } else {
      playTone("incorrect");
    }

    const newCurrentStreak = isCorrect ? stats.currentStreak + 1 : 0;
    const newBestStreak = Math.max(stats.bestStreak, newCurrentStreak);
    const newTotalScore = stats.totalScore + points;

    const quizResult: QuizResult = {
      scenarioId: scenario.id,
      userAnswer,
      correct: isCorrect,
      timeSpent: timeElapsed,
      score: points
    };

    const updatedResults = [...stats.results, quizResult];
    const accuracy = Math.round(
      (updatedResults.filter((r) => r.correct).length / updatedResults.length) * 100
    );

    // Save to localStorage
    const savedBestScore = Number(localStorage.getItem("phishguard_best_score") || "0");
    if (newTotalScore > savedBestScore) {
      localStorage.setItem("phishguard_best_score", String(newTotalScore));
    }
    if (newBestStreak > Number(localStorage.getItem("phishguard_best_streak") || "0")) {
      localStorage.setItem("phishguard_best_streak", String(newBestStreak));
    }

    setStats({
      totalScore: newTotalScore,
      accuracy,
      bestStreak: newBestStreak,
      currentStreak: newCurrentStreak,
      results: updatedResults
    });

    setLastDecision({
      scenario,
      userAnswer,
      score: points,
      isCorrect
    });

    setScreen("feedback");
  };

  // Next scenario or results screen
  const handleNext = () => {
    if (currentIndex + 1 < activeScenarios.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeElapsed(0);
      setScreen("quiz");
    } else {
      playTone("celebrate");
      setScreen("results");
    }
  };

  // Retry missed mistakes
  const handleRetryMistakes = () => {
    const missedIds = stats.results.filter((r) => !r.correct).map((r) => r.scenarioId);
    const missedScenarios = phishingScenarios.filter((sc) => missedIds.includes(sc.id));
    if (missedScenarios.length > 0) {
      handleStart(missedScenarios);
      toast.info(`Retrying ${missedScenarios.length} missed scenarios`);
    }
  };

  const currentBestScore = Number(localStorage.getItem("phishguard_best_score") || "0");
  const currentBestStreak = Number(localStorage.getItem("phishguard_best_streak") || "0");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar
        screen={screen}
        stats={stats}
        onHome={() => setScreen("welcome")}
      />

      <main className="flex-1">
        {screen === "welcome" && (
          <WelcomeDashboard
            onStart={() => handleStart(phishingScenarios)}
            bestScore={Math.max(currentBestScore, stats.totalScore)}
            bestStreak={Math.max(currentBestStreak, stats.bestStreak)}
          />
        )}

        {screen === "quiz" && activeScenarios[currentIndex] && (
          <EmailSimulator
            scenario={activeScenarios[currentIndex]}
            currentIndex={currentIndex}
            total={activeScenarios.length}
            onAnswer={handleAnswer}
            timeElapsed={timeElapsed}
          />
        )}

        {screen === "feedback" && lastDecision && (
          <ExplanationFeedback
            scenario={lastDecision.scenario}
            userAnswer={lastDecision.userAnswer}
            score={lastDecision.score}
            isCorrect={lastDecision.isCorrect}
            onNext={handleNext}
            isLast={currentIndex + 1 >= activeScenarios.length}
          />
        )}

        {screen === "results" && (
          <ResultsScoreboard
            stats={stats}
            results={stats.results}
            scenarios={activeScenarios}
            onRestart={() => handleStart(phishingScenarios)}
            onRetryMistakes={
              stats.results.some((r) => !r.correct) ? handleRetryMistakes : undefined
            }
          />
        )}
      </main>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className: "border border-slate-800 bg-slate-900 text-slate-100"
        }}
      />
    </div>
  );
}

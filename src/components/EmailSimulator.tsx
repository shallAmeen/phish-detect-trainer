import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeSimple,
  Paperclip,
  Lock,
  Eye,
  Warning,
  ShieldCheck,
  Link as LinkIcon,
  Clock,
  Sparkle,
  ArrowRight,
  Info
} from "@phosphor-icons/react";
import { EmailScenario, Verdict } from "@/types/quiz";

interface EmailSimulatorProps {
  scenario: EmailScenario;
  currentIndex: number;
  total: number;
  onAnswer: (answer: Verdict) => void;
  timeElapsed: number;
}

export default function EmailSimulator({
  scenario,
  currentIndex,
  total,
  onAnswer,
  timeElapsed
}: EmailSimulatorProps) {
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [attachmentInspected, setAttachmentInspected] = useState<string | null>(null);

  // Mouse over email body to detect any hovered link
  const handleBodyMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (anchor) {
      e.preventDefault();
      const text = (anchor.textContent || "").trim();
      const matched = scenario.links.find((l) => l.displayText.trim() === text) || scenario.links[0];
      if (matched) {
        setHoveredUrl(matched.actualUrl);
      } else {
        setHoveredUrl(anchor.getAttribute("href") || "https://link-preview");
      }
    }
  };

  const handleBodyMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (anchor) {
      setHoveredUrl(null);
    }
  };

  const difficultyColors = {
    easy: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    medium: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    hard: "border-rose-500/30 text-rose-400 bg-rose-500/10"
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-950 px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Simulation Header Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400">
              #{currentIndex + 1}
            </span>
            <div className="text-sm">
              <span className="font-semibold text-white">Scenario {currentIndex + 1}</span>
              <span className="text-slate-500"> of {total}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${difficultyColors[scenario.difficulty]}`}>
              {scenario.difficulty}
            </span>

            <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-xs font-medium text-slate-300">
              {scenario.category}
            </span>

            <div className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-xs text-slate-400">
              <Clock className="h-3 w-3 text-cyan-400" />
              <span>{timeElapsed}s</span>
            </div>
          </div>
        </div>

        {/* Realistic Desktop Email Client Shell */}
        <motion.div
          key={scenario.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
        >
          {/* Email Client Window Topbar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>
              <span className="ml-2 text-xs font-medium text-slate-400 flex items-center gap-1">
                <EnvelopeSimple className="h-3.5 w-3.5" />
                WorkMail Client &bull; Inbox
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInspectMode(!inspectMode)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                  inspectMode
                    ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sparkle className="h-3.5 w-3.5" weight="fill" />
                <span>{inspectMode ? "Hide Clue Radar" : "Inspect Clue Radar"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowHeaders(!showHeaders)}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{showHeaders ? "Hide Headers" : "Raw Headers"}</span>
              </button>
            </div>
          </div>

          {/* Email Subject Header */}
          <div className="border-b border-slate-800/80 bg-slate-900/80 px-5 py-4">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {scenario.subject}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>Date: {scenario.date}</span>
              <span>To: {scenario.recipient}</span>
            </div>
          </div>

          {/* Sender Details Header */}
          <div className="border-b border-slate-800/80 bg-slate-900/40 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-base font-bold text-slate-200 ring-1 ring-slate-700">
                  {scenario.senderName.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {scenario.senderName}
                    </span>
                    <span className="font-mono text-xs text-slate-400 rounded bg-slate-950/80 px-2 py-0.5 border border-slate-800">
                      &lt;{scenario.senderEmail}&gt;
                    </span>
                  </div>

                  {scenario.replyToEmail && (
                    <div className="mt-1 flex items-center gap-1 text-xs font-mono text-amber-300">
                      <Warning className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <span>Reply-To: &lt;{scenario.replyToEmail}&gt;</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:block text-right">
                <span className="inline-block rounded border border-slate-800 bg-slate-950 px-2.5 py-1 font-mono text-[11px] text-slate-400">
                  Sec-Status: Evaluated
                </span>
              </div>
            </div>
          </div>

          {/* Raw Headers Viewer (Toggled) */}
          <AnimatePresence>
            {showHeaders && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-slate-800 bg-slate-950/90 p-4 font-mono text-xs text-slate-300"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  <span>SMTP &amp; Authentication Headers (Inspect carefully)</span>
                  <span className="text-cyan-400">RFC 5322 Format</span>
                </div>
                <pre className="whitespace-pre-wrap overflow-x-auto text-slate-400 leading-relaxed text-[11px]">
                  {scenario.rawHeaders}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Attachments Area */}
          {scenario.attachments.length > 0 && (
            <div className="border-b border-slate-800 bg-slate-950/40 px-5 py-3">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Attachments ({scenario.attachments.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {scenario.attachments.map((att, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAttachmentInspected(attachmentInspected === att.name ? null : att.name)
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs transition hover:border-slate-600 hover:bg-slate-800 text-left"
                  >
                    <Paperclip className="h-4 w-4 text-cyan-400 shrink-0" />
                    <div>
                      <div className="font-mono font-medium text-slate-200">{att.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {att.size} &bull; {att.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {attachmentInspected && (
                <div className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200 flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Security File Inspection: </span>
                    Notice the exact file extension of <code className="font-mono">{attachmentInspected}</code>. In real emails, attackers often mask malicious executables with names like <code className="font-mono">.pdf.exe</code> or compress malware into ZIP containers.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Clue Radar (Guided Inspection Mode) */}
          <AnimatePresence>
            {inspectMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-b border-cyan-500/20 bg-cyan-950/20 px-5 py-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1">
                  <Sparkle className="h-4 w-4" weight="fill" />
                  <span>Clue Radar Checklist</span>
                </div>
                <div className="text-xs text-slate-300">
                  Inspect these 4 key zones before answering:
                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-400">
                    <li>1. <strong>Sender Domain:</strong> Does the domain match the true brand exactly? Look for letters replaced with numbers.</li>
                    <li>2. <strong>Sense of Urgency:</strong> Are there 24-hour threats, immediate legal or financial consequences?</li>
                    <li>3. <strong>Hyperlink Previews:</strong> Hover over buttons and links below to reveal destination URLs.</li>
                    <li>4. <strong>Attachments:</strong> Is the file extension deceptive (e.g. .exe, .zip)?</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email Body Content */}
          <div
            className="relative px-6 py-6 min-h-[180px]"
            onMouseOver={handleBodyMouseOver}
            onMouseOut={handleBodyMouseOut}
          >
            <div
              className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed [&_p]:mb-3 [&_strong]:text-white [&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-4 [&_a]:cursor-pointer [&_a]:font-medium hover:[&_a]:text-cyan-300 [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-emerald-300 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-slate-300"
              dangerouslySetInnerHTML={{ __html: scenario.bodyHtml }}
            />

            {/* Hovered URL Status Bar (Simulating native browser URL inspection at bottom-left) */}
            <AnimatePresence>
              {hoveredUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-3 left-4 right-4 sm:right-auto z-30 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/95 px-3 py-2 text-xs shadow-2xl backdrop-blur-md font-mono"
                >
                  <Lock className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <span className="text-slate-500 shrink-0">Real Destination URL:</span>
                  <span className="text-cyan-300 underline font-semibold truncate max-w-[280px] sm:max-w-[420px]">
                    {hoveredUrl}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Links Inspector Drawer (Explicit clickable inspection for mobile / touch devices) */}
          {scenario.links.length > 0 && (
            <div className="border-t border-slate-800/80 bg-slate-950/60 px-5 py-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <LinkIcon className="h-3.5 w-3.5 text-cyan-400" />
                  Embedded Links in this Email ({scenario.links.length})
                </span>
                <span className="text-[11px] text-slate-500">
                  Inspect actual target URLs
                </span>
              </div>
              <div className="space-y-2">
                {scenario.links.map((link, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredUrl(link.actualUrl)}
                    onMouseLeave={() => setHoveredUrl(null)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 p-2.5 text-xs font-mono"
                  >
                    <div className="text-slate-300 font-sans font-medium">
                      Display text: &ldquo;{link.displayText}&rdquo;
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <ArrowRight className="h-3 w-3 text-slate-600 hidden sm:inline" />
                      <span className="text-cyan-400 truncate max-w-[320px]">
                        {link.actualUrl}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Action Decision Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
        >
          <button
            type="button"
            onClick={() => onAnswer("phishing")}
            className="group relative flex items-center justify-center gap-3 rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/60 to-rose-900/40 px-6 py-4 text-base font-semibold text-rose-200 shadow-lg shadow-rose-950/30 transition hover:border-rose-500 hover:from-rose-900/60 hover:to-rose-800/50 active:scale-[0.98]"
          >
            <Warning className="h-5 w-5 text-rose-400 transition group-hover:scale-110" weight="fill" />
            <span>Report Phishing Attempt</span>
          </button>

          <button
            type="button"
            onClick={() => onAnswer("legitimate")}
            className="group relative flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 px-6 py-4 text-base font-semibold text-emerald-200 shadow-lg shadow-emerald-950/30 transition hover:border-emerald-500 hover:from-emerald-900/60 hover:to-emerald-800/50 active:scale-[0.98]"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400 transition group-hover:scale-110" weight="fill" />
            <span>Mark as Legitimate Email</span>
          </button>
        </motion.div>

        {/* Spotting Guide Reminder Footnote */}
        <p className="text-center text-xs text-slate-500">
          Pro-tip: Check sender address, hover over embedded links to reveal real targets, and inspect raw headers if unsure.
        </p>
      </div>
    </div>
  );
}

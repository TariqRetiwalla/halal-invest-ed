'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CompanyCard from '@/components/simulator/CompanyCard';
import AnswerButtons from '@/components/simulator/AnswerButtons';
import FeedbackPanel from '@/components/simulator/FeedbackPanel';
import ScreeningHistory from '@/components/simulator/ScreeningHistory';
import type { HistoryEntry } from '@/components/simulator/ScreeningHistory';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  mainIncomeSource: string;
  interestIncomeLevel: 'Low' | 'Medium' | 'High';
  debtLevel: 'Low' | 'Medium' | 'High';
}

interface AnswerResponse {
  correct: boolean;
  mistakeType: null | 1 | 2;
  blocked: boolean;
  hintText?: string;
  islamicPrinciple?: string;
  lessonCallback?: {
    lessonNumber: number;
    sectionNumber: number;
    label: string;
    href: string;
  };
  explanation?: string;
  profitPct: number;
}

interface AccessResponse {
  accessible: boolean;
  lessonsComplete: number;
  totalLessons: 5;
  reason?: 'lessons_incomplete' | 'teacher_locked';
}

type SimulatorPhase =
  | 'loading_companies'
  | 'waiting'
  | 'evaluating'
  | 'feedback'
  | 'done';

// ─── Fisher-Yates shuffle ─────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DisclaimerBanner() {
  return (
    <div className="bg-[#2a2010] border border-[#c9a84c] rounded-xl px-4 py-2.5 text-xs text-[#f0d98a]">
      Educational only. Not certified Shariah advice. No real financial data. All companies are fictional.
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4" aria-label="Loading simulator">
      <DisclaimerBanner />
      <div className="h-8 bg-[#162550] rounded-xl animate-pulse" />
      <div className="h-48 bg-[#162550] rounded-2xl animate-pulse" />
      <div className="h-36 bg-[#162550] rounded-2xl animate-pulse" />
    </div>
  );
}

function LockedState({ lessonsComplete, totalLessons }: { lessonsComplete: number; totalLessons: number }) {
  const pct = Math.min((lessonsComplete / totalLessons) * 100, 100);

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10 space-y-6">
      <DisclaimerBanner />

      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-8 flex flex-col items-center text-center gap-5">
        {/* Lock icon */}
        <div
          className="w-14 h-14 rounded-full bg-[#1d3268] border border-[#2d4f8a] flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4a6a9a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#e8eeff] mb-1">The simulator is locked</h1>
          <p className="text-sm text-[#8aabcc]">
            Complete all 5 lessons to unlock the simulator.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-xs text-[#4a6a9a]">
            <span>{lessonsComplete} of {totalLessons} lessons complete</span>
            <span>{Math.round(pct)}%</span>
          </div>
          <div
            className="h-2.5 bg-[#1d3268] rounded-full border border-[#2d4f8a] overflow-hidden"
            role="progressbar"
            aria-valuenow={lessonsComplete}
            aria-valuemin={0}
            aria-valuemax={totalLessons}
          >
            <div
              className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <Link
          href="/learn"
          className="w-full text-center rounded-xl border border-[#2d4f8a] bg-[#1d3268] hover:bg-[#2d4f8a] text-[#e8eeff] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Back to lessons
        </Link>
      </div>
    </div>
  );
}

function DoneState({ profitPct, history, onRestart }: { profitPct: number; history: HistoryEntry[]; onRestart: () => void }) {
  const correct = history.filter((h) => h.correct).length;
  const pct = history.length > 0 ? Math.round((correct / history.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <DisclaimerBanner />

      <div className="bg-[#162550] border border-[#2d4f8a] rounded-2xl p-8 flex flex-col items-center text-center gap-5">
        <div
          className="w-14 h-14 rounded-full bg-[#0a2010] border border-[#2a7a4b] flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-2xl">✓</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#e8eeff] mb-1">Session complete!</h1>
          <p className="text-sm text-[#8aabcc]">
            You screened {history.length} {history.length === 1 ? 'company' : 'companies'}.
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#1d3268] border border-[#2d4f8a] p-4">
            <p className="text-xs text-[#4a6a9a] mb-1">Portfolio return</p>
            <p className={`text-xl font-bold ${profitPct >= 0 ? 'text-[#4aad70]' : 'text-[#f08080]'}`}>
              {profitPct >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl bg-[#1d3268] border border-[#2d4f8a] p-4">
            <p className="text-xs text-[#4a6a9a] mb-1">Accuracy</p>
            <p className="text-xl font-bold text-[#c9a84c]">{pct}%</p>
          </div>
        </div>

        <ScreeningHistory history={history} />

        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Screen again
        </button>

        <Link
          href="/learn"
          className="text-sm text-[#8aabcc] hover:text-[#e8eeff] underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
        >
          Back to lessons
        </Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PlayPage() {
  const router = useRouter();

  // Access gate state
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessible, setAccessible] = useState(false);
  const [lessonsComplete, setLessonsComplete] = useState(0);

  // Simulator state
  const [sessionKey, setSessionKey] = useState(0); // increment to restart
  const [phase, setPhase] = useState<SimulatorPhase>('loading_companies');
  const [companies, setCompanies] = useState<PublicCompany[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState<1 | 2>(1);
  const [feedback, setFeedback] = useState<AnswerResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [profitPct, setProfitPct] = useState(0);

  // ── Step 1: check access ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function checkAccess() {
      try {
        const res = await fetch('/api/simulator/access', { credentials: 'include' });

        if (res.status === 401) {
          router.replace('/auth/login?redirect=/play');
          return;
        }

        const data: AccessResponse = await res.json();
        if (cancelled) return;

        setLessonsComplete(data.lessonsComplete);

        if (data.accessible) {
          setAccessible(true);
        }
      } catch {
        // Network error — treat as not accessible; leave loading state to show nothing
      } finally {
        if (!cancelled) setAccessLoading(false);
      }
    }

    checkAccess();
    return () => { cancelled = true; };
  }, [router]);

  // ── Step 2: init simulator when accessible ─────────────────────────────────
  useEffect(() => {
    if (!accessible) return;

    let cancelled = false;

    async function initSimulator() {
      try {
        const [sessionRes, companiesRes] = await Promise.all([
          fetch('/api/simulator/session', { method: 'POST', credentials: 'include' }),
          fetch('/api/simulator/companies', { credentials: 'include' }),
        ]);

        if (sessionRes.status === 401 || companiesRes.status === 401) {
          router.replace('/auth/login?redirect=/play');
          return;
        }

        const { sessionId: sid } = await sessionRes.json();
        const { companies: raw } = await companiesRes.json();

        if (cancelled) return;

        setSessionId(sid);
        setCompanies(shuffle(raw));
        setPhase('waiting');
      } catch {
        // stay in loading_companies — surface a generic error in future
      }
    }

    initSimulator();
    return () => { cancelled = true; };
  }, [accessible, sessionKey, router]);

  // ── Handle answer submission ───────────────────────────────────────────────
  async function handleAnswer(answers: boolean[]) {
    if (!companies[currentIndex]) return;
    const currentCompany = companies[currentIndex];

    setPhase('evaluating');

    try {
      const res = await fetch('/api/simulator/answer', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          companyId: currentCompany.id,
          studentAnswers: answers,
          attemptNumber,
        }),
      });

      if (res.status === 401) {
        router.replace('/auth/login?redirect=/play');
        return;
      }

      const data: AnswerResponse = await res.json();

      setProfitPct(data.profitPct);
      setFeedback(data);
      setPhase('feedback');

      const studentSaidPass = answers.every(Boolean);

      if (data.correct || data.blocked) {
        // Add to history and prepare for next company on next click
        setHistory((prev) => [
          ...prev,
          {
            companyName: currentCompany.name,
            studentDecision: studentSaidPass ? 'pass' : 'fail',
            correct: data.correct,
          },
        ]);
      } else if (data.mistakeType === 1) {
        // Give a second attempt
        setAttemptNumber(2);
      }
      // mistakeType === 2: stay on same company, let student reconsider
    } catch {
      // Network error — go back to waiting so student can retry
      setPhase('waiting');
    }
  }

  // ── Advance to next company ────────────────────────────────────────────────
  function handleNextCompany() {
    const next = currentIndex + 1;
    setFeedback(null);
    setAttemptNumber(1);

    if (next >= companies.length) {
      setPhase('done');
    } else {
      setCurrentIndex(next);
      setPhase('waiting');
    }
  }

  // ── Retry current company ──────────────────────────────────────────────────
  function handleRetry() {
    setFeedback(null);
    setPhase('waiting');
  }

  // ── Restart entire session ─────────────────────────────────────────────────
  function handleRestart() {
    setPhase('loading_companies');
    setCompanies([]);
    setSessionId('');
    setCurrentIndex(0);
    setAttemptNumber(1);
    setFeedback(null);
    setHistory([]);
    setProfitPct(0);
    setAccessible(true); // re-trigger init effect via toggle trick
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const currentCompany = companies[currentIndex] ?? null;
  const isEvaluating = phase === 'evaluating';

  // Determine highlight hints from feedback
  const highlightDebt =
    phase === 'feedback' && feedback?.mistakeType === 1 && !!feedback?.hintText?.toLowerCase().includes('debt');
  const highlightInterest =
    phase === 'feedback' && feedback?.mistakeType === 1 && !!feedback?.hintText?.toLowerCase().includes('interest');
  const highlightSector =
    phase === 'feedback' && feedback?.mistakeType === 1 && !!feedback?.hintText?.toLowerCase().includes('sector');

  // ── Render guards ──────────────────────────────────────────────────────────

  if (accessLoading) {
    return <SkeletonLoader />;
  }

  if (!accessible) {
    return <LockedState lessonsComplete={lessonsComplete} totalLessons={5} />;
  }

  if (phase === 'loading_companies') {
    return <SkeletonLoader />;
  }

  if (phase === 'done') {
    return (
      <DoneState
        profitPct={profitPct}
        history={history}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      {/* Legal disclaimer */}
      <DisclaimerBanner />

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#e8eeff]">Halal Screening Simulator</h1>
        <span
          className={`text-sm font-semibold ${profitPct >= 0 ? 'text-[#4aad70]' : 'text-[#f08080]'}`}
          aria-live="polite"
        >
          Portfolio: {profitPct >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
        </span>
      </div>

      {/* Progress indicator */}
      <p className="text-xs text-[#4a6a9a]">
        Company {currentIndex + 1} of {companies.length}
      </p>

      {/* Company card + answer buttons */}
      {currentCompany && (
        <div className="space-y-4">
          <CompanyCard
            company={currentCompany}
            highlightDebt={highlightDebt}
            highlightInterest={highlightInterest}
            highlightSector={highlightSector}
            attemptNumber={attemptNumber}
          />

          <AnswerButtons
            onSubmit={handleAnswer}
            disabled={isEvaluating || phase === 'feedback'}
          />
        </div>
      )}

      {/* Feedback panel */}
      {phase === 'feedback' && feedback && currentCompany && (
        <FeedbackPanel
          feedback={feedback}
          companyName={currentCompany.name}
          onNext={handleNextCompany}
          onRetry={handleRetry}
        />
      )}

      {/* Evaluating spinner */}
      {phase === 'evaluating' && (
        <div
          className="text-center py-4 text-sm text-[#4a6a9a]"
          aria-live="polite"
          aria-label="Checking your answer"
        >
          Checking…
        </div>
      )}

      {/* Screening history */}
      <ScreeningHistory history={history} />
    </div>
  );
}

'use client';

import Link from 'next/link';

interface LessonCallback {
  lessonNumber: number;
  sectionNumber: number;
  label: string;
  href: string;
}

interface FeedbackPanelProps {
  feedback: {
    correct: boolean;
    mistakeType: null | 1 | 2;
    blocked: boolean;
    hintText?: string;
    islamicPrinciple?: string;
    lessonCallback?: LessonCallback;
    explanation?: string;
    profitPct: number;
  };
  companyName: string;
  onNext: () => void;
  onRetry: () => void;
}

function LessonCallbackLink({ lessonCallback }: { lessonCallback: LessonCallback }) {
  return (
    <Link
      href={lessonCallback.href}
      className="inline-flex items-center gap-1.5 text-sm text-[#c9a84c] hover:text-[#f0d98a] underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
    >
      <span aria-hidden="true">📖</span>
      Review: {lessonCallback.label}
    </Link>
  );
}

export default function FeedbackPanel({
  feedback,
  companyName,
  onNext,
  onRetry,
}: FeedbackPanelProps) {
  const { correct, mistakeType, blocked, hintText, islamicPrinciple, lessonCallback, explanation, profitPct } =
    feedback;

  // Correct answer
  if (correct) {
    return (
      <div className="animate-fade-slide-up bg-[#0a2010] border border-[#2a7a4b] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[#4aad70] text-lg" aria-hidden="true">✓</span>
          <h3 className="text-[#4aad70] font-semibold text-base">Correct — well spotted!</h3>
        </div>
        <p className="text-sm text-[#8aabcc]">
          {companyName} passes all three criteria. Great screening.
        </p>
        <p className="text-sm font-medium text-[#4aad70]">
          Portfolio:{' '}
          {profitPct >= 0 ? '+' : ''}
          {profitPct.toFixed(2)}%
        </p>
        <button
          type="button"
          onClick={onNext}
          aria-label="Move to the next company"
          className="w-full rounded-xl bg-[#2a7a4b] hover:bg-[#3a8a5b] text-[#e8eeff] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Next company →
        </button>
      </div>
    );
  }

  // Blocked — second Type 1 failure (haram company, attempt 2) — checked BEFORE mistakeType===1
  if (blocked) {
    return (
      <div className="animate-fade-slide-up bg-[#2a0808] border border-[#8b2a2a] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[#f08080] text-lg" aria-hidden="true">✗</span>
          <h3 className="text-[#f08080] font-semibold text-base">
            Let&apos;s go through this together.
          </h3>
        </div>
        {explanation && (
          <p className="text-sm text-[#8aabcc]">{explanation}</p>
        )}
        {lessonCallback && <LessonCallbackLink lessonCallback={lessonCallback} />}
        <div className="rounded-lg bg-[#1a0404] border border-[#8b2a2a] px-3 py-2 text-xs text-[#f08080] font-medium">
          This company cannot be added to a halal portfolio
        </div>
        <button
          type="button"
          onClick={onNext}
          aria-label="Move on and try the next company"
          className="w-full rounded-xl bg-[#8b2a2a] hover:bg-[#a03a3a] text-[#e8eeff] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Try the next company
        </button>
      </div>
    );
  }

  // Type 1 — passed a haram company, first attempt
  if (mistakeType === 1) {
    return (
      <div className="animate-fade-slide-up bg-[#2a1a08] border border-[#c9a84c] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[#f0d98a] text-lg" aria-hidden="true">⚠</span>
          <h3 className="text-[#f0d98a] font-semibold text-base">
            Hold on — let&apos;s look at this again.
          </h3>
        </div>
        {hintText && (
          <p className="text-sm text-[#8aabcc]">{hintText}</p>
        )}
        {islamicPrinciple && (
          <blockquote className="border-l-2 border-[#c9a84c] pl-3 text-sm text-[#f0d98a] italic">
            {islamicPrinciple}
          </blockquote>
        )}
        {lessonCallback && <LessonCallbackLink lessonCallback={lessonCallback} />}
        <button
          type="button"
          onClick={onRetry}
          aria-label="Take another look at this company"
          className="w-full rounded-xl bg-[#c9a84c] hover:bg-[#b5923a] text-[#0f1f3d] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Take another look
        </button>
      </div>
    );
  }

  // Type 2 — blocked a halal company (overcautious)
  if (mistakeType === 2) {
    return (
      <div className="animate-fade-slide-up bg-[#0a1628] border border-[#2d4f8a] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-[#8aabcc] text-lg" aria-hidden="true">🔍</span>
          <h3 className="text-[#8aabcc] font-semibold text-base">
            Good instinct — but this one passes.
          </h3>
        </div>
        <p className="text-sm text-[#8aabcc]">
          Being cautious is a great habit. Here&apos;s why {companyName} is acceptable:
        </p>
        {explanation && (
          <p className="text-sm text-[#e8eeff]">{explanation}</p>
        )}
        {lessonCallback && <LessonCallbackLink lessonCallback={lessonCallback} />}
        <button
          type="button"
          onClick={onRetry}
          aria-label="Reconsider your answer for this company"
          className="w-full rounded-xl bg-[#2d4f8a] hover:bg-[#3d5f9a] text-[#e8eeff] py-2.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
        >
          Reconsider
        </button>
      </div>
    );
  }

  return null;
}

'use client';

import { useState } from 'react';

interface AnswerButtonsProps {
  onSubmit: (answers: boolean[]) => void;
  disabled: boolean;
}

const QUESTIONS = [
  'Is this company\'s sector permissible in Islam?',
  'Is the debt level acceptable?',
  'Is the interest income level acceptable?',
];

export default function AnswerButtons({ onSubmit, disabled }: AnswerButtonsProps) {
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const allAnswered = answers.every((a) => a !== null);

  function toggleAnswer(index: number, value: boolean) {
    if (disabled) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered || disabled) return;
    onSubmit(answers as boolean[]);
    // Reset for next use
    setAnswers([null, null, null]);
  }

  function buttonClass(selected: boolean | null, value: boolean) {
    const base =
      'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]';
    if (selected === value) {
      return value
        ? `${base} bg-[#0a2010] border-[#2a7a4b] text-[#4aad70]`
        : `${base} bg-[#2a0808] border-[#8b2a2a] text-[#f08080]`;
    }
    return `${base} bg-[#0f1f3d] border-[#2d4f8a] text-[#8aabcc] hover:border-[#4a6a9a]`;
  }

  return (
    <div className="space-y-3">
      {QUESTIONS.map((question, i) => (
        <div
          key={i}
          className="bg-[#162550] border border-[#2d4f8a] rounded-xl p-4"
        >
          <p className="text-sm text-[#e8eeff] mb-3 leading-snug">{question}</p>
          <div className="flex gap-2" role="group" aria-label={question}>
            <button
              type="button"
              onClick={() => toggleAnswer(i, true)}
              disabled={disabled}
              aria-pressed={answers[i] === true}
              className={buttonClass(answers[i], true)}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => toggleAnswer(i, false)}
              disabled={disabled}
              aria-pressed={answers[i] === false}
              className={buttonClass(answers[i], false)}
            >
              No
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!allAnswered || disabled}
        aria-label="Submit your screening answers"
        className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
          allAnswered && !disabled
            ? 'bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] cursor-pointer'
            : 'bg-[#1d3268] text-[#4a6a9a] cursor-not-allowed'
        }`}
      >
        Submit screening
      </button>
    </div>
  );
}

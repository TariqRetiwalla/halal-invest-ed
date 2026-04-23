'use client';

import { useState } from 'react';
import { getLessonQuiz } from '@/lib/lessonData';

interface QuizEngineProps {
  lessonNumber: number;
  onComplete: (score: number) => void;
}

interface FeedbackItem {
  questionId: string;
  correct: boolean;
  explanation: string;
}

type SubmitState = 'idle' | 'submitting' | 'done';

export default function QuizEngine({ lessonNumber, onComplete }: QuizEngineProps) {
  const questions = getLessonQuiz(lessonNumber);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);

  const allAnswered = questions.length > 0 && questions.every((q) => selected[q.id] !== undefined);

  const handleSelect = (questionId: string, optionId: string) => {
    if (submitState !== 'idle') return;
    setSelected((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!allAnswered || submitState !== 'idle') return;
    setSubmitState('submitting');

    const answers = questions.map((q) => ({
      questionId: q.id,
      selectedOption: selected[q.id],
    }));

    try {
      const res = await fetch(`/api/lessons/${lessonNumber}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      setScore(data.score);
      setFeedback(data.feedback);
      setSubmitState('done');
    } catch {
      setSubmitState('idle');
    }
  };

  const feedbackMap = Object.fromEntries(feedback.map((f) => [f.questionId, f]));

  if (submitState === 'done' && score !== null) {
    const correctCount = feedback.filter((f) => f.correct).length;

    return (
      <div>
        {/* Score banner */}
        <div
          className="rounded-2xl bg-[#2a2010] border border-[#c9a84c] p-5 mb-8 text-center"
        >
          <p className="text-2xl font-bold text-[#f0d98a] mb-1">
            {score}%
          </p>
          <p className="text-sm text-[#8aabcc]">
            You got {correctCount} out of {questions.length} questions right.
          </p>
        </div>

        {/* Question review */}
        <div className="space-y-6 mb-8">
          {questions.map((q) => {
            const fb = feedbackMap[q.id];
            const isCorrect = fb?.correct ?? false;

            return (
              <div key={q.id} className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-5">
                <p className="text-sm font-semibold text-[#e8eeff] mb-3">{q.question}</p>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const wasSelected = selected[q.id] === opt.id;
                    let borderClass = 'border-[#2d4f8a] bg-[#0f1f3d]';
                    let textClass = 'text-[#8aabcc]';

                    if (wasSelected && isCorrect) {
                      borderClass = 'border-[#2a7a4b] bg-[#0a2010]';
                      textClass = 'text-[#4aad70]';
                    } else if (wasSelected && !isCorrect) {
                      borderClass = 'border-[#8b2a2a] bg-[#1a0808]';
                      textClass = 'text-[#f08080]';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${borderClass}`}
                      >
                        <span className={`text-sm ${textClass}`}>{opt.text}</span>
                        {wasSelected && (
                          <span className="ml-auto flex-shrink-0">
                            {isCorrect ? (
                              <svg className="w-4 h-4 text-[#4aad70]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-[#f08080]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {fb?.explanation && (
                  <div className={`rounded-xl px-4 py-3 text-sm ${isCorrect ? 'bg-[#0a2010] border border-[#2a7a4b] text-[#4aad70]' : 'bg-[#1a0808] border border-[#8b2a2a] text-[#f08080]'}`}>
                    <p className="text-[#8aabcc]">{fb.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onComplete(score)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1f3d]"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-8 mb-8">
        {questions.map((q, qIndex) => (
          <fieldset key={q.id}>
            <legend className="text-sm font-semibold text-[#e8eeff] mb-3">
              <span className="text-[#4a6a9a] font-normal mr-1">Q{qIndex + 1}.</span>
              {q.question}
            </legend>

            <div className="space-y-2" role="radiogroup" aria-labelledby={`question-${q.id}`}>
              {q.options.map((opt) => {
                const isSelected = selected[q.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 ease-out ${
                      isSelected
                        ? 'border-[#c9a84c] bg-[#2a2010] text-[#f0d98a]'
                        : 'border-[#2d4f8a] bg-[#0f1f3d] text-[#8aabcc] hover:border-[#c9a84c] hover:text-[#e8eeff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => handleSelect(q.id, opt.id)}
                      className="sr-only"
                      aria-label={opt.text}
                    />
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-out ${
                        isSelected ? 'border-[#c9a84c] bg-[#c9a84c]' : 'border-[#2d4f8a]'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0f1f3d]" />
                      )}
                    </span>
                    <span className={`text-sm ${isSelected ? 'text-[#f0d98a] font-medium' : 'text-[#8aabcc]'}`}>
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitState === 'submitting'}
        aria-disabled={!allAnswered}
        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1f3d] ${
          allAnswered
            ? 'bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a]'
            : 'bg-[#162550] text-[#4a6a9a] opacity-40 cursor-not-allowed'
        }`}
      >
        {submitState === 'submitting' ? 'Checking your answers…' : 'Submit answers'}
      </button>

      {!allAnswered && (
        <p className="mt-2 text-xs text-[#4a6a9a]">Answer all questions to submit.</p>
      )}
    </div>
  );
}

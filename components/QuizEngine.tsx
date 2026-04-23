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
          className={`rounded-2xl p-5 mb-8 text-center ${
            score >= 75
              ? 'bg-green-50 border border-green-100'
              : 'bg-amber-50 border border-amber-100'
          }`}
        >
          <p className={`text-2xl font-bold mb-1 ${score >= 75 ? 'text-green-700' : 'text-amber-700'}`}>
            {score}%
          </p>
          <p className="text-sm text-gray-600">
            You got {correctCount} out of {questions.length} questions right.
          </p>
        </div>

        {/* Question review */}
        <div className="space-y-6 mb-8">
          {questions.map((q) => {
            const fb = feedbackMap[q.id];
            const isCorrect = fb?.correct ?? false;

            return (
              <div key={q.id} className="rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">{q.question}</p>

                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const wasSelected = selected[q.id] === opt.id;
                    let borderClass = 'border-gray-100 bg-gray-50';
                    let textClass = 'text-gray-700';

                    if (wasSelected && isCorrect) {
                      borderClass = 'border-green-300 bg-green-50';
                      textClass = 'text-green-800';
                    } else if (wasSelected && !isCorrect) {
                      borderClass = 'border-amber-300 bg-amber-50';
                      textClass = 'text-amber-800';
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
                              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
                  <div className={`rounded-xl px-4 py-3 text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                    {fb.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onComplete(score)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
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
            <legend className="text-sm font-semibold text-gray-900 mb-3">
              <span className="text-gray-400 font-normal mr-1">Q{qIndex + 1}.</span>
              {q.question}
            </legend>

            <div className="space-y-2" role="radiogroup" aria-labelledby={`question-${q.id}`}>
              {q.options.map((opt) => {
                const isSelected = selected[q.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
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
                      className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className={`text-sm ${isSelected ? 'text-green-800 font-medium' : 'text-gray-700'}`}>
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
        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
          allAnswered
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {submitState === 'submitting' ? 'Checking your answers…' : 'Submit answers'}
      </button>

      {!allAnswered && (
        <p className="mt-2 text-xs text-gray-400">Answer all questions to submit.</p>
      )}
    </div>
  );
}

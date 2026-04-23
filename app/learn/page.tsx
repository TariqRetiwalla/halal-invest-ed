'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  number: number;
  title: string;
  accessible: boolean;
  completed: boolean;
  quizScore: number | null;
}

function LessonCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-5 animate-pulse">
      <div className="h-4 bg-[#1d3268] rounded w-1/4 mb-3" />
      <div className="h-5 bg-[#1d3268] rounded w-3/4 mb-4" />
      <div className="h-9 bg-[#1d3268] rounded w-24" />
    </div>
  );
}

export default function LearnPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lessons')
      .then((res) => {
        if (res.status === 401) {
          router.push('/auth/login?redirect=/learn');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setLessons(data.lessons);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  const completedCount = lessons.filter((l) => l.completed).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold text-[#e8eeff] mb-2">Your lessons</h1>
      <p className="text-sm text-[#8aabcc] mb-6">
        Work through each lesson in order and complete the quiz to unlock the next one.
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#8aabcc]">
            {loading ? '— of 5 lessons complete' : `${completedCount} of 5 lessons complete`}
          </span>
          {!loading && (
            <span className="text-sm text-[#4a6a9a]">{Math.round((completedCount / 5) * 100)}%</span>
          )}
        </div>
        <div className="h-2.5 bg-[#2d4f8a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
            style={{ width: loading ? '0%' : `${(completedCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson cards */}
      <div className="flex flex-col gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <LessonCardSkeleton key={i} />)
          : lessons.map((lesson) => {
              if (lesson.completed) {
                return (
                  <div
                    key={lesson.number}
                    className="rounded-2xl border border-[#c9a84c] bg-[#162550] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#c9a84c] flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <svg className="w-3.5 h-3.5 text-[#0f1f3d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[#c9a84c] mb-0.5">
                          Lesson {lesson.number}
                        </p>
                        <p className="text-sm font-semibold text-[#e8eeff]">{lesson.title}</p>
                        {lesson.quizScore !== null && (
                          <p className="text-xs bg-[#2a2010] text-[#f0d98a] rounded px-1.5 py-0.5 inline-block mt-1">Score: {lesson.quizScore}%</p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/learn/${lesson.number}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-[#162550] border border-[#2d4f8a] text-[#8aabcc] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                    >
                      Review
                    </Link>
                  </div>
                );
              }

              if (lesson.accessible) {
                return (
                  <div
                    key={lesson.number}
                    className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#c9a84c] transition-colors"
                  >
                    <div>
                      <p className="text-xs font-medium text-[#8aabcc] mb-0.5">
                        Lesson {lesson.number}
                      </p>
                      <p className="text-sm font-semibold text-[#e8eeff]">{lesson.title}</p>
                    </div>
                    <Link
                      href={`/learn/${lesson.number}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#162550]"
                    >
                      Start
                    </Link>
                  </div>
                );
              }

              return (
                <div
                  key={lesson.number}
                  className="rounded-2xl border border-[#2d4f8a] bg-[#0f1f3d] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 opacity-60"
                  aria-disabled="true"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-[#2d4f8a] flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg className="w-3.5 h-3.5 text-[#4a6a9a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-xs font-medium text-[#4a6a9a] mb-0.5">
                        Lesson {lesson.number}
                      </p>
                      <p className="text-sm font-semibold text-[#8aabcc]">{lesson.title}</p>
                      <p className="text-xs text-[#4a6a9a] mt-1">
                        Complete the previous lesson to unlock
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

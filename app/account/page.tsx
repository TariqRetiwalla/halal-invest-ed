'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface LessonSummary {
  number: number;
  title: string;
  accessible: boolean;
  completed: boolean;
  quizScore: number | null;
}

type Tab = 'stats' | 'profile' | 'club';

const TABS: { id: Tab; label: string }[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'profile', label: 'Profile' },
  { id: 'club', label: 'Start a Club' },
];

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lessons')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setLessons(data.lessons);
        setLessonsLoading(false);
      })
      .catch(() => setLessonsLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400 text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    // Proxy should have redirected, but handle client-side just in case
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500 text-sm">
        You need to be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Hi, {user.username}
        </h1>
        <p className="mt-1 text-sm text-gray-500 capitalize">
          {user.role === 'TEACHER' ? 'Teacher account' : 'Student account'}
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b border-gray-200 mb-8 gap-1"
        role="tablist"
        aria-label="Account sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
              activeTab === tab.id
                ? 'border-b-2 border-green-600 text-green-700 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div>
        {/* Stats */}
        <div
          id="panel-stats"
          role="tabpanel"
          aria-labelledby="tab-stats"
          hidden={activeTab !== 'stats'}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h2>

          {lessonsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 animate-pulse">
                  <div className="h-3.5 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl border border-gray-100 p-6">
              No lesson data yet.{' '}
              <Link href="/learn" className="text-green-700 underline font-medium hover:text-green-800">
                Start learning
              </Link>
              .
            </p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => {
                let statusLabel: string;
                let statusClass: string;

                if (lesson.completed) {
                  statusLabel = 'Complete';
                  statusClass = 'text-green-700';
                } else if (lesson.accessible) {
                  statusLabel = 'In progress';
                  statusClass = 'text-gray-400';
                } else {
                  statusLabel = 'Not started';
                  statusClass = 'text-gray-300';
                }

                return (
                  <div
                    key={lesson.number}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Lesson {lesson.number}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-semibold ${statusClass}`}>
                        {lesson.completed ? `${statusLabel} ✓` : statusLabel}
                      </p>
                      {lesson.quizScore !== null && (
                        <p className="text-xs text-gray-400 mt-0.5">Score: {lesson.quizScore}%</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          hidden={activeTab !== 'profile'}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Username
              </span>
              <p className="text-sm text-gray-900 mt-0.5">{user.username}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Role
              </span>
              <p className="text-sm text-gray-900 mt-0.5 capitalize">{user.role.toLowerCase()}</p>
            </div>
            {user.ageRange && (
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Age range
                </span>
                <p className="text-sm text-gray-900 mt-0.5">
                  {user.ageRange === 'UNDER_13'
                    ? 'Under 13'
                    : user.ageRange === 'AGE_13_17'
                    ? '13–17'
                    : '18+'}
                </p>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Profile editing (change password, etc.) coming in Sprint 4.
          </p>
        </div>

        {/* Start a Club */}
        <div
          id="panel-club"
          role="tabpanel"
          aria-labelledby="tab-club"
          hidden={activeTab !== 'club'}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Start a Club</h2>
          {user.role === 'TEACHER' ? (
            <div className="bg-green-50 rounded-xl border border-green-100 p-6">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Teacher class management
              </p>
              <p className="text-sm text-gray-500">
                Class code display, student management, lesson locking, and leaderboard controls are
                coming in Sprint 4.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-700 font-medium mb-2">
                Want to learn with a group?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                A Halal Invest Ed club lets you learn alongside classmates, with a teacher guiding
                your progress.
              </p>
              <a
                href="/start-a-club"
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
              >
                Find out how to start a club
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonSummary {
  number: number;
  title: string;
  accessible: boolean;
  completed: boolean;
  quizScore: number | null;
}

interface LessonLock {
  lessonNumber: number;
  isLocked: boolean;
}

interface Student {
  id: string;
  username: string;
  lessonsCompleted: number;
  quizScores: Array<{ lessonNumber: number; score: number }>;
  latestCash: number | null;
}

interface ClassData {
  class: {
    id: string;
    classCode: string;
    name: string;
    simulatorUnlocked: boolean;
  };
  lessonLocks: LessonLock[];
  students: Student[];
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  cashBalance: number | null;
}

type Tab = 'stats' | 'profile' | 'club';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: 'stats', label: 'Stats' },
  { id: 'profile', label: 'Profile' },
  { id: 'club', label: 'Start a Club' },
];

const LESSON_TITLES: Record<number, string> = {
  1: 'What is Halal Investing?',
  2: 'The Three Screens',
  3: 'Interest and Riba',
  4: 'Reading a Company',
  5: 'Building a Portfolio',
};

// ─── Skeleton helper ──────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-[#1d3268] animate-pulse rounded-xl ${className ?? ''}`}
    />
  );
}

// ─── Leaderboard card (shared between Stats and Club tabs) ────────────────────

function LeaderboardCard({
  leaderboard,
  currentUsername,
}: {
  leaderboard: LeaderboardEntry[];
  currentUsername: string;
}) {
  if (leaderboard.length === 0) return null;

  return (
    <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2d4f8a]">
        <h3 className="text-sm font-semibold text-[#e8eeff]">Class Leaderboard</h3>
      </div>
      <ul className="divide-y divide-[#2d4f8a]">
        {leaderboard.map((entry) => {
          const isMe = entry.username === currentUsername;
          return (
            <li
              key={entry.username}
              className={`flex items-center gap-3 px-4 py-2.5 ${
                isMe ? 'border-l-2 border-[#c9a84c] bg-[#1d2a10]' : ''
              }`}
            >
              <span
                className={`w-6 text-center text-xs font-bold flex-shrink-0 ${
                  entry.rank === 1
                    ? 'text-[#f0d98a]'
                    : entry.rank === 2
                    ? 'text-[#8aabcc]'
                    : entry.rank === 3
                    ? 'text-[#c9a84c]'
                    : 'text-[#4a6a9a]'
                }`}
              >
                {entry.rank}
              </span>
              <span
                className={`flex-1 text-sm truncate ${
                  isMe ? 'text-[#f0d98a] font-semibold' : 'text-[#e8eeff]'
                }`}
              >
                {entry.username}
                {isMe && (
                  <span className="ml-1.5 text-[10px] font-normal text-[#c9a84c]">
                    (you)
                  </span>
                )}
              </span>
              <span className="text-sm text-[#8aabcc] flex-shrink-0 font-mono">
                {entry.cashBalance !== null
                  ? `$${entry.cashBalance.toLocaleString()}`
                  : '—'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AccountPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('stats');

  // Stats tab state
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Change password state (profile tab)
  const [cpCurrent, setCpCurrent] = useState('');
  const [cpNew, setCpNew] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState<string | null>(null);
  const [cpSuccess, setCpSuccess] = useState(false);

  // Club tab state (teacher)
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [clubLoading, setClubLoading] = useState(false);
  const [clubError, setClubError] = useState<string | null>(null);
  const [clubLoaded, setClubLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simulatorUnlocking, setSimulatorUnlocking] = useState(false);
  const [lessonToggling, setLessonToggling] = useState<Record<number, boolean>>({});
  const [clubLeaderboard, setClubLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [clubLeaderboardLoading, setClubLeaderboardLoading] = useState(false);
  const [clubLeaderboardError, setClubLeaderboardError] = useState<string | null>(null);

  // ── Fetch lessons (Stats tab) ───────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/lessons', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setLessons(data.lessons ?? []);
        setLessonsLoading(false);
      })
      .catch(() => setLessonsLoading(false));
  }, []);

  // ── Fetch student leaderboard on Stats tab ─────────────────────────────────
  const fetchStudentLeaderboard = useCallback(() => {
    if (!user || user.role !== 'STUDENT') return;
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    fetch('/api/class/leaderboard', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to load leaderboard')))
      .then((data) => {
        setLeaderboard(data.leaderboard ?? []);
        setLeaderboardLoading(false);
      })
      .catch(() => {
        setLeaderboardError('Could not load the class leaderboard.');
        setLeaderboardLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      fetchStudentLeaderboard();
    }
  }, [user, fetchStudentLeaderboard]);

  // ── Fetch teacher class data (lazy — only when club tab first opened) ───────
  const fetchClassData = useCallback(() => {
    setClubLoading(true);
    setClubError(null);
    fetch('/api/teacher/class', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to load class data')))
      .then((data: ClassData) => {
        setClassData(data);
        setClubLoading(false);
        setClubLoaded(true);
      })
      .catch(() => {
        setClubError('Could not load class data. Please try again.');
        setClubLoading(false);
        setClubLoaded(true);
      });
  }, []);

  const fetchClubLeaderboard = useCallback(() => {
    setClubLeaderboardLoading(true);
    setClubLeaderboardError(null);
    fetch('/api/class/leaderboard', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to load leaderboard')))
      .then((data) => {
        setClubLeaderboard(data.leaderboard ?? []);
        setClubLeaderboardLoading(false);
      })
      .catch(() => {
        setClubLeaderboardError('Could not load the leaderboard.');
        setClubLeaderboardLoading(false);
      });
  }, []);

  // When club tab is opened for the first time (teacher only)
  useEffect(() => {
    if (activeTab === 'club' && user?.role === 'TEACHER' && !clubLoaded) {
      fetchClassData();
      fetchClubLeaderboard();
    }
  }, [activeTab, user, clubLoaded, fetchClassData, fetchClubLeaderboard]);

  // ── Change password ─────────────────────────────────────────────────────────
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setCpError(null);
    setCpSuccess(false);
    if (cpNew.length < 8) {
      setCpError('New password must be at least 8 characters.');
      return;
    }
    if (cpNew !== cpConfirm) {
      setCpError('New passwords do not match.');
      return;
    }
    setCpLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cpCurrent, newPassword: cpNew }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCpError(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setCpSuccess(true);
        setCpCurrent('');
        setCpNew('');
        setCpConfirm('');
      }
    } catch {
      setCpError('Network error. Please check your connection and try again.');
    } finally {
      setCpLoading(false);
    }
  }

  // ── Copy class code to clipboard ───────────────────────────────────────────
  function handleCopy(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Unlock simulator ────────────────────────────────────────────────────────
  async function handleUnlockSimulator() {
    if (!classData) return;
    setSimulatorUnlocking(true);
    try {
      const res = await fetch('/api/teacher/simulator/unlock', {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        setClassData((prev) =>
          prev
            ? { ...prev, class: { ...prev.class, simulatorUnlocked: true } }
            : prev
        );
      }
    } finally {
      setSimulatorUnlocking(false);
    }
  }

  // ── Toggle lesson lock ──────────────────────────────────────────────────────
  async function handleLessonToggle(lessonNumber: number, currentlyLocked: boolean) {
    if (!classData) return;
    const action = currentlyLocked ? 'unlock' : 'lock';

    // Optimistic update — upsert: add entry if not yet in array
    setClassData((prev) => {
      if (!prev) return prev;
      const existing = prev.lessonLocks.find((l) => l.lessonNumber === lessonNumber);
      return {
        ...prev,
        lessonLocks: existing
          ? prev.lessonLocks.map((l) =>
              l.lessonNumber === lessonNumber ? { ...l, isLocked: !currentlyLocked } : l
            )
          : [...prev.lessonLocks, { lessonNumber, isLocked: !currentlyLocked }],
      };
    });

    setLessonToggling((prev) => ({ ...prev, [lessonNumber]: true }));

    try {
      const res = await fetch(`/api/teacher/lessons/${lessonNumber}/${action}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) {
        // Revert on error
        setClassData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            lessonLocks: prev.lessonLocks.map((l) =>
              l.lessonNumber === lessonNumber ? { ...l, isLocked: currentlyLocked } : l
            ),
          };
        });
      }
    } catch {
      // Revert on network error — entry now exists in state from optimistic update
      setClassData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          lessonLocks: prev.lessonLocks.map((l) =>
            l.lessonNumber === lessonNumber ? { ...l, isLocked: currentlyLocked } : l
          ),
        };
      });
    } finally {
      setLessonToggling((prev) => ({ ...prev, [lessonNumber]: false }));
    }
  }

  // ── Auth guards ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[#4a6a9a] text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[#8aabcc] text-sm">
        You need to be logged in to view this page.
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e8eeff]">Hi, {user.username}</h1>
        <p className="mt-1 text-sm text-[#8aabcc] capitalize">
          {user.role === 'TEACHER' ? 'Teacher account' : 'Student account'}
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex border-b border-[#2d4f8a] mb-8 gap-1"
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
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] ${
              activeTab === tab.id
                ? 'border-b-2 border-[#c9a84c] text-[#c9a84c] bg-[#2a2010]'
                : 'text-[#8aabcc] hover:text-[#e8eeff] hover:bg-[#162550]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div>

        {/* ── Stats tab ─────────────────────────────────────────────────────── */}
        <div
          id="panel-stats"
          role="tabpanel"
          aria-labelledby="tab-stats"
          hidden={activeTab !== 'stats'}
        >
          <h2 className="text-lg font-semibold text-[#e8eeff] mb-4">Your Stats</h2>

          {/* Lesson progress */}
          {lessonsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#2d4f8a] bg-[#162550] p-4 animate-pulse"
                >
                  <div className="h-3.5 bg-[#1d3268] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-[#8aabcc] bg-[#162550] rounded-xl border border-[#2d4f8a] p-6">
              No lesson data yet.{' '}
              <Link
                href="/learn"
                className="text-[#c9a84c] underline font-medium hover:text-[#f0d98a]"
              >
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
                  statusClass = 'bg-[#1a3020] text-[#4aad70]';
                } else if (lesson.accessible) {
                  statusLabel = 'In progress';
                  statusClass = 'bg-[#1a2a4a] text-[#8aabcc]';
                } else {
                  statusLabel = 'Not started';
                  statusClass = 'bg-[#1a2a4a] text-[#8aabcc]';
                }

                return (
                  <div
                    key={lesson.number}
                    className="rounded-xl border border-[#2d4f8a] bg-[#162550] px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-[#4a6a9a] mb-0.5">Lesson {lesson.number}</p>
                      <p className="text-sm font-medium text-[#e8eeff] truncate">
                        {lesson.title}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p
                        className={`text-xs font-semibold px-2 py-0.5 rounded inline-block ${statusClass}`}
                      >
                        {lesson.completed ? `${statusLabel} ✓` : statusLabel}
                      </p>
                      {lesson.quizScore !== null && (
                        <p className="text-xs bg-[#2a2010] text-[#f0d98a] px-1.5 py-0.5 rounded inline-block ml-1">
                          Score: {lesson.quizScore}%
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Class leaderboard — students only, only if in a class */}
          {user.role === 'STUDENT' && (
            <div className="mt-8">
              {leaderboardLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              ) : leaderboardError ? (
                <p className="text-xs text-[#f08080] bg-[#2a0808] border border-[#8b2a2a] rounded-xl px-4 py-3">
                  {leaderboardError}
                </p>
              ) : leaderboard.length > 0 ? (
                <LeaderboardCard
                  leaderboard={leaderboard}
                  currentUsername={user.username}
                />
              ) : null}
            </div>
          )}
        </div>

        {/* ── Profile tab ───────────────────────────────────────────────────── */}
        <div
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          hidden={activeTab !== 'profile'}
        >
          <h2 className="text-lg font-semibold text-[#e8eeff] mb-4">Profile</h2>
          <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] p-6 space-y-3">
            <div>
              <span className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide">
                Username
              </span>
              <p className="text-sm text-[#e8eeff] mt-0.5">{user.username}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide">
                Role
              </span>
              <p className="text-sm text-[#e8eeff] mt-0.5 capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
            {user.ageRange && (
              <div>
                <span className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide">
                  Age range
                </span>
                <p className="text-sm text-[#e8eeff] mt-0.5">
                  {user.ageRange === 'UNDER_13'
                    ? 'Under 13'
                    : user.ageRange === 'AGE_13_17'
                    ? '13–17'
                    : '18+'}
                </p>
              </div>
            )}
          </div>
          {/* Change password form */}
          <form onSubmit={handleChangePassword} noValidate className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#e8eeff]">Change password</h3>

            {cpSuccess && (
              <div className="rounded-lg bg-[#0a2010] border border-[#2a7a4b] px-4 py-3 text-sm text-[#4aad70]">
                Password updated successfully.
              </div>
            )}
            {cpError && (
              <div role="alert" className="rounded-lg bg-[#2a0808] border border-[#8b2a2a] px-4 py-3 text-sm text-[#f08080]">
                {cpError}
              </div>
            )}

            <div>
              <label htmlFor="cp-current" className="block text-xs font-medium text-[#8aabcc] mb-1">
                Current password
              </label>
              <input
                id="cp-current"
                type="password"
                autoComplete="current-password"
                value={cpCurrent}
                onChange={(e) => setCpCurrent(e.target.value)}
                className="w-full rounded-lg border border-[#2d4f8a] bg-[#0f1f3d] px-4 py-2.5 text-sm text-[#e8eeff] placeholder-[#4a6a9a] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-[#c9a84c] transition"
                placeholder="Your current password"
              />
            </div>
            <div>
              <label htmlFor="cp-new" className="block text-xs font-medium text-[#8aabcc] mb-1">
                New password
              </label>
              <input
                id="cp-new"
                type="password"
                autoComplete="new-password"
                value={cpNew}
                onChange={(e) => setCpNew(e.target.value)}
                className="w-full rounded-lg border border-[#2d4f8a] bg-[#0f1f3d] px-4 py-2.5 text-sm text-[#e8eeff] placeholder-[#4a6a9a] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-[#c9a84c] transition"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label htmlFor="cp-confirm" className="block text-xs font-medium text-[#8aabcc] mb-1">
                Confirm new password
              </label>
              <input
                id="cp-confirm"
                type="password"
                autoComplete="new-password"
                value={cpConfirm}
                onChange={(e) => setCpConfirm(e.target.value)}
                className="w-full rounded-lg border border-[#2d4f8a] bg-[#0f1f3d] px-4 py-2.5 text-sm text-[#e8eeff] placeholder-[#4a6a9a] focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-[#c9a84c] transition"
                placeholder="Repeat new password"
              />
            </div>
            <button
              type="submit"
              disabled={cpLoading}
              className="rounded-xl bg-[#c9a84c] px-5 py-2.5 text-sm font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {cpLoading ? 'Saving…' : 'Update password'}
            </button>
          </form>
        </div>

        {/* ── Start a Club tab ──────────────────────────────────────────────── */}
        <div
          id="panel-club"
          role="tabpanel"
          aria-labelledby="tab-club"
          hidden={activeTab !== 'club'}
        >
          <h2 className="text-lg font-semibold text-[#e8eeff] mb-4">Start a Club</h2>

          {/* ── STUDENT view (unchanged) ────────────────────────────────────── */}
          {user.role !== 'TEACHER' && (
            <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] p-6">
              <p className="text-sm text-[#e8eeff] font-medium mb-2">
                Want to learn with a group?
              </p>
              <p className="text-sm text-[#8aabcc] mb-4">
                A Halal Invest Ed club lets you learn alongside classmates, with a teacher
                guiding your progress.
              </p>
              <a
                href="/start-a-club"
                className="inline-flex items-center text-sm font-medium text-[#c9a84c] hover:text-[#f0d98a] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
              >
                Find out how to start a club
              </a>
            </div>
          )}

          {/* ── TEACHER dashboard ────────────────────────────────────────────── */}
          {user.role === 'TEACHER' && (
            <>
              {/* Loading skeleton */}
              {clubLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-48" />
                  <Skeleton className="h-32" />
                </div>
              )}

              {/* Error state */}
              {!clubLoading && clubError && (
                <div className="bg-[#2a0808] border border-[#8b2a2a] rounded-xl px-4 py-4">
                  <p className="text-sm text-[#f08080]">{clubError}</p>
                  <button
                    onClick={() => {
                      setClubLoaded(false);
                      fetchClassData();
                      fetchClubLeaderboard();
                    }}
                    className="mt-3 text-xs text-[#c9a84c] underline hover:text-[#f0d98a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Dashboard content */}
              {!clubLoading && !clubError && classData && (
                <div className="space-y-6">

                  {/* ── Section 1: Class code ──────────────────────────────── */}
                  <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] p-5">
                    <p className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide mb-3">
                      Your class code
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="font-mono text-3xl font-bold text-[#f0d98a] tracking-widest">
                        {classData.class.classCode}
                      </span>
                      <button
                        onClick={() => handleCopy(classData.class.classCode)}
                        className="rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] bg-[#1d3268] text-[#e8eeff] hover:bg-[#2d4f8a] border border-[#2d4f8a] hover:border-[#c9a84c]"
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-[#8aabcc]">
                      Share this code with students so they can join your class at sign-up.
                    </p>
                  </div>

                  {/* ── Section 2: Simulator access ───────────────────────── */}
                  <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] p-5">
                    <p className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide mb-3">
                      Simulator access
                    </p>
                    {classData.class.simulatorUnlocked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0a2010] text-[#4aad70] border border-[#2a7a4b]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4aad70] inline-block" />
                        Simulator unlocked for class
                      </span>
                    ) : (
                      <div>
                        <p className="text-sm text-[#8aabcc] mb-3">
                          The simulator is locked. Students must complete all 5 lessons first,
                          or you can unlock early for your whole class.
                        </p>
                        <button
                          onClick={handleUnlockSimulator}
                          disabled={simulatorUnlocking}
                          className="rounded-xl py-2.5 px-4 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] bg-[#c9a84c] text-[#0f1f3d] hover:bg-[#b5923a] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {simulatorUnlocking ? 'Unlocking…' : 'Unlock simulator for class'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Section 3: Lesson controls ────────────────────────── */}
                  <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[#2d4f8a]">
                      <p className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide">
                        Lesson access controls
                      </p>
                    </div>
                    <ul className="divide-y divide-[#2d4f8a]">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const lock = classData.lessonLocks.find(
                          (l) => l.lessonNumber === n
                        );
                        // Lesson 1 is always unlocked by default
                        const isLocked = lock ? lock.isLocked : n !== 1;
                        const isToggling = !!lessonToggling[n];

                        return (
                          <li
                            key={n}
                            className="flex items-center justify-between gap-3 px-5 py-3"
                          >
                            <div className="min-w-0">
                              <span className="text-xs text-[#4a6a9a]">Lesson {n}</span>
                              <p className="text-sm text-[#e8eeff] font-medium truncate">
                                {LESSON_TITLES[n]}
                              </p>
                            </div>
                            <button
                              onClick={() => handleLessonToggle(n, isLocked)}
                              disabled={isToggling}
                              className={`flex-shrink-0 rounded-xl py-2.5 px-3.5 text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] disabled:opacity-50 disabled:cursor-not-allowed ${
                                isLocked
                                  ? 'bg-[#1d3268] text-[#8aabcc] border border-[#2d4f8a] hover:border-[#c9a84c] hover:text-[#e8eeff]'
                                  : 'bg-[#0a2010] text-[#4aad70] border border-[#2a7a4b] hover:border-[#4aad70]'
                              }`}
                            >
                              {isToggling
                                ? '…'
                                : isLocked
                                ? 'Unlock'
                                : 'Lock'}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* ── Section 4: Students ───────────────────────────────── */}
                  <div className="bg-[#162550] rounded-xl border border-[#2d4f8a] overflow-hidden">
                    <div className="px-5 py-3 border-b border-[#2d4f8a]">
                      <p className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide">
                        Students
                        {classData.students.length > 0 && (
                          <span className="ml-2 text-[#8aabcc] normal-case">
                            {classData.students.length}{' '}
                            {classData.students.length === 1 ? 'member' : 'members'}
                          </span>
                        )}
                      </p>
                    </div>

                    {classData.students.length === 0 ? (
                      <p className="px-5 py-6 text-sm text-[#8aabcc]">
                        No students have joined yet. Share your class code to get started.
                      </p>
                    ) : (
                      <ul className="divide-y divide-[#2d4f8a]">
                        {classData.students.map((student) => (
                          <li key={student.id} className="px-5 py-3">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#e8eeff]">
                                  {student.username}
                                </p>
                                <p className="text-xs text-[#8aabcc] mt-0.5">
                                  {student.lessonsCompleted}/5 lessons completed
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs text-[#4a6a9a] mb-1">Simulator cash</p>
                                <p className="text-sm font-mono text-[#e8eeff]">
                                  {student.latestCash !== null
                                    ? `$${student.latestCash.toLocaleString()}`
                                    : '—'}
                                </p>
                              </div>
                            </div>
                            {student.quizScores.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {student.quizScores
                                  .sort((a, b) => a.lessonNumber - b.lessonNumber)
                                  .map((qs) => (
                                    <span
                                      key={qs.lessonNumber}
                                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#2a2010] text-[#f0d98a] border border-[#c9a84c]"
                                    >
                                      L{qs.lessonNumber}: {qs.score}%
                                    </span>
                                  ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* ── Section 5: Leaderboard ────────────────────────────── */}
                  <div>
                    <p className="text-xs font-medium text-[#4a6a9a] uppercase tracking-wide mb-3">
                      Leaderboard
                    </p>
                    {clubLeaderboardLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                      </div>
                    ) : clubLeaderboardError ? (
                      <p className="text-xs text-[#f08080] bg-[#2a0808] border border-[#8b2a2a] rounded-xl px-4 py-3">
                        {clubLeaderboardError}
                      </p>
                    ) : clubLeaderboard.length === 0 ? (
                      <p className="text-sm text-[#8aabcc] bg-[#162550] rounded-xl border border-[#2d4f8a] px-5 py-4">
                        No leaderboard data yet. Students need to use the simulator first.
                      </p>
                    ) : (
                      <LeaderboardCard
                        leaderboard={clubLeaderboard}
                        currentUsername={user.username}
                      />
                    )}
                  </div>

                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type AgeRangeValue = 'UNDER_13' | 'AGE_13_17' | 'AGE_18_PLUS' | '';

const AGE_RANGE_OPTIONS: { label: string; value: AgeRangeValue }[] = [
  { label: 'Select your age range', value: '' },
  { label: 'Under 13', value: 'UNDER_13' },
  { label: '13–17', value: 'AGE_13_17' },
  { label: '18+', value: 'AGE_18_PLUS' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRangeValue>('');
  const [classCode, setClassCode] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = 'Username is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (!ageRange) errors.ageRange = 'Please select your age range.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const body: Record<string, string> = { username, email, password, ageRange };
      if (classCode.trim()) body.classCode = classCode.trim();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setUser(data.user);
      router.push('/learn');
    } catch {
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-500">
              Join thousands of students learning halal investing.
            </p>
          </div>

          {apiError && (
            <div
              id="api-error"
              role="alert"
              className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-describedby={fieldErrors.username ? 'username-error' : undefined}
                aria-invalid={!!fieldErrors.username}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.username ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Choose a username"
              />
              {fieldErrors.username && (
                <p id="username-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                aria-invalid={!!fieldErrors.email}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={fieldErrors.password ? 'password-error' : 'password-hint'}
                aria-invalid={!!fieldErrors.password}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="At least 8 characters"
              />
              {fieldErrors.password ? (
                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.password}
                </p>
              ) : (
                <p id="password-hint" className="mt-1 text-xs text-gray-400">
                  Minimum 8 characters.
                </p>
              )}
            </div>

            {/* Age range */}
            <div>
              <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
                Age range
              </label>
              <select
                id="ageRange"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value as AgeRangeValue)}
                aria-describedby={fieldErrors.ageRange ? 'ageRange-error' : undefined}
                aria-invalid={!!fieldErrors.ageRange}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.ageRange ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                {AGE_RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldErrors.ageRange && (
                <p id="ageRange-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.ageRange}
                </p>
              )}
              {ageRange === 'UNDER_13' && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  If you&apos;re under 13, please make sure a parent or guardian knows you&apos;re signing up.
                </p>
              )}
            </div>

            {/* Class code (optional) */}
            <div>
              <label htmlFor="classCode" className="block text-sm font-medium text-gray-700 mb-1">
                Have a class code? Enter it here{' '}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                id="classCode"
                type="text"
                autoComplete="off"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition"
                placeholder="e.g. ABC123"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-green-700 hover:text-green-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

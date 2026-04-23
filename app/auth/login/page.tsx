'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!usernameOrEmail.trim()) errors.usernameOrEmail = 'Username or email is required.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-500">Log in to continue your learning.</p>
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
            {/* Username or email */}
            <div>
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username or email
              </label>
              <input
                id="usernameOrEmail"
                type="text"
                autoComplete="username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                aria-describedby={fieldErrors.usernameOrEmail ? 'uoe-error' : undefined}
                aria-invalid={!!fieldErrors.usernameOrEmail}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.usernameOrEmail
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
                placeholder="Your username or email"
              />
              {fieldErrors.usernameOrEmail && (
                <p id="uoe-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.usernameOrEmail}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                aria-invalid={!!fieldErrors.password}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition ${
                  fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Your password"
              />
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-xs text-red-600" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-green-700 hover:text-green-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const SESSION_FORMAT = [
  { time: '0–10 min', activity: 'Intro: what is halal investing and why does it matter?' },
  {
    time: '10–25 min',
    activity: 'Walk through halal screening criteria together (use the Lessons page)',
  },
  {
    time: '25–45 min',
    activity: 'Students use the Halal Invest Ed simulator — screen 3–5 companies',
  },
  { time: '45–55 min', activity: 'Group discussion: which companies passed? Which failed? Why?' },
  {
    time: '55–60 min',
    activity: 'Wrap-up: what will you look for when you invest in the future?',
  },
];

export default function StartAClubPage() {
  // Teacher registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ classCode: string } | null>(null);

  // Newsletter / club signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  function validateTeacherForm(): boolean {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    if (!password.trim()) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!schoolName.trim()) errors.schoolName = 'School or organisation name is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleTeacherSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validateTeacherForm()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/teacher-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, schoolName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setSuccessData({ classCode: data.classCode });
      }
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupError(null);
    if (!signupEmail.trim() || !signupRole) {
      setSignupError('Please fill in all required fields.');
      return;
    }
    setSignupLoading(true);
    try {
      const res = await fetch('/api/club-signups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, role: signupRole }),
      });
      if (res.ok) {
        setSignupSuccess(true);
      } else {
        const data = await res.json();
        setSignupError(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setSignupError('Something went wrong. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-[#2d4f8a] bg-[#0f1f3d] text-[#e8eeff] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-[#c9a84c] transition';
  const labelClass = 'block text-sm font-medium text-[#8aabcc] mb-1';

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-rules, #printable-rules * { visibility: visible; }
          #printable-rules { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <div className="flex flex-col bg-[#0f1f3d]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#162550] to-[#0f1f3d] px-4 py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#e8eeff] leading-tight tracking-tight">
              Start a <span className="text-[#c9a84c]">Halal Investing Club</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-[#8aabcc] max-w-xl mx-auto leading-relaxed">
              Everything you need to run an engaging Islamic finance session for young people.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto w-full px-4 py-14 space-y-12">
          {/* Section 1 — What is a Halal Investing Club? */}
          <section aria-labelledby="what-is-heading">
            <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8">
              <h2
                id="what-is-heading"
                className="text-xl font-bold text-[#e8eeff] mb-4"
              >
                What is a Halal Investing Club?
              </h2>
              <p className="text-sm text-[#8aabcc] leading-relaxed mb-5">
                A Halal Investing Club is a structured session where students learn to evaluate
                investments through an Islamic finance lens. Using our free simulator alongside paper
                trading tools, participants build real financial literacy — grounded in Islamic
                values.
              </p>
              <p className="text-sm font-medium text-[#8aabcc] mb-3">Suitable for:</p>
              <ul className="space-y-2 list-none m-0 p-0">
                {[
                  'Islamic school classes (secondary level)',
                  'Masjid youth groups',
                  'Home education co-ops',
                  'Parent-led sessions at home',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#8aabcc]">
                    <span className="text-[#c9a84c] mt-0.5" aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 2 — Session Format Guide */}
          <section aria-labelledby="session-format-heading">
            <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8">
              <h2
                id="session-format-heading"
                className="text-xl font-bold text-[#e8eeff] mb-2"
              >
                Session Format Guide
              </h2>
              <p className="text-sm text-[#4a6a9a] mb-6">60 minutes</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left text-[#c9a84c] font-semibold pb-3 pr-6 whitespace-nowrap border-b border-[#2d4f8a]">
                        Time
                      </th>
                      <th className="text-left text-[#c9a84c] font-semibold pb-3 border-b border-[#2d4f8a]">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SESSION_FORMAT.map((row, i) => (
                      <tr key={i} className="border-b border-[#2d4f8a] last:border-0">
                        <td className="py-3 pr-6 text-[#8aabcc] whitespace-nowrap align-top font-medium">
                          {row.time}
                        </td>
                        <td className="py-3 text-[#8aabcc] align-top leading-relaxed">
                          {row.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-5 text-xs text-[#4a6a9a] leading-relaxed border-t border-[#2d4f8a] pt-4">
                <span className="font-semibold text-[#8aabcc]">For a 30-minute session:</span> skip
                the group discussion or reduce simulator time to 2–3 companies.
              </p>
            </div>
          </section>

          {/* Section 3 — Printable Halal Ground Rules */}
          <section aria-labelledby="ground-rules-heading">
            <div
              id="printable-rules"
              className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <h2
                  id="ground-rules-heading"
                  className="text-xl font-bold text-[#e8eeff]"
                >
                  Halal Investing Rules for Our Trading Game
                </h2>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-full border border-[#c9a84c] px-4 py-2 text-sm font-semibold text-[#c9a84c] hover:bg-[#2a2010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors"
                >
                  Print this page
                </button>
              </div>
              <ol className="space-y-5 list-none m-0 p-0 mb-6">
                {[
                  {
                    label: 'What does this company do?',
                    body: 'No alcohol, tobacco, weapons, gambling, adult content, or pork businesses.',
                  },
                  {
                    label: 'How much debt does it carry?',
                    body: 'Total debt should be less than 33% of total assets. (Find this on the company\'s balance sheet or a finance site.)',
                  },
                  {
                    label: 'Does it earn money from interest?',
                    body: 'Interest income should be less than 5% of total revenue.',
                  },
                ].map((rule, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#c9a84c] text-[#0f1f3d] font-bold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="text-sm text-[#8aabcc] leading-relaxed">
                      <span className="font-semibold text-[#e8eeff]">{rule.label}</span> —{' '}
                      {rule.body}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="border-t border-[#2d4f8a] pt-5 space-y-3">
                <p className="text-sm text-[#8aabcc] leading-relaxed">
                  If a company fails any of these tests — you cannot buy it in our game. If
                  you&apos;re not sure — use the Halal Invest Ed simulator to check first!
                </p>
                <p className="text-sm text-[#8aabcc] leading-relaxed">
                  Remember: we are practising being responsible, ethical investors — not just chasing
                  profit.
                </p>
                <p className="text-xs text-[#4a6a9a] leading-relaxed border-t border-[#2d4f8a] pt-4 mt-2">
                  This checklist is a simplified educational guide. For certified Shariah-compliant
                  investing, consult a qualified Islamic finance scholar.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 — What Students Need */}
          <section aria-labelledby="students-need-heading">
            <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8">
              <h2
                id="students-need-heading"
                className="text-xl font-bold text-[#e8eeff] mb-5"
              >
                What Students Need
              </h2>
              <ul className="space-y-3 list-none m-0 p-0">
                {[
                  'A device with a browser (phone, tablet, or computer)',
                  'A free Halal Invest Ed account (or the simulator can be used without an account for a demo)',
                  'For the trading game: a free MarketWatch Virtual Stock Exchange account',
                  'No prior knowledge needed — everything is explained step by step',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#8aabcc] leading-relaxed">
                    <span className="text-[#c9a84c] mt-0.5 flex-shrink-0" aria-hidden="true">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 — Teacher Registration Form */}
          <section aria-labelledby="teacher-register-heading">
            <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8">
              <h2
                id="teacher-register-heading"
                className="text-xl font-bold text-[#e8eeff] mb-1"
              >
                Register as a Teacher
              </h2>
              <p className="text-sm text-[#8aabcc] mb-7 leading-relaxed">
                Create your free teacher account to get a class code, manage lesson access, and
                track your students&apos; progress.
              </p>

              {successData ? (
                <div className="rounded-xl border border-[#2a7a4b] bg-[#0a2010] p-6 text-center space-y-4">
                  <p className="text-lg font-bold text-[#4aad70]">
                    ✓ Your account has been created!
                  </p>
                  <div>
                    <p className="text-sm text-[#8aabcc] mb-3">Your class code:</p>
                    <p className="font-mono text-3xl font-extrabold text-[#c9a84c] tracking-widest">
                      {successData.classCode}
                    </p>
                  </div>
                  <p className="text-sm text-[#8aabcc] leading-relaxed max-w-sm mx-auto">
                    Share this code with your students when they sign up — they enter it during
                    registration to join your class.
                  </p>
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors"
                  >
                    Go to your dashboard →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleTeacherSubmit} noValidate className="space-y-5">
                  {apiError && (
                    <div className="rounded-lg border border-[#8b2a2a] bg-[#2a0808] px-4 py-3 text-sm text-[#f08080]">
                      {apiError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="teacher-name" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="teacher-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      aria-describedby={fieldErrors.name ? 'teacher-name-error' : undefined}
                      aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && (
                      <p id="teacher-name-error" className="mt-1 text-xs text-[#f08080]">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="teacher-email" className={labelClass}>
                      Email address
                    </label>
                    <input
                      id="teacher-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      aria-describedby={fieldErrors.email ? 'teacher-email-error' : undefined}
                      aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && (
                      <p id="teacher-email-error" className="mt-1 text-xs text-[#f08080]">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="teacher-password" className={labelClass}>
                      Password
                    </label>
                    <input
                      id="teacher-password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      aria-describedby={fieldErrors.password ? 'teacher-password-error' : undefined}
                      aria-invalid={!!fieldErrors.password}
                    />
                    {fieldErrors.password && (
                      <p id="teacher-password-error" className="mt-1 text-xs text-[#f08080]">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="teacher-school" className={labelClass}>
                      School or organisation name
                    </label>
                    <input
                      id="teacher-school"
                      type="text"
                      autoComplete="organization"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className={inputClass}
                      aria-describedby={
                        fieldErrors.schoolName ? 'teacher-school-error' : undefined
                      }
                      aria-invalid={!!fieldErrors.schoolName}
                    />
                    {fieldErrors.schoolName && (
                      <p id="teacher-school-error" className="mt-1 text-xs text-[#f08080]">
                        {fieldErrors.schoolName}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-8 py-3 text-sm font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating account…' : 'Create teacher account'}
                  </button>
                </form>
              )}

              <p className="mt-5 text-sm text-[#4a6a9a] text-center">
                Already have a teacher account?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#c9a84c] hover:text-[#b5923a] underline underline-offset-2 transition-colors"
                >
                  Log in →
                </Link>
              </p>
            </div>
          </section>

          {/* Stay updated — parents/club leaders */}
          <section aria-labelledby="stay-updated-heading">
            <div className="rounded-2xl border border-[#2d4f8a] bg-[#162550] p-6 sm:p-8">
              <h2
                id="stay-updated-heading"
                className="text-xl font-bold text-[#e8eeff] mb-1"
              >
                Resources for parents and club leaders
              </h2>
              <p className="text-sm text-[#8aabcc] mb-7 leading-relaxed">
                Leave your email and we&apos;ll let you know when new materials are available.
              </p>

              {signupSuccess ? (
                <div className="rounded-xl border border-[#2a7a4b] bg-[#0a2010] px-5 py-4 text-sm text-[#4aad70] text-center font-medium">
                  Thank you! We&apos;ll be in touch.
                </div>
              ) : (
                <form onSubmit={handleSignupSubmit} noValidate className="space-y-5">
                  {signupError && (
                    <div className="rounded-lg border border-[#8b2a2a] bg-[#2a0808] px-4 py-3 text-sm text-[#f08080]">
                      {signupError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="signup-name" className={labelClass}>
                      Name{' '}
                      <span className="text-[#4a6a9a] font-normal">(optional)</span>
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-email" className={labelClass}>
                      Email address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-role" className={labelClass}>
                      I am a
                    </label>
                    <select
                      id="signup-role"
                      required
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value)}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="" disabled>
                        Select…
                      </option>
                      <option value="Teacher">Teacher</option>
                      <option value="Parent">Parent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full inline-flex items-center justify-center rounded-full border border-[#c9a84c] px-8 py-3 text-sm font-semibold text-[#c9a84c] hover:bg-[#2a2010] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signupLoading ? 'Sending…' : 'Keep me posted'}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

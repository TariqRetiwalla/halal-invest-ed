'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { label: 'Learn', href: '/learn' },
  { label: 'Play', href: '/play' },
  { label: 'Account', href: '/account' },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-green-700 tracking-tight hover:text-green-800 transition-colors"
        >
          Halal Invest Ed
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-gray-700 font-medium hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth controls */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-gray-400">Loading…</span>
          ) : user ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                Hi, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded-full border border-green-600 text-green-700 font-medium hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-green-700 transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-4 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-green-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            // X icon
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1"
        >
          <ul className="list-none m-0 p-0 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 rounded-md text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            {loading ? (
              <span className="block text-sm text-gray-400 px-3 py-2">Loading…</span>
            ) : user ? (
              <>
                <span className="block text-sm font-medium text-gray-700 px-3 py-2">
                  Hi, {user.username}
                </span>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="block w-full text-left py-2 px-3 rounded-md text-green-700 font-medium hover:bg-green-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 px-3 rounded-md text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 px-3 rounded-full bg-green-600 text-white text-center font-medium hover:bg-green-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

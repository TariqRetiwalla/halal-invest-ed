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
    <header className="bg-[#0f1f3d] border-b border-[#2d4f8a] sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-bold text-[#c9a84c] tracking-tight hover:text-[#f0d98a] transition-colors"
        >
          Halal Invest Ed
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[#8aabcc] font-medium hover:text-[#c9a84c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth controls */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-[#8aabcc]">Loading…</span>
          ) : user ? (
            <>
              <span className="text-sm font-medium text-[#e8eeff]">
                Hi, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 rounded-full border border-[#c9a84c] text-[#c9a84c] font-medium hover:bg-[#2a2010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[#8aabcc] hover:text-[#c9a84c] transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] rounded"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-sm px-4 py-2 rounded-full bg-[#c9a84c] text-[#0f1f3d] font-medium hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-[#8aabcc] hover:text-[#c9a84c] hover:bg-[#162550] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors"
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
          className="md:hidden border-t border-[#2d4f8a] bg-[#162550] px-4 py-4 space-y-1"
        >
          <ul className="list-none m-0 p-0 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 rounded-md text-[#8aabcc] font-medium hover:bg-[#1d3268] hover:text-[#c9a84c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-[#2d4f8a] space-y-2">
            {loading ? (
              <span className="block text-sm text-[#8aabcc] px-3 py-2">Loading…</span>
            ) : user ? (
              <>
                <span className="block text-sm font-medium text-[#e8eeff] px-3 py-2">
                  Hi, {user.username}
                </span>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="block w-full text-left py-2 px-3 rounded-md text-[#c9a84c] font-medium hover:bg-[#2a2010] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 px-3 rounded-md text-[#8aabcc] font-medium hover:bg-[#1d3268] hover:text-[#c9a84c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block py-2 px-3 rounded-full bg-[#c9a84c] text-[#0f1f3d] text-center font-medium hover:bg-[#b5923a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const NAV_ITEMS = [
  { href: '/blog', label: 'Blog' },
  { href: '/Insight', label: 'Insight' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 64 && y > lastY);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Hide navbar on /me routes — AFTER all hooks
  if (pathname.startsWith('/me')) return null;

  return (
    <nav
      className={`navbar--fixed-top ${hidden ? 'navbar--hidden' : ''}`}
      style={{ height: 64, background: 'transparent' }}
    >
      <div className="flex items-center justify-between h-full max-w-5xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-1 hover:opacity-80">
          <img src="/img/logo/whitemode.png" alt="Hae02y" className="h-9 md:h-10 block dark:hidden" />
          <img src="/img/logo/darkmode.png" alt="Hae02y" className="h-9 md:h-10 hidden dark:block" />
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`border-b px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] transition-opacity hover:opacity-70 ${
                  active ? 'border-[var(--primary)] opacity-100' : 'border-transparent opacity-55'
                }`}
              >
                {item.label}.
              </Link>
            );
          })}
          <a
            href="https://github.com/hae02y"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-transparent px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] opacity-55 transition-opacity hover:opacity-70"
          >
            GitHub.
          </a>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

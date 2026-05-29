'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const publicLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
  { href: '/blog', label: 'Blog' },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-gray-900 ${
        active ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500'
      }`}
    >
      {label}
    </Link>
  );
}

export default function HeaderOffline() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-gray-900 hover:text-gray-600 transition-colors">
            Mon Blog
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {publicLinks.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </nav>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signup"
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                pathname === '/signup'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              Inscription
            </Link>
            <Link
              href="/login"
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                pathname === '/login'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            >
              Connexion
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {publicLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  pathname === href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-1">
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Inscription
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                Connexion
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from '@/components/LogoutButton';
import type { SessionData } from '@/app/lib/session';

const publicLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/about', label: 'À propos' },
  { href: '/blog', label: 'Blog' },
];

const bloggerLinks = [
  { href: '/blog/create', label: 'Créer un article' },
  { href: '/profil', label: 'Mon profil' },
];

const adminLinks = [
  { href: '/blog/create', label: 'Créer un article' },
  { href: '/profil', label: 'Mon profil' },
];

function getPrivateLinks(role: string) {
  if (role === 'ADMIN') return adminLinks;
  return bloggerLinks;
}

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

function MobileNavLink({
  href,
  label,
  onClose,
}: {
  href: string;
  label: string;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );
}

export default function HeaderOnline({ session }: { session: SessionData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = session.role;
  const privateLinks = getPrivateLinks(role);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-gray-900 hover:text-gray-600 transition-colors">
            Mon Blog
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[...publicLinks, ...privateLinks].map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </nav>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="font-medium text-gray-900">@{session.pseudo}</span>
              {' · '}
              <span className={role === 'ADMIN' ? 'text-red-600 font-medium' : 'text-blue-600'}>
                {role === 'ADMIN' ? 'Admin' : 'Blogueur'}
              </span>
            </span>
            <LogoutButton />
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
            {[...publicLinks, ...privateLinks].map(({ href, label }) => (
              <MobileNavLink key={href} href={href} label={label} onClose={() => setMenuOpen(false)} />
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-2 px-3 py-2">
              <p className="text-sm text-gray-500">
                Connecté en tant que{' '}
                <span className="font-medium text-gray-900">@{session.pseudo}</span>
              </p>
              <LogoutButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

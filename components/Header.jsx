"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { key: "home", label: "Ana Sayfa", href: "/" },
  { key: "yargitay", label: "Yargıtay", href: "/yargitay" },
  { key: "vocabulary", label: "Kelime Bilgisi", href: "/search?type=vocabulary" },
  { key: "practice", label: "Pratik", href: "/search?type=practice" },
  { key: "articles", label: "Makaleler", href: "/articles" },
  { key: "forum", label: "Forum", href: "/forum" },
  { key: "progress", label: "İlerleme", href: "/dashboard" },
];

function NavLink({ item, hovered, setHovered, onClick }) {
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHovered(item.key)}
      onMouseLeave={() => setHovered(null)}
      onClick={onClick}
      className="relative py-2 md:py-1 text-juris-text/70 hover:text-juris-accent transition-colors block md:inline-block font-semibold"
    >
      {item.label}
      {hovered === item.key && (
        <span
          className="absolute left-0 right-0 bottom-0 md:-bottom-1 h-px bg-juris-accent hidden md:block"
        />
      )}
    </Link>
  );
}

export default function Header() {
  const { data: session, status } = useSession();
  const [hovered, setHovered] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-6 md:px-16 py-6 border-b bg-juris-bg/90 border-slate-200 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-2xl text-juris-text font-bold tracking-wide hover:scale-105 transition-transform"
        >
          JURIS<span className="text-juris-accent">LINK</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-sm">
          {navItems.map((item) => (
            <NavLink key={item.key} item={item} hovered={hovered} setHovered={setHovered} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === "authenticated" ? (
              <>
                <Link
                  href="/settings"
                  className="text-juris-text/60 text-sm font-semibold hover:text-juris-accent transition-colors"
                >
                  Merhaba, {session.user.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-juris-text/80 text-sm font-bold px-4 py-2 hover:text-juris-accent transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-juris-text/80 text-sm font-bold px-4 py-2 hover:text-juris-accent transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/signup"
                  className="bg-juris-accent text-white shadow-sm text-sm font-semibold px-5 py-2.5 rounded hover:scale-105 hover:shadow-md transition-all"
                >
                  Ücretsiz Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-juris-text p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Mobil menüyü aç/kapat"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-4">
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink 
                key={item.key} 
                item={item} 
                hovered={hovered} 
                setHovered={setHovered} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>
          <div className="flex flex-col gap-3 mt-2 border-t border-slate-200 pt-4">
            {status === "authenticated" ? (
              <>
                <Link
                  href="/settings"
                  className="text-juris-text/60 text-sm font-semibold hover:text-juris-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Merhaba, {session.user.name} (Ayarlar)
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-left text-juris-text/80 text-sm font-bold hover:text-juris-accent transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-juris-text/80 text-sm font-bold hover:text-juris-accent transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/signup"
                  className="bg-juris-accent text-white shadow-sm text-center text-sm font-semibold px-5 py-2.5 rounded hover:scale-105 transition-transform inline-block w-full max-w-xs"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Ücretsiz Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

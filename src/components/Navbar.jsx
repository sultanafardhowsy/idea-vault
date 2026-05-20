'use client';

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import userAvatar from "@/assets/user.png";
import logo from "@/assets/vault.png";
import { useRouter } from 'next/navigation';
import { Avatar } from '@heroui/react';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(user?.name);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      {/* Global styles injected once */}
      <style>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }
        .dark .glass-nav {
          background: rgba(10, 15, 30, 0.60);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.35);
        }

        .glass-mobile-menu {
          background: rgba(255, 255, 255, 0.70);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        .dark .glass-mobile-menu {
          background: rgba(10, 15, 30, 0.75);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        /* Glass button */
        .glass-btn {
          background: rgba(80, 80, 80, 0.12);
          border: 1px solid rgba(80, 80, 80, 0.18);
          color: #111;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .glass-btn:hover {
          background: rgba(80, 80, 80, 0.22);
          border-color: rgba(80, 80, 80, 0.35);
          transform: translateY(-1px);
        }
        .dark .glass-btn {
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #fff;
        }
        .dark .glass-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.32);
        }

        /* Nav link */
        .nav-link {
          color: #111;
          position: relative;
          transition: color 0.2s;
        }
        .dark .nav-link {
          color: #fff;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          opacity: 0.5;
          border-radius: 2px;
          transition: width 0.25s ease;
        }
        .nav-link:hover::after { width: 100%; }

        /* Theme toggle */
        .theme-toggle {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.12);
          background: rgba(0,0,0,0.05);
          cursor: pointer;
          transition: background 0.2s;
          color: #111;
        }
        .dark .theme-toggle {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff;
        }
        .theme-toggle:hover {
          background: rgba(0,0,0,0.10);
        }
        .dark .theme-toggle:hover {
          background: rgba(255,255,255,0.15);
        }

        /* Username text */
        .username-text { color: #111; }
        .dark .username-text { color: #fff; }

        /* Mobile link */
        .mobile-link { color: #111; }
        .dark .mobile-link { color: #fff; }

        /* Divider */
        .mobile-divider { border-color: rgba(0,0,0,0.10); }
        .dark .mobile-divider { border-color: rgba(255,255,255,0.10); }

        /* Hamburger */
        .hamburger { color: #111; }
        .dark .hamburger { color: #fff; }
      `}</style>

      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="logo"
              width={200}
              height={150}
              className="object-contain w-[100px] sm:w-[130px] md:w-[160px] lg:w-[200px]"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center md:gap-4 lg:gap-8 font-semibold text-sm md:text-base lg:text-lg">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/show-alldata" className="nav-link">Ideas</Link>
            {user && (
              <>
                <Link href="/add-idea" className="nav-link">Add Idea</Link>
                <Link href="/updatepage" className="nav-link">Update Idea</Link>
              </>
            )}
          </div>

          {/* Desktop User/Auth + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                // Sun icon
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                // Moon icon
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {isPending ? (
              <span className="username-text text-sm md:text-base">Loading...</span>
            ) : user ? (
              <div className="relative user-menu-container flex items-center">
                {/* Dropdown Trigger */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-85 focus:outline-none cursor-pointer"
                >
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <Avatar.Image alt={user.name} src={user?.image} />
                    <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                  </Avatar>
                  <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                    {initials}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2 lg:gap-3">
                <Link
                  href="/login"
                  className="glass-btn px-4 py-2 rounded-xl font-bold text-xs sm:text-sm md:text-base inline-block"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="glass-btn px-4 py-2 rounded-xl font-bold text-xs sm:text-sm md:text-base inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <button
              className="hamburger text-2xl sm:text-3xl leading-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="glass-mobile-menu md:hidden px-4 sm:px-6 py-5 space-y-4">

            {/* Mobile Links */}
            <div className="flex flex-col gap-3 font-semibold text-sm sm:text-base">
              <Link href="/" className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/show-alldata" className="mobile-link" onClick={() => setMenuOpen(false)}>Ideas</Link>
              {user && (
                <>
                  <Link href="/add-idea" className="mobile-link" onClick={() => setMenuOpen(false)}>Add Idea</Link>
                  <Link href="/updatepage" className="mobile-link" onClick={() => setMenuOpen(false)}>Update Idea</Link>
                </>
              )}
            </div>

            {/* Mobile User/Auth */}
            {isPending ? (
              <span className="block mobile-link">Loading...</span>
            ) : user ? (
              <div className="flex flex-col gap-3 pt-3 border-t mobile-divider">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <Avatar.Image alt={user.name} src={user?.image} />
                    <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                  </Avatar>
                  <h2 className="font-semibold username-text text-sm sm:text-base">{user.name}</h2>
                </div>
                <Link href="/profile" className="mobile-link font-semibold" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  className="glass-btn px-4 py-2 rounded-xl font-bold text-sm text-left"
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.href = '/';
                    setMenuOpen(false);
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-3 border-t mobile-divider">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="glass-btn px-4 py-2 rounded-xl font-bold text-center text-sm inline-block"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="glass-btn px-4 py-2 rounded-xl font-bold text-center text-sm inline-block"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

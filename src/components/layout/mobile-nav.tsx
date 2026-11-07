"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

type NavLink = {
  label: string;
  href: string;
};

type MobileNavProps = {
  links: NavLink[];
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
};

export function MobileNav({ links, user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b border-slate-200 bg-white px-4 py-5 shadow-lg sm:px-6">
          {user && (
            <div className="mb-4 border-b border-slate-100 pb-3">
              <p className="text-sm font-semibold text-slate-900">{user.name ?? user.email}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Role: {user.role}
              </p>
            </div>
          )}

          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 border-t border-slate-100 pt-4">
            {user ? (
              <div className="w-full">
                <LogoutButton className="w-full inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-blue-hover"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


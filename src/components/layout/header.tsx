import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getSession } from "@/lib/auth";

type NavLink = {
  label: string;
  href: string;
};

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white shadow-xs">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SkillBridge <span className="text-brand-blue">BD</span>
            </span>
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-1">
            <Link
              href="/jobs"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Jobs
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-xs"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export async function Header() {
  const session = await getSession();
  const user = session?.user;

  // Navigation items by role according to requirements:
  // - visitor: Jobs, Login, Register
  // - candidate: Jobs, Profile, Applications
  // - employer: My Jobs, Organization
  // - admin: Reports
  let links: NavLink[] = [];

  if (!user) {
    links = [{ label: "Jobs", href: "/jobs" }];
  } else if (user.role === "CANDIDATE") {
    links = [
      { label: "Jobs", href: "/jobs" },
      { label: "Profile", href: "/candidate/profile" },
      { label: "Applications", href: "/candidate/applications" },
    ];
  } else if (user.role === "EMPLOYER") {
    links = [
      { label: "My Jobs", href: "/employer/jobs" },
      { label: "Organization", href: "/employer/organization" },
    ];
  } else if (user.role === "ADMIN") {
    links = [{ label: "Reports", href: "/admin/reports" }];
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Text Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-blue rounded-lg"
          >
            {/* Visual shield badge matching design */}
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white shadow-xs">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SkillBridge <span className="text-brand-blue">BD</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden md:flex md:items-center md:gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="block text-sm font-semibold text-slate-900 leading-tight">
                  {user.name ?? user.email}
                </span>
                <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <MobileNav links={links} user={user} />
      </div>
    </header>
  );
}

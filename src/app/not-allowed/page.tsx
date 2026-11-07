import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { getSession } from "@/lib/auth/session";
import { ROLE_HOME, isRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Access Denied — SkillBridge BD",
};

export default async function NotAllowedPage() {
  const session = await getSession();
  const role = session?.user?.role;
  const homeHref = isRole(role) ? ROLE_HOME[role] : "/";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xs sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Access not allowed</h1>
        <p className="mt-2 text-sm text-slate-600">
          Your account does not have permission to view this page.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Go to my dashboard
          </Link>
          {session?.user ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}


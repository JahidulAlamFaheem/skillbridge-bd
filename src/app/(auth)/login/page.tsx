import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeCallbackUrl } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Sign In — SkillBridge BD",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    registered?: string | string[];
  }>;
};

async function LoginFormWithParams({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[]; registered?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawCallback = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const safeCallbackUrl = getSafeCallbackUrl(rawCallback);
  const registered = params.registered === "1";

  return <LoginForm callbackUrl={safeCallbackUrl} registered={registered} />;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="flex-1 bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back to Home link */}
        <div className="mb-6 flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* 2-Column Split Container matching 02-login.png */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-12">
          {/* Left Column: Evidence-First Value Proposition */}
          <div className="flex flex-col justify-between border-b border-slate-200 bg-gradient-to-br from-blue-50/70 via-slate-50/80 to-indigo-50/50 p-6 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                Evidence-Based Hiring
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Evidence-Based Hiring for Bangladesh.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Transparent skill matching, clear project evidence, and direct employer review across Dhaka,
                Chattogram, and remote teams.
              </p>

              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/60 p-3.5 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Project Evidence Profile</p>
                    <p className="text-slate-600">Every claimed skill backed by real work.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/60 p-3.5 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-brand-blue">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Explainable Skill Match</p>
                    <p className="text-slate-600">No hidden AI ranking or arbitrary filters.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-xs text-slate-600">
              <p className="italic">
                &ldquo;Show what you built, not just what you claim on a traditional resume.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Styled Form Card */}
          <div className="p-6 sm:p-10 lg:col-span-7">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
              <p className="mt-1.5 text-sm text-slate-600">
                Sign in to manage your profile and view applications.
              </p>
            </div>

            <Suspense fallback={<LoginForm />}>
              <LoginFormWithParams searchParams={searchParams} />
            </Suspense>

            <p className="mt-6 text-center text-xs text-slate-600">
              New to SkillBridge BD?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-blue underline hover:text-brand-blue-hover"
              >
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

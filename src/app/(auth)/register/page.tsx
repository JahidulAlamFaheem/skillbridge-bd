import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account — SkillBridge BD",
};

export default function RegisterPage() {
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

        {/* 2-Column Split Container matching 03-register.png */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-12">
          {/* Left Column: Evidence Proposition */}
          <div className="flex flex-col justify-between border-b border-slate-200 bg-gradient-to-br from-blue-50/70 via-slate-50/80 to-indigo-50/50 p-6 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                Start Your Tech Journey
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Start Your Evidence-First Tech Journey.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Skip resume exaggeration. Present your real skills with project evidence to tech employers in
                Bangladesh.
              </p>

              <div className="mt-8 space-y-4 text-xs">
                <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/60 p-3.5 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Skill Evidence Backing</p>
                    <p className="text-slate-600">Link real repositories and portfolio items.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/60 p-3.5 shadow-xs">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-brand-blue">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">100% Free for Candidates</p>
                    <p className="text-slate-600">Never pay fees to show your skills or apply.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-200/60 bg-white/70 p-4 text-xs text-slate-600">
              <p className="italic">
                &ldquo;Every skill on your candidate profile can be linked to one or more real projects.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Styled Form Card */}
          <div className="p-6 sm:p-10 lg:col-span-7">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
              <p className="mt-1.5 text-sm text-slate-600">
                Choose your role and join the SkillBridge BD community.
              </p>
            </div>

            <RegisterForm />

            <p className="mt-6 text-center text-xs text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-blue underline hover:text-brand-blue-hover"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Intro & Actions */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs font-semibold text-brand-blue">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                Bangladesh Tech Talent &bull; Project-Driven
              </div>

              {/* Main Headline */}
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Launch Your Tech Career in Bangladesh on{" "}
                <span className="text-brand-blue underline decoration-brand-blue/30 decoration-wavy underline-offset-8">
                  Project Evidence
                </span>
                , Not Resume Buzzwords.
              </h1>

              {/* Intro Body */}
              <p className="mt-6 text-lg leading-8 text-slate-600 sm:max-w-xl">
                SkillBridge BD connects early-career job seekers with engineering teams across
                Dhaka, Chattogram, and remote. Back every claimed skill with real code and
                portfolio evidence—with no hidden scores and no AI ranking.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                >
                  Browse jobs
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  Create free profile
                </Link>
              </div>

              {/* Quick Locations / Tech Tags */}
              <div className="mt-10 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Hubs:</span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">Dhaka</span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">Chattogram</span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">Cumilla</span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">Sylhet</span>
                <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">Remote</span>
              </div>
            </div>

            {/* Right Column: Evidence Profile Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-brand-blue font-bold">
                      NJ
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Nusrat Jahan</h3>
                      <p className="text-xs text-slate-500">Frontend Developer &bull; Dhaka</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    Evidence Profile
                  </span>
                </div>

                {/* Evidence Links Showcase */}
                <div className="mt-5 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Evidenced Skills
                  </p>

                  {/* Skill 1 */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">React</span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand-blue">
                        2 Projects Linked
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <span className="text-emerald-700">&bull;</span>
                        <span>Dhaka Bus Route Finder (Web App)</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-emerald-700">&bull;</span>
                        <span>Personal Portfolio Site (Portfolio)</span>
                      </p>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">Tailwind CSS</span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand-blue">
                        1 Project Linked
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <span className="text-emerald-700">&bull;</span>
                        <span>Responsive Accessible Components</span>
                      </p>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">TypeScript</span>
                      <span className="rounded bg-slate-200/60 px-2 py-0.5 text-xs font-medium text-slate-700">
                        Profile Skill
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informational Callout */}
                <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700">
                  <p className="font-semibold text-brand-blue">Explainable Skill Match</p>
                  <p className="mt-0.5 text-slate-600">
                    Jobs show exact matched, missing, and additional skills. No artificial score or hidden ranking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Built for Transparent, Evidence-First Hiring
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              Traditional hiring relies on keyword-stuffed resumes. SkillBridge BD lets your work speak directly.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Skill Evidence Profile</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Every skill on your candidate profile can be linked to one or more real projects or portfolio items.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Explainable Skill Match</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                See transparent matched, missing, and additional skills for every job. No black-box algorithms or AI verdicts.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Direct Applications</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Apply directly to employers and track your application status from submission to review and decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps: How It Works */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              How SkillBridge BD Works
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
              Three simple steps to evidence-based tech opportunities.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <span className="text-3xl font-extrabold text-brand-blue/30">01</span>
              <h3 className="mt-2 text-base font-bold text-slate-900">Build Your Evidence Profile</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Add your technical skills and link projects or portfolio repos to back them up with proof.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <span className="text-3xl font-extrabold text-brand-blue/30">02</span>
              <h3 className="mt-2 text-base font-bold text-slate-900">Compare Requirements</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                View clear matched and missing skills for each vacancy before deciding to apply.
              </p>
            </div>

            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
              <span className="text-3xl font-extrabold text-brand-blue/30">03</span>
              <h3 className="mt-2 text-base font-bold text-slate-900">Apply &amp; Track Status</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                Submit your application and track progress as employers review your evidencing profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-slate-200 bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Ready to let your project evidence speak for you?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-300">
            Explore open tech roles across Bangladesh or create your profile in minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Browse jobs
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-6 py-3.5 text-base font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

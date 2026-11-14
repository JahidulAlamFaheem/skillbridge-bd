import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SkillsManager } from "@/components/candidate/skills-manager";
import { requireRole } from "@/lib/auth/session";
import {
  listControlledSkills,
  listOwnCandidateSkills,
} from "@/lib/candidate/skills";

export const metadata: Metadata = {
  title: "My Skills — SkillBridge BD",
};

async function SkillsContent() {
  const user = await requireRole("CANDIDATE");
  const [skills, catalog] = await Promise.all([
    listOwnCandidateSkills(user.id),
    listControlledSkills(),
  ]);

  return <SkillsManager skills={skills} catalog={catalog} />;
}

function SkillsFallback() {
  return (
    <div
      role="status"
      aria-label="Loading skills"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading skills...
    </div>
  );
}

export default function CandidateSkillsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My skills
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select skills from the controlled catalog to show on your candidate profile.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/candidate/profile"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            Back to profile
          </Link>
          <Link
            href="/candidate/projects"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            My projects
          </Link>
        </div>
      </header>

      <Suspense fallback={<SkillsFallback />}>
        <SkillsContent />
      </Suspense>
    </main>
  );
}

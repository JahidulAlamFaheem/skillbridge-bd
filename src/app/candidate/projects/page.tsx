import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProjectsManager } from "@/components/candidate/projects-manager";
import { requireRole } from "@/lib/auth/session";
import { listOwnProjects } from "@/lib/candidate/projects";

export const metadata: Metadata = {
  title: "My Projects — SkillBridge BD",
};

async function ProjectsContent() {
  const user = await requireRole("CANDIDATE");
  const projects = await listOwnProjects(user.id);

  return <ProjectsManager projects={projects} />;
}

function ProjectsFallback() {
  return (
    <div
      role="status"
      aria-label="Loading projects"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading projects...
    </div>
  );
}

export default function CandidateProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My projects &amp; portfolio
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Add and manage the projects and portfolio items that back your skills.
          </p>
        </div>
        <Link
          href="/candidate/profile"
          className="inline-flex items-center justify-center self-start rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue sm:self-auto"
        >
          Back to profile
        </Link>
      </header>

      <Suspense fallback={<ProjectsFallback />}>
        <ProjectsContent />
      </Suspense>
    </main>
  );
}

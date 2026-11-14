import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { JobForm } from "@/components/employer/job-form";
import { requireRole } from "@/lib/auth/session";
import { listControlledSkills } from "@/lib/candidate/skills";
import { getEmployerOrganizationBasic } from "@/lib/employer/jobs";

export const metadata: Metadata = {
  title: "Post a New Job — SkillBridge BD",
};

async function NewJobContent() {
  const user = await requireRole("EMPLOYER");
  const [organization, catalog] = await Promise.all([
    getEmployerOrganizationBasic(user.id),
    listControlledSkills(),
  ]);

  if (!organization) {
    redirect("/employer/organization?notice=create-first");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-xs">
        <p className="text-xs font-bold tracking-wider text-brand-blue uppercase">
          Posting for {organization.name}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          Select 1 to 15 required skills from the controlled catalog so candidates can compare
          their skills and project evidence transparently.
        </p>
      </div>

      <JobForm mode="create" catalog={catalog} />
    </div>
  );
}

function NewJobFallback() {
  return (
    <div
      role="status"
      aria-label="Loading job form"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading job form...
    </div>
  );
}

export default function NewEmployerJobPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Post a New Job
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a structured job listing with required skills from the controlled catalog.
          </p>
        </div>

        <Link
          href="/employer/jobs"
          className="inline-flex items-center justify-center self-start rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          Back to my jobs
        </Link>
      </header>

      <Suspense fallback={<NewJobFallback />}>
        <NewJobContent />
      </Suspense>
    </main>
  );
}

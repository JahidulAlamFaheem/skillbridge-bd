import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import type { JobStatus } from "@/generated/prisma/client";
import { JobForm } from "@/components/employer/job-form";
import { JobStatusActions } from "@/components/employer/job-status-actions";
import { requireRole } from "@/lib/auth/session";
import { listControlledSkills } from "@/lib/candidate/skills";
import { getEmployerOrganizationBasic, getOwnJobForEdit } from "@/lib/employer/jobs";

export const metadata: Metadata = {
  title: "Edit Job — SkillBridge BD",
};

type EditEmployerJobPageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_BADGE: Record<JobStatus, { label: string; className: string }> = {
  DRAFT: {
    label: "Draft",
    className: "border-slate-300 bg-slate-100 text-slate-800",
  },
  PUBLISHED: {
    label: "Published",
    className: "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
  CLOSED: {
    label: "Closed",
    className: "border-amber-300 bg-amber-50 text-amber-900",
  },
  REMOVED: {
    label: "Removed",
    className: "border-red-300 bg-red-50 text-red-900",
  },
};

async function EditJobContent({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole("EMPLOYER");
  const { id } = await params;

  const [organization, job, catalog] = await Promise.all([
    getEmployerOrganizationBasic(user.id),
    getOwnJobForEdit(user.id, id),
    listControlledSkills(),
  ]);

  if (!organization) {
    redirect("/employer/organization?notice=create-first");
  }

  if (!job) {
    notFound();
  }

  const badge = STATUS_BADGE[job.status];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-xs font-bold tracking-wider text-brand-blue uppercase">
              {organization.name}
            </p>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Update job details and required skills, or change listing status.
          </p>
        </div>

        <JobStatusActions jobId={job.id} status={job.status} />
      </div>

      <JobForm mode="edit" catalog={catalog} job={job} />
    </div>
  );
}

function EditJobFallback() {
  return (
    <div
      role="status"
      aria-label="Loading job editor"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading job details...
    </div>
  );
}

export default function EditEmployerJobPage({ params }: EditEmployerJobPageProps) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Edit Job
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Modify your job listing details, required skills, or publication status.
          </p>
        </div>

        <Link
          href="/employer/jobs"
          className="inline-flex items-center justify-center self-start rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          Back to my jobs
        </Link>
      </header>

      <Suspense fallback={<EditJobFallback />}>
        <EditJobContent params={params} />
      </Suspense>
    </main>
  );
}

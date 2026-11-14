import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ExperienceLevel, JobStatus, JobType, WorkArrangement } from "@/generated/prisma/client";
import { JobStatusActions } from "@/components/employer/job-status-actions";
import { requireRole } from "@/lib/auth/session";
import { listOwnOrganizationJobs } from "@/lib/employer/jobs";
import { MAX_JOBS_PER_ORGANIZATION, formatDateForInput } from "@/lib/validation/job";

export const metadata: Metadata = {
  title: "My Jobs — SkillBridge BD",
};

type EmployerJobsPageProps = {
  searchParams: Promise<{ saved?: string | string[] }>;
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

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  INTERN: "Intern",
  ENTRY: "Entry",
  JUNIOR: "Junior",
  MID: "Mid-Level",
  SENIOR: "Senior",
};

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
};

const WORK_ARRANGEMENT_LABELS: Record<WorkArrangement, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

async function EmployerJobsContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string | string[] }>;
}) {
  const user = await requireRole("EMPLOYER");
  const [{ organization, jobs }, resolvedParams] = await Promise.all([
    listOwnOrganizationJobs(user.id),
    searchParams,
  ]);

  if (!organization) {
    redirect("/employer/organization?notice=create-first");
  }

  const savedParam = Array.isArray(resolvedParams.saved)
    ? resolvedParams.saved[0]
    : resolvedParams.saved;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-wider text-brand-blue uppercase">
            {organization.name}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Showing {jobs.length} of {MAX_JOBS_PER_ORGANIZATION} job slots used.
          </p>
        </div>

        <Link
          href="/employer/jobs/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        >
          New job
        </Link>
      </div>

      {savedParam === "published" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Job created and published.
        </div>
      )}

      {savedParam === "draft" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Job saved as a draft.
        </div>
      )}

      {jobs.length === 0 ? (
        <section
          aria-labelledby="empty-jobs-heading"
          className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs sm:p-12"
        >
          <h2 id="empty-jobs-heading" className="text-lg font-bold text-slate-900">
            No jobs yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Create your first job listing and select required skills from the controlled catalog.
          </p>
          <div className="mt-5">
            <Link
              href="/employer/jobs/new"
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
            >
              New job
            </Link>
          </div>
        </section>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => {
            const badge = STATUS_BADGE[job.status];
            const createdDate = formatDateForInput(job.createdAt);
            const deadlineDate = formatDateForInput(job.deadline);

            return (
              <li
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-lg font-bold text-slate-900 break-words">
                        {job.title}
                      </h2>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <dl className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                      <div>
                        <dt className="sr-only">Location</dt>
                        <dd className="font-medium text-slate-800">{job.location}</dd>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">
                        •
                      </span>
                      <div>
                        <dt className="sr-only">Experience Level</dt>
                        <dd>{EXPERIENCE_LABELS[job.experienceLevel]}</dd>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">
                        •
                      </span>
                      <div>
                        <dt className="sr-only">Job Type</dt>
                        <dd>{JOB_TYPE_LABELS[job.jobType]}</dd>
                      </div>
                      <span aria-hidden="true" className="text-slate-300">
                        •
                      </span>
                      <div>
                        <dt className="sr-only">Work Arrangement</dt>
                        <dd>{WORK_ARRANGEMENT_LABELS[job.workArrangement]}</dd>
                      </div>
                    </dl>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>
                        {job.requiredSkillCount}{" "}
                        {job.requiredSkillCount === 1 ? "required skill" : "required skills"}
                      </span>
                      <span>Created {createdDate}</span>
                      {deadlineDate && <span>Deadline {deadlineDate}</span>}
                    </div>
                  </div>

                  <JobStatusActions jobId={job.id} status={job.status} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmployerJobsFallback() {
  return (
    <div
      role="status"
      aria-label="Loading jobs"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading your jobs...
    </div>
  );
}

export default function EmployerJobsPage({ searchParams }: EmployerJobsPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My jobs
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Create, edit, publish, and close job listings for your organization.
        </p>
      </header>

      <Suspense fallback={<EmployerJobsFallback />}>
        <EmployerJobsContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

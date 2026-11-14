"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { JobSkillSelector } from "@/components/employer/job-skill-selector";
import {
  createJobAction,
  updateJobAction,
  type JobFieldName,
  type JobFormActionState,
  type JobFormValues,
} from "@/lib/employer/job-actions";
import type { EmployerJobDetail } from "@/lib/employer/jobs";
import type { SkillCatalogEntry } from "@/lib/skills/normalise";
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_ARRANGEMENTS,
  formatDateForInput,
  type ExperienceLevelValue,
  type JobTypeValue,
  type WorkArrangementValue,
} from "@/lib/validation/job";

type JobFormProps = {
  mode: "create" | "edit";
  catalog: SkillCatalogEntry[];
  job?: EmployerJobDetail;
};

const EXPERIENCE_LABELS: Record<ExperienceLevelValue, { title: string; subtitle: string }> = {
  INTERN: { title: "Intern", subtitle: "Student or trainee" },
  ENTRY: { title: "Entry Level", subtitle: "0 - 1 year experience" },
  JUNIOR: { title: "Junior", subtitle: "1 - 2 years experience" },
  MID: { title: "Mid-Level", subtitle: "2 - 5 years experience" },
  SENIOR: { title: "Senior", subtitle: "5+ years experience" },
};

const JOB_TYPE_LABELS: Record<JobTypeValue, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
  CONTRACT: "Contract",
};

const WORK_ARRANGEMENT_LABELS: Record<WorkArrangementValue, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100";

const labelClass = "block text-sm font-semibold text-slate-900";

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages || messages.length === 0) {
    return null;
  }
  return (
    <p id={id} className="mt-1 text-xs text-red-700">
      {messages[0]}
    </p>
  );
}

export function JobForm({ mode, catalog, job }: JobFormProps) {
  const startingValues: JobFormValues = {
    title: job?.title ?? "",
    description: job?.description ?? "",
    location: job?.location ?? "",
    experienceLevel: job?.experienceLevel ?? "ENTRY",
    jobType: job?.jobType ?? "FULL_TIME",
    workArrangement: job?.workArrangement ?? "ONSITE",
    deadline: formatDateForInput(job?.deadline ?? null),
    skillIds: job ? job.skills.map((skill) => skill.id) : [],
  };

  const initialState: JobFormActionState = {
    status: "idle",
    values: startingValues,
  };

  const action = mode === "edit" ? updateJobAction : createJobAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const values = state.values ?? startingValues;
  const errors = state.fieldErrors ?? {};
  const isLockedRemoved = job?.status === "REMOVED";
  const isDisabled = isPending || isLockedRemoved;

  const [titleLength, setTitleLength] = useState(values.title.length);
  const [descriptionLength, setDescriptionLength] = useState(values.description.length);

  function hasError(field: JobFieldName): boolean {
    return Boolean(errors[field]?.length);
  }

  return (
    <form action={formAction} noValidate className="space-y-6">
      {mode === "edit" && job && (
        <input type="hidden" name="jobId" value={job.id} />
      )}

      {isLockedRemoved && (
        <div
          role="alert"
          className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-900"
        >
          <p className="font-bold">This job listing has been removed and is locked.</p>
          <p className="mt-1 text-xs text-red-800">
            Removed jobs cannot be edited, published, or closed by the employer.
          </p>
        </div>
      )}

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}

      {state.status === "success" && state.message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          {state.message}
        </div>
      )}

      {/* Section 01: Role Basics & Location */}
      <section
        aria-labelledby="section-basics-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-light text-xs font-bold text-brand-blue">
              01
            </span>
            <div>
              <h2 id="section-basics-heading" className="text-lg font-bold text-slate-900">
                Role Basics &amp; Location
              </h2>
              <p className="text-xs text-slate-500">
                Core details of the vacancy.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            Step 1 of 3
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="job-title" className={labelClass}>
              Job Title <span className="text-red-600">*</span>
            </label>
            <input
              id="job-title"
              name="title"
              type="text"
              required
              defaultValue={values.title}
              onChange={(event) => setTitleLength(event.target.value.length)}
              placeholder="e.g. Junior Frontend Developer (React & TypeScript)"
              disabled={isDisabled}
              aria-invalid={hasError("title")}
              aria-describedby="job-title-hint job-title-error"
              className={`mt-1.5 ${inputClass}`}
            />
            <p id="job-title-hint" className="mt-1 text-xs text-slate-500">
              {titleLength}/120 characters
            </p>
            <FieldError id="job-title-error" messages={errors.title} />
          </div>

          <fieldset>
            <legend className={labelClass}>
              Experience Level <span className="text-red-600">*</span>
            </legend>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {EXPERIENCE_LEVELS.map((level) => {
                const info = EXPERIENCE_LABELS[level];
                return (
                  <label
                    key={level}
                    className="relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs transition-all hover:border-brand-blue/60 has-checked:border-brand-blue has-checked:bg-blue-50/40 has-checked:ring-1 has-checked:ring-brand-blue"
                  >
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      defaultChecked={values.experienceLevel === level}
                      disabled={isDisabled}
                      className="mt-0.5 h-3.5 w-3.5 border-slate-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>
                      <span className="block font-bold text-slate-900">{info.title}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">
                        {info.subtitle}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            <FieldError
              id="job-experience-level-error"
              messages={errors.experienceLevel}
            />
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="job-work-arrangement" className={labelClass}>
                Work Arrangement <span className="text-red-600">*</span>
              </label>
              <select
                id="job-work-arrangement"
                name="workArrangement"
                defaultValue={values.workArrangement}
                disabled={isDisabled}
                aria-invalid={hasError("workArrangement")}
                aria-describedby="job-work-arrangement-error"
                className={`mt-1.5 ${inputClass}`}
              >
                {WORK_ARRANGEMENTS.map((arrangement) => (
                  <option key={arrangement} value={arrangement}>
                    {WORK_ARRANGEMENT_LABELS[arrangement]}
                  </option>
                ))}
              </select>
              <FieldError
                id="job-work-arrangement-error"
                messages={errors.workArrangement}
              />
            </div>

            <div>
              <label htmlFor="job-type" className={labelClass}>
                Job Type <span className="text-red-600">*</span>
              </label>
              <select
                id="job-type"
                name="jobType"
                defaultValue={values.jobType}
                disabled={isDisabled}
                aria-invalid={hasError("jobType")}
                aria-describedby="job-type-error"
                className={`mt-1.5 ${inputClass}`}
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {JOB_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
              <FieldError id="job-type-error" messages={errors.jobType} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="job-location" className={labelClass}>
                Location <span className="text-red-600">*</span>
              </label>
              <input
                id="job-location"
                name="location"
                type="text"
                required
                defaultValue={values.location}
                placeholder="e.g. Dhaka, Chattogram, or Remote"
                disabled={isDisabled}
                aria-invalid={hasError("location")}
                aria-describedby="job-location-error"
                className={`mt-1.5 ${inputClass}`}
              />
              <FieldError id="job-location-error" messages={errors.location} />
            </div>

            <div>
              <label htmlFor="job-deadline" className={labelClass}>
                Application Deadline <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="job-deadline"
                name="deadline"
                type="date"
                defaultValue={values.deadline}
                disabled={isDisabled}
                aria-invalid={hasError("deadline")}
                aria-describedby="job-deadline-hint job-deadline-error"
                className={`mt-1.5 ${inputClass}`}
              />
              <p id="job-deadline-hint" className="mt-1 text-xs text-slate-500">
                Leave blank for no fixed deadline. Cannot be in the past.
              </p>
              <FieldError id="job-deadline-error" messages={errors.deadline} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Required Skills */}
      <section
        aria-labelledby="section-skills-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-light text-xs font-bold text-brand-blue">
              02
            </span>
            <div>
              <h2 id="section-skills-heading" className="text-lg font-bold text-slate-900">
                Required Skills
              </h2>
              <p className="text-xs text-slate-500">
                Candidates will see how their profile skills and project evidence compare against
                this list.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            Step 2 of 3
          </span>
        </div>

        <JobSkillSelector
          key={values.skillIds.join(",")}
          catalog={catalog}
          initialSkillIds={values.skillIds}
          disabled={isDisabled}
          errorMessages={errors.skillIds}
        />
      </section>

      {/* Section 03: Job Description */}
      <section
        aria-labelledby="section-description-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-light text-xs font-bold text-brand-blue">
              03
            </span>
            <div>
              <h2 id="section-description-heading" className="text-lg font-bold text-slate-900">
                Job Description &amp; Responsibilities
              </h2>
              <p className="text-xs text-slate-500">
                Describe day-to-day responsibilities, team context, and expectations.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            Step 3 of 3
          </span>
        </div>

        <div>
          <label htmlFor="job-description" className={labelClass}>
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            id="job-description"
            name="description"
            rows={8}
            required
            defaultValue={values.description}
            onChange={(event) => setDescriptionLength(event.target.value.length)}
            placeholder="Outline what the candidate will work on, team structure, and what to expect..."
            disabled={isDisabled}
            aria-invalid={hasError("description")}
            aria-describedby="job-description-hint job-description-error"
            className={`mt-1.5 ${inputClass}`}
          />
          <p id="job-description-hint" className="mt-1 text-xs text-slate-500">
            {descriptionLength}/5000 characters
          </p>
          <FieldError id="job-description-error" messages={errors.description} />
        </div>
      </section>

      {/* Bottom Action Bar */}
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:px-6">
        <Link
          href="/employer/jobs"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          Back to my jobs
        </Link>

        {!isLockedRemoved && (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="submit"
              name="intent"
              value="DRAFT"
              disabled={isDisabled}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-xs transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save as draft"}
            </button>

            <button
              type="submit"
              name="intent"
              value="PUBLISH"
              disabled={isDisabled}
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

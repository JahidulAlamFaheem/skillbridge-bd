"use client";

import { useActionState, useState } from "react";
import { ProjectForm } from "@/components/candidate/project-form";
import {
  deleteProjectAction,
  type DeleteProjectActionState,
} from "@/lib/candidate/project-actions";
import type { OwnCandidateProject } from "@/lib/candidate/projects";

type ProjectCardProps = {
  project: OwnCandidateProject;
};

const initialDeleteState: DeleteProjectActionState = {
  status: "idle",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteProjectAction,
    initialDeleteState,
  );

  const badgeLabel = project.kind === "PORTFOLIO" ? "Portfolio" : "Project";
  const badgeClasses =
    project.kind === "PORTFOLIO"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-blue-200 bg-blue-50 text-brand-blue";

  if (isEditing) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900">Edit project</h3>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            Done
          </button>
        </div>
        <ProjectForm
          mode="edit"
          project={project}
          onCancel={() => setIsEditing(false)}
        />
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      {deleteState.status === "error" && deleteState.message && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {deleteState.message}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-bold text-slate-900">
              {project.title}
            </h3>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClasses}`}
            >
              {badgeLabel}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsConfirmingDelete(false);
              setIsEditing(true);
            }}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-60"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmingDelete((prev) => !prev)}
            disabled={isDeleting}
            aria-expanded={isConfirmingDelete}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-xs transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line break-words text-sm leading-6 text-slate-700">
        {project.description}
      </p>

      {project.url && (
        <div className="mt-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <span className="truncate">{project.url}</span>
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      )}

      {isConfirmingDelete && (
        <div
          role="region"
          aria-label={`Confirm deletion of ${project.title}`}
          className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-4"
        >
          <p className="text-xs font-semibold text-red-900">
            Delete &ldquo;{project.title}&rdquo;?
          </p>
          <p className="mt-1 text-xs text-red-800">
            This cannot be undone. Any skill evidence links pointing to this project will also be
            removed.
          </p>
          <form action={deleteFormAction} className="mt-3 flex flex-wrap items-center gap-2">
            <input type="hidden" name="projectId" value={project.id} />
            <button
              type="submit"
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Confirm delete"}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-60"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

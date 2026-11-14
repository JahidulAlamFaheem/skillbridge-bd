"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  linkEvidenceAction,
  unlinkEvidenceAction,
  type EvidenceActionState,
} from "@/lib/candidate/evidence-actions";
import type { OwnCandidateProject } from "@/lib/candidate/projects";
import type { LinkedEvidenceProject } from "@/lib/candidate/skills";
import { MAX_EVIDENCE_PER_SKILL } from "@/lib/validation/evidence";

type SkillEvidenceControlsProps = {
  candidateSkillId: string;
  skillName: string;
  linkedProjects: LinkedEvidenceProject[];
  allCandidateProjects: OwnCandidateProject[];
};

const initialEvidenceState: EvidenceActionState = {
  status: "idle",
};

function LinkedProjectItem({
  candidateSkillId,
  project,
}: {
  candidateSkillId: string;
  project: LinkedEvidenceProject;
}) {
  const [unlinkState, unlinkFormAction, isUnlinking] = useActionState(
    unlinkEvidenceAction,
    initialEvidenceState,
  );

  return (
    <li className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
      {unlinkState.status === "error" && unlinkState.message && (
        <p role="alert" className="mb-2 text-xs text-red-700">
          {unlinkState.message}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold text-slate-900">
            {project.title}
          </p>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs font-medium text-brand-blue underline hover:text-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <span className="truncate">{project.url}</span>
            </a>
          )}
        </div>

        <form action={unlinkFormAction} className="shrink-0">
          <input type="hidden" name="candidateSkillId" value={candidateSkillId} />
          <input type="hidden" name="projectId" value={project.id} />
          <button
            type="submit"
            disabled={isUnlinking}
            aria-label={`Unlink ${project.title}`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUnlinking ? "Unlinking..." : "Unlink"}
          </button>
        </form>
      </div>
    </li>
  );
}

export function SkillEvidenceControls({
  candidateSkillId,
  skillName,
  linkedProjects,
  allCandidateProjects,
}: SkillEvidenceControlsProps) {
  const [linkState, linkFormAction, isLinking] = useActionState(
    linkEvidenceAction,
    initialEvidenceState,
  );

  const linkedIds = new Set(linkedProjects.map((project) => project.id));
  const unlinkedProjects = allCandidateProjects.filter(
    (project) => !linkedIds.has(project.id),
  );
  const limitReached = linkedProjects.length >= MAX_EVIDENCE_PER_SKILL;
  const selectId = `add-evidence-select-${candidateSkillId}`;

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Linked project evidence ({linkedProjects.length})
        </h4>
      </div>

      {linkedProjects.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 px-3.5 py-3 text-xs text-slate-600">
          No projects linked to {skillName} yet.
        </p>
      ) : (
        <ul className="mt-2.5 space-y-2">
          {linkedProjects.map((project) => (
            <LinkedProjectItem
              key={project.id}
              candidateSkillId={candidateSkillId}
              project={project}
            />
          ))}
        </ul>
      )}

      {/* Add Evidence Control */}
      <div className="mt-3.5">
        {linkState.status === "error" && linkState.message && (
          <div
            role="alert"
            className="mb-2.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800"
          >
            {linkState.message}
          </div>
        )}

        {linkState.status === "success" && linkState.message && (
          <div
            role="status"
            className="mb-2.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs text-emerald-900"
          >
            {linkState.message}
          </div>
        )}

        {allCandidateProjects.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
            <span>You have no projects in your portfolio yet. </span>
            <Link
              href="/candidate/projects"
              className="font-semibold text-brand-blue underline hover:text-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              Add a project on your Projects page
            </Link>
            <span> to link it as evidence.</span>
          </div>
        ) : limitReached ? (
          <p className="text-xs text-slate-500">
            Maximum of {MAX_EVIDENCE_PER_SKILL} projects linked to this skill.
          </p>
        ) : unlinkedProjects.length === 0 ? (
          <p className="text-xs text-slate-500">
            All of your current projects are linked to {skillName}.{" "}
            <Link
              href="/candidate/projects"
              className="font-medium text-brand-blue underline hover:text-brand-blue-hover"
            >
              Manage projects
            </Link>
          </p>
        ) : (
          <form
            action={linkFormAction}
            className="flex flex-col gap-2 sm:flex-row sm:items-end"
          >
            <input type="hidden" name="candidateSkillId" value={candidateSkillId} />
            <div className="flex-1">
              <label
                htmlFor={selectId}
                className="block text-xs font-semibold text-slate-700"
              >
                Add evidence for {skillName}
              </label>
              <select
                id={selectId}
                name="projectId"
                defaultValue={unlinkedProjects[0]?.id ?? ""}
                disabled={isLinking}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
              >
                {unlinkedProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title} ({project.kind === "PORTFOLIO" ? "Portfolio" : "Project"})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLinking}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-blue px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLinking ? "Linking..." : "+ Add evidence"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import {
  removeSkillAction,
  type RemoveSkillActionState,
} from "@/lib/candidate/skill-actions";
import type { OwnCandidateSkill } from "@/lib/candidate/skills";

type SkillCardProps = {
  item: OwnCandidateSkill;
};

const initialRemoveState: RemoveSkillActionState = {
  status: "idle",
};

export function SkillCard({ item }: SkillCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [removeState, removeFormAction, isRemoving] = useActionState(
    removeSkillAction,
    initialRemoveState,
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      {removeState.status === "error" && removeState.message && (
        <div
          role="alert"
          className="mb-3 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-xs text-red-800"
        >
          {removeState.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-xs font-bold text-brand-blue uppercase"
          >
            {item.skill.name.slice(0, 2)}
          </span>
          <h3 className="truncate text-base font-bold text-slate-900">
            {item.skill.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirming((prev) => !prev)}
          disabled={isRemoving}
          aria-expanded={isConfirming}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-xs transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-60"
        >
          Remove
        </button>
      </div>

      {isConfirming && (
        <div
          role="region"
          aria-label={`Confirm removal of ${item.skill.name}`}
          className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-3.5"
        >
          <p className="text-xs font-semibold text-red-900">
            Remove &ldquo;{item.skill.name}&rdquo; from your profile?
          </p>
          <p className="mt-1 text-xs text-red-800">
            Any project evidence links for this skill will also be removed.
          </p>
          <form action={removeFormAction} className="mt-3 flex flex-wrap items-center gap-2">
            <input type="hidden" name="candidateSkillId" value={item.id} />
            <button
              type="submit"
              disabled={isRemoving}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRemoving ? "Removing..." : "Confirm remove"}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              disabled={isRemoving}
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

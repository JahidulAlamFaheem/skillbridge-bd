"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { JobStatus } from "@/generated/prisma/client";
import {
  closeJobAction,
  publishJobAction,
  type JobStatusActionState,
} from "@/lib/employer/job-actions";

type JobStatusActionsProps = {
  jobId: string;
  status: JobStatus;
};

const initialStatusState: JobStatusActionState = {
  status: "idle",
};

export function JobStatusActions({ jobId, status }: JobStatusActionsProps) {
  const [publishState, publishFormAction, isPublishing] = useActionState(
    publishJobAction,
    initialStatusState,
  );
  const [closeState, closeFormAction, isClosing] = useActionState(
    closeJobAction,
    initialStatusState,
  );

  const isBusy = isPublishing || isClosing;
  const activeFeedback =
    publishState.status !== "idle" ? publishState : closeState;

  if (status === "REMOVED") {
    return (
      <span className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800">
        Removed (locked)
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/employer/jobs/${jobId}/edit`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue"
        >
          Edit
        </Link>

        {(status === "DRAFT" || status === "CLOSED") && (
          <form action={publishFormAction}>
            <input type="hidden" name="jobId" value={jobId} />
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
          </form>
        )}

        {status === "PUBLISHED" && (
          <form action={closeFormAction}>
            <input type="hidden" name="jobId" value={jobId} />
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-900 shadow-xs transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isClosing ? "Closing..." : "Close"}
            </button>
          </form>
        )}
      </div>

      {activeFeedback.status === "error" && activeFeedback.message && (
        <p role="alert" className="text-xs font-medium text-red-700">
          {activeFeedback.message}
        </p>
      )}

      {activeFeedback.status === "success" && activeFeedback.message && (
        <p role="status" className="text-xs font-medium text-emerald-800">
          {activeFeedback.message}
        </p>
      )}
    </div>
  );
}

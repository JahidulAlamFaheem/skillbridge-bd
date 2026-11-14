"use client";

import { useActionState, useState } from "react";
import {
  createProjectAction,
  updateProjectAction,
  type ProjectFieldName,
  type ProjectFormActionState,
} from "@/lib/candidate/project-actions";
import type { OwnCandidateProject } from "@/lib/candidate/projects";
import type { ProjectKindValue } from "@/lib/validation/project";

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: OwnCandidateProject;
  disabled?: boolean;
  onCancel?: () => void;
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

export function ProjectForm({
  mode,
  project,
  disabled = false,
  onCancel,
}: ProjectFormProps) {
  const initialValues = {
    title: project?.title ?? "",
    description: project?.description ?? "",
    url: project?.url ?? "",
    kind: (project?.kind ?? "PROJECT") as ProjectKindValue,
  };

  const initialState: ProjectFormActionState = {
    status: "idle",
    values: initialValues,
  };

  const action = mode === "edit" ? updateProjectAction : createProjectAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const values = state.values ?? initialValues;
  const errors = state.fieldErrors ?? {};
  const formIdPrefix = mode === "edit" && project ? `edit-${project.id}` : "create-project";
  const formKey = `${formIdPrefix}-${state.nonce ?? 0}`;

  const [titleLength, setTitleLength] = useState(values.title.length);
  const [descriptionLength, setDescriptionLength] = useState(values.description.length);

  const isDisabled = isPending || disabled;

  function hasError(field: ProjectFieldName): boolean {
    return Boolean(errors[field]?.length);
  }

  return (
    <form key={formKey} action={formAction} noValidate className="space-y-4">
      {mode === "edit" && project && (
        <input type="hidden" name="projectId" value={project.id} />
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

      <div>
        <label htmlFor={`${formIdPrefix}-title`} className={labelClass}>
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id={`${formIdPrefix}-title`}
          name="title"
          type="text"
          required
          defaultValue={values.title}
          onChange={(event) => setTitleLength(event.target.value.length)}
          placeholder="e.g. Dhaka Bus Route Finder"
          disabled={isDisabled}
          aria-invalid={hasError("title")}
          aria-describedby={`${formIdPrefix}-title-hint ${formIdPrefix}-title-error`}
          className={`mt-1.5 ${inputClass}`}
        />
        <p id={`${formIdPrefix}-title-hint`} className="mt-1 text-xs text-slate-500">
          {titleLength}/120 characters
        </p>
        <FieldError id={`${formIdPrefix}-title-error`} messages={errors.title} />
      </div>

      <fieldset>
        <legend className={labelClass}>
          Kind <span className="text-red-600">*</span>
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition-all hover:border-brand-blue/60 has-checked:border-brand-blue has-checked:bg-blue-50/40 has-checked:ring-1 has-checked:ring-brand-blue">
            <input
              type="radio"
              name="kind"
              value="PROJECT"
              defaultChecked={values.kind === "PROJECT"}
              disabled={isDisabled}
              className="mt-0.5 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">Project</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                A specific application, repository, or build.
              </span>
            </span>
          </label>

          <label className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition-all hover:border-brand-blue/60 has-checked:border-brand-blue has-checked:bg-blue-50/40 has-checked:ring-1 has-checked:ring-brand-blue">
            <input
              type="radio"
              name="kind"
              value="PORTFOLIO"
              defaultChecked={values.kind === "PORTFOLIO"}
              disabled={isDisabled}
              className="mt-0.5 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span className="flex-1">
              <span className="block font-semibold text-slate-900">Portfolio</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                A personal site, notebook, or showcase collection.
              </span>
            </span>
          </label>
        </div>
        <FieldError id={`${formIdPrefix}-kind-error`} messages={errors.kind} />
      </fieldset>

      <div>
        <label htmlFor={`${formIdPrefix}-description`} className={labelClass}>
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id={`${formIdPrefix}-description`}
          name="description"
          rows={4}
          required
          defaultValue={values.description}
          onChange={(event) => setDescriptionLength(event.target.value.length)}
          placeholder="Describe what you built, the tools you used, and your contribution."
          disabled={isDisabled}
          aria-invalid={hasError("description")}
          aria-describedby={`${formIdPrefix}-description-hint ${formIdPrefix}-description-error`}
          className={`mt-1.5 ${inputClass}`}
        />
        <p id={`${formIdPrefix}-description-hint`} className="mt-1 text-xs text-slate-500">
          {descriptionLength}/1000 characters
        </p>
        <FieldError id={`${formIdPrefix}-description-error`} messages={errors.description} />
      </div>

      <div>
        <label htmlFor={`${formIdPrefix}-url`} className={labelClass}>
          Project URL <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id={`${formIdPrefix}-url`}
          name="url"
          type="url"
          inputMode="url"
          defaultValue={values.url}
          placeholder="https://github.com/username/repository"
          disabled={isDisabled}
          aria-invalid={hasError("url")}
          aria-describedby={`${formIdPrefix}-url-hint ${formIdPrefix}-url-error`}
          className={`mt-1.5 ${inputClass}`}
        />
        <p id={`${formIdPrefix}-url-hint`} className="mt-1 text-xs text-slate-500">
          Must start with http:// or https:// (up to 300 characters).
        </p>
        <FieldError id={`${formIdPrefix}-url-error`} messages={errors.url} />
      </div>

      <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? mode === "edit"
              ? "Saving changes..."
              : "Adding project..."
            : mode === "edit"
              ? "Save changes"
              : "Add project"}
        </button>

        {mode === "edit" && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

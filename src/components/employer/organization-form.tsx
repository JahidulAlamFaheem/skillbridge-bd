"use client";

import { useActionState, useState } from "react";
import type { OwnOrganization } from "@/lib/employer/organization";
import {
  saveOrganizationAction,
  type OrganizationActionState,
  type OrganizationFieldName,
} from "@/lib/employer/organization-actions";

type OrganizationFormProps = {
  initialOrganization: OwnOrganization | null;
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

const EMPTY_ORGANIZATION: OwnOrganization = {
  name: "",
  description: "",
  website: null,
  location: "",
};

export function OrganizationForm({ initialOrganization }: OrganizationFormProps) {
  const startingValues = initialOrganization ?? EMPTY_ORGANIZATION;
  const initialState: OrganizationActionState = {
    status: "idle",
    organization: startingValues,
  };

  const [state, formAction, isPending] = useActionState(
    saveOrganizationAction,
    initialState,
  );

  const values = state.organization ?? startingValues;
  const errors = state.fieldErrors ?? {};
  const isEditing = Boolean(initialOrganization) || state.status === "success";

  const [nameLength, setNameLength] = useState(values.name.length);
  const [descriptionLength, setDescriptionLength] = useState(values.description.length);

  function hasError(field: OrganizationFieldName): boolean {
    return Boolean(errors[field]?.length);
  }

  return (
    <form action={formAction} noValidate className="space-y-5">
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
        <label htmlFor="organization-name" className={labelClass}>
          Organization name <span className="text-red-600">*</span>
        </label>
        <input
          id="organization-name"
          name="name"
          type="text"
          required
          defaultValue={values.name}
          onChange={(event) => setNameLength(event.target.value.length)}
          placeholder="e.g. Shapla Byte Studio"
          disabled={isPending}
          aria-invalid={hasError("name")}
          aria-describedby="organization-name-hint organization-name-error"
          className={`mt-1.5 ${inputClass}`}
        />
        <p id="organization-name-hint" className="mt-1 text-xs text-slate-500">
          {nameLength}/100 characters
        </p>
        <FieldError id="organization-name-error" messages={errors.name} />
      </div>

      <div>
        <label htmlFor="organization-description" className={labelClass}>
          Description <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="organization-description"
          name="description"
          rows={5}
          defaultValue={values.description}
          onChange={(event) => setDescriptionLength(event.target.value.length)}
          placeholder="Describe what your organization builds and the kind of work your team does."
          disabled={isPending}
          aria-invalid={hasError("description")}
          aria-describedby="organization-description-hint organization-description-error"
          className={`mt-1.5 ${inputClass}`}
        />
        <p id="organization-description-hint" className="mt-1 text-xs text-slate-500">
          {descriptionLength}/1000 characters
        </p>
        <FieldError id="organization-description-error" messages={errors.description} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="organization-location" className={labelClass}>
            Location <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="organization-location"
            name="location"
            type="text"
            defaultValue={values.location}
            placeholder="e.g. Dhaka"
            disabled={isPending}
            aria-invalid={hasError("location")}
            aria-describedby="organization-location-error"
            className={`mt-1.5 ${inputClass}`}
          />
          <FieldError id="organization-location-error" messages={errors.location} />
        </div>

        <div>
          <label htmlFor="organization-website" className={labelClass}>
            Website <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="organization-website"
            name="website"
            type="url"
            inputMode="url"
            defaultValue={values.website ?? ""}
            placeholder="https://example.com"
            disabled={isPending}
            aria-invalid={hasError("website")}
            aria-describedby="organization-website-hint organization-website-error"
            className={`mt-1.5 ${inputClass}`}
          />
          <p id="organization-website-hint" className="mt-1 text-xs text-slate-500">
            Must start with http:// or https://.
          </p>
          <FieldError id="organization-website-error" messages={errors.website} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isPending
          ? "Saving..."
          : isEditing
            ? "Save organization"
            : "Create organization"}
      </button>
    </form>
  );
}

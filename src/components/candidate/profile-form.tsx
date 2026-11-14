"use client";

import { useActionState, useState } from "react";
import {
  updateProfileAction,
  type ProfileActionState,
  type ProfileFieldName,
} from "@/lib/candidate/actions";
import type { OwnCandidateProfile } from "@/lib/candidate/profile";
import { MAX_PROFILE_LINKS } from "@/lib/validation/candidate";

type ProfileFormProps = {
  initialProfile: OwnCandidateProfile;
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

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const initialState: ProfileActionState = { status: "idle", profile: initialProfile };
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);

  const values = state.profile ?? initialProfile;
  const errors = state.fieldErrors ?? {};
  const [headlineLength, setHeadlineLength] = useState(values.headline.length);
  const [bioLength, setBioLength] = useState(values.bio.length);

  const linkSlots = Array.from({ length: MAX_PROFILE_LINKS }, (_, index) => values.links[index] ?? "");

  function hasError(field: ProfileFieldName): boolean {
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
        <label htmlFor="profile-headline" className={labelClass}>
          Headline
        </label>
        <input
          id="profile-headline"
          name="headline"
          type="text"
          maxLength={200}
          defaultValue={values.headline}
          onChange={(event) => setHeadlineLength(event.target.value.length)}
          placeholder="e.g. Aspiring frontend developer"
          disabled={isPending}
          aria-invalid={hasError("headline")}
          aria-describedby="profile-headline-hint profile-headline-error"
          className={`mt-1.5 ${inputClass}`}
        />
        <p id="profile-headline-hint" className="mt-1 text-xs text-slate-500">
          {headlineLength}/120 characters
        </p>
        <FieldError id="profile-headline-error" messages={errors.headline} />
      </div>

      <div>
        <label htmlFor="profile-bio" className={labelClass}>
          Bio
        </label>
        <textarea
          id="profile-bio"
          name="bio"
          rows={5}
          defaultValue={values.bio}
          onChange={(event) => setBioLength(event.target.value.length)}
          placeholder="A short introduction about your background and what you are looking for."
          disabled={isPending}
          aria-invalid={hasError("bio")}
          aria-describedby="profile-bio-hint profile-bio-error"
          className={`mt-1.5 ${inputClass}`}
        />
        <p id="profile-bio-hint" className="mt-1 text-xs text-slate-500">
          {bioLength}/1000 characters
        </p>
        <FieldError id="profile-bio-error" messages={errors.bio} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-location" className={labelClass}>
            Location
          </label>
          <input
            id="profile-location"
            name="location"
            type="text"
            defaultValue={values.location}
            placeholder="e.g. Dhaka"
            disabled={isPending}
            aria-invalid={hasError("location")}
            aria-describedby="profile-location-error"
            className={`mt-1.5 ${inputClass}`}
          />
          <FieldError id="profile-location-error" messages={errors.location} />
        </div>

        <div>
          <label htmlFor="profile-phone" className={labelClass}>
            Phone <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="profile-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values.phone ?? ""}
            placeholder="e.g. +880 1712 000000"
            disabled={isPending}
            aria-invalid={hasError("phone")}
            aria-describedby="profile-phone-error"
            className={`mt-1.5 ${inputClass}`}
          />
          <FieldError id="profile-phone-error" messages={errors.phone} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Links</legend>
        <p id="profile-links-hint" className="mt-1 text-xs text-slate-500">
          Up to {MAX_PROFILE_LINKS} links, such as a portfolio or code repository. Must start with
          http:// or https://.
        </p>
        <div className="mt-2 space-y-2">
          {linkSlots.map((link, index) => (
            <div key={index}>
              <label htmlFor={`profile-link-${index}`} className="sr-only">
                Link {index + 1}
              </label>
              <input
                id={`profile-link-${index}`}
                name="links"
                type="url"
                inputMode="url"
                defaultValue={link}
                placeholder="https://example.com"
                disabled={isPending}
                aria-invalid={hasError("links")}
                aria-describedby="profile-links-hint profile-links-error"
                className={inputClass}
              />
            </div>
          ))}
        </div>
        <FieldError id="profile-links-error" messages={errors.links} />
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

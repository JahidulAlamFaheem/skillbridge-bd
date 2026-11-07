"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterActionState } from "@/app/(auth)/register/actions";

const initialState: RegisterActionState = {
  status: "idle",
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} noValidate className="space-y-4">
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
          <p className="font-medium">{state.message}</p>
          <p className="mt-1">
            <Link
              href="/login?registered=1"
              className="font-semibold text-emerald-900 underline hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              Continue to sign in
            </Link>
          </p>
        </div>
      )}

      {/* Role Selector styled as interactive radio cards matching 03-register.png */}
      <fieldset>
        <legend className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Select Your Portal Mode
        </legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm transition-all hover:border-brand-blue/60 has-checked:border-brand-blue has-checked:bg-blue-50/40 has-checked:ring-1 has-checked:ring-brand-blue">
            <input
              type="radio"
              name="role"
              value="CANDIDATE"
              defaultChecked={(state.values?.role ?? "CANDIDATE") === "CANDIDATE"}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                Job Seeker
                <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
                  CANDIDATE
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 leading-normal">
                Build evidence profile, link projects, and apply.
              </span>
            </span>
          </label>

          <label className="relative flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm transition-all hover:border-brand-blue/60 has-checked:border-brand-blue has-checked:bg-blue-50/40 has-checked:ring-1 has-checked:ring-brand-blue">
            <input
              type="radio"
              name="role"
              value="EMPLOYER"
              defaultChecked={state.values?.role === "EMPLOYER"}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 border-slate-300 text-brand-blue focus:ring-brand-blue"
            />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                Tech Employer
                <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-semibold text-brand-blue">
                  HIRING TEAM
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-slate-500 leading-normal">
                Post jobs, set required skills, and review applicants.
              </span>
            </span>
          </label>
        </div>
        {state.fieldErrors?.role?.[0] && (
          <p className="mt-1 text-xs text-red-700">{state.fieldErrors.role[0]}</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="register-name" className="block text-sm font-semibold text-slate-900">
          Full Name
        </label>
        <div className="relative mt-1.5">
          <input
            id="register-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Tanvir Hossain"
            defaultValue={state.values?.name ?? ""}
            disabled={isPending}
            aria-invalid={Boolean(state.fieldErrors?.name)}
            aria-describedby={state.fieldErrors?.name ? "register-name-error" : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
          />
        </div>
        {state.fieldErrors?.name?.[0] && (
          <p id="register-name-error" className="mt-1 text-xs text-red-700">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-semibold text-slate-900">
          Email Address
        </label>
        <div className="relative mt-1.5">
          <input
            id="register-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. tanvir@example.com"
            defaultValue={state.values?.email ?? ""}
            disabled={isPending}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "register-email-error" : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
          />
        </div>
        {state.fieldErrors?.email?.[0] && (
          <p id="register-email-error" className="mt-1 text-xs text-red-700">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-semibold text-slate-900">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="register-password"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            placeholder="Create a password (min. 8 characters)"
            disabled={isPending}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby="register-password-hint"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
          />
        </div>
        <p id="register-password-hint" className="mt-1 text-xs text-slate-500">
          At least 8 characters.
        </p>
        {state.fieldErrors?.password?.[0] && (
          <p className="mt-1 text-xs text-red-700">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create Account & Get Started"}
        {!isPending && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  );
}

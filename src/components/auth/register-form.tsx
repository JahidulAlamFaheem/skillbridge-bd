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
    <form action={formAction} noValidate className="space-y-5">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}

      {state.status === "success" && state.message && (
        <div
          role="status"
          className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
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

      <div>
        <label htmlFor="register-name" className="block text-sm font-medium text-slate-900">
          Full name
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          defaultValue={state.values?.name ?? ""}
          disabled={isPending}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? "register-name-error" : undefined}
          className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-100"
        />
        {state.fieldErrors?.name?.[0] && (
          <p id="register-name-error" className="mt-1 text-xs text-red-700">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-slate-900">
          Email address
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email ?? ""}
          disabled={isPending}
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby={state.fieldErrors?.email ? "register-email-error" : undefined}
          className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-100"
        />
        {state.fieldErrors?.email?.[0] && (
          <p id="register-email-error" className="mt-1 text-xs text-red-700">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-slate-900">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          disabled={isPending}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby="register-password-hint"
          className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:bg-slate-100"
        />
        <p id="register-password-hint" className="mt-1 text-xs text-slate-600">
          At least 8 characters.
        </p>
        {state.fieldErrors?.password?.[0] && (
          <p className="mt-1 text-xs text-red-700">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-slate-900">I am registering as</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 bg-white p-3.5 text-sm hover:border-slate-500 focus-within:ring-2 focus-within:ring-slate-900">
            <input
              type="radio"
              name="role"
              value="CANDIDATE"
              defaultChecked={(state.values?.role ?? "CANDIDATE") === "CANDIDATE"}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              <span className="block font-medium text-slate-900">Candidate</span>
              <span className="mt-0.5 block text-xs text-slate-600">
                Build a skill profile with project evidence and apply to jobs.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-300 bg-white p-3.5 text-sm hover:border-slate-500 focus-within:ring-2 focus-within:ring-slate-900">
            <input
              type="radio"
              name="role"
              value="EMPLOYER"
              defaultChecked={state.values?.role === "EMPLOYER"}
              disabled={isPending}
              className="mt-0.5 h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              <span className="block font-medium text-slate-900">Employer</span>
              <span className="mt-0.5 block text-xs text-slate-600">
                Create an organization profile, publish jobs, and review applicants.
              </span>
            </span>
          </label>
        </div>
        {state.fieldErrors?.role?.[0] && (
          <p className="mt-1 text-xs text-red-700">{state.fieldErrors.role[0]}</p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}


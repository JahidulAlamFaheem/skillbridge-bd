"use client";

import { useState, type FormEvent } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSafeCallbackUrl } from "@/lib/auth/redirects";
import { ROLE_HOME, isRole } from "@/lib/auth/roles";

type LoginFormProps = {
  callbackUrl?: string | null;
  registered?: boolean;
};

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export function LoginForm({ callbackUrl, registered = false }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setStatus("error");
      setErrorMessage(GENERIC_LOGIN_ERROR);
      return;
    }

    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    if (!result || result.error || !result.ok) {
      setStatus("error");
      setErrorMessage(GENERIC_LOGIN_ERROR);
      return;
    }

    setStatus("success");

    const safeCallback = getSafeCallbackUrl(callbackUrl);
    if (safeCallback) {
      router.push(safeCallback);
      router.refresh();
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    const destination = isRole(role) ? ROLE_HOME[role] : "/";

    router.push(destination);
    router.refresh();
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {registered && status === "idle" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Account created! Sign in with your email and password below.
        </div>
      )}

      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
        >
          Signed in! Redirecting to your dashboard...
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-slate-900">
          Email address
        </label>
        <div className="relative mt-1.5">
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || status === "success"}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold text-slate-900">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="login-password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your account password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || status === "success"}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:bg-slate-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || status === "success"}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign In to SkillBridge BD"}
        {!isLoading && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        )}
      </button>
    </form>
  );
}

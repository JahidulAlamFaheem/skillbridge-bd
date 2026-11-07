import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeCallbackUrl } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Sign In — SkillBridge BD",
};

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    registered?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const rawCallback = Array.isArray(params.callbackUrl)
    ? params.callbackUrl[0]
    : params.callbackUrl;
  const safeCallbackUrl = getSafeCallbackUrl(rawCallback);
  const registered = params.registered === "1";

  return (
    <main className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            SkillBridge BD
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            New to SkillBridge BD?{" "}
            <Link
              href="/register"
              className="font-semibold text-slate-900 underline hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
          <LoginForm callbackUrl={safeCallbackUrl} registered={registered} />
        </div>
      </div>
    </main>
  );
}


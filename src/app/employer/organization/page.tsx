import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Employer Organization — SkillBridge BD",
};

export default async function EmployerOrganizationPage() {
  const user = await requireRole("EMPLOYER");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome, {user.name ?? user.email} ({user.role})
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Employer organization placeholder page protected by server-side role verification.
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}


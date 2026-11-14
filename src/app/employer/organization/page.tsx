import type { Metadata } from "next";
import { Suspense } from "react";
import { OrganizationForm } from "@/components/employer/organization-form";
import { OrganizationSummary } from "@/components/employer/organization-summary";
import { requireRole } from "@/lib/auth/session";
import { getOwnOrganization } from "@/lib/employer/organization";

export const metadata: Metadata = {
  title: "My Organization — SkillBridge BD",
};

async function OrganizationContent() {
  const user = await requireRole("EMPLOYER");
  const organization = await getOwnOrganization(user.id);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      <OrganizationSummary organization={organization} />

      <section
        aria-labelledby="organization-form-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <h2 id="organization-form-heading" className="text-lg font-bold text-slate-900">
          {organization ? "Edit organization details" : "Create your organization"}
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-600">
          Organization name is required. Description, location, and website are optional.
        </p>
        <OrganizationForm initialOrganization={organization} />
      </section>
    </div>
  );
}

function OrganizationFallback() {
  return (
    <div
      role="status"
      aria-label="Loading organization"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading organization...
    </div>
  );
}

export default function EmployerOrganizationPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My organization
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage the organization profile shown on your job listings.
        </p>
      </header>

      <Suspense fallback={<OrganizationFallback />}>
        <OrganizationContent />
      </Suspense>
    </main>
  );
}

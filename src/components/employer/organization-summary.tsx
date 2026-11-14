import type { OwnOrganization } from "@/lib/employer/organization";

type OrganizationSummaryProps = {
  organization: OwnOrganization | null;
};

function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export function OrganizationSummary({ organization }: OrganizationSummaryProps) {
  if (!organization) {
    return (
      <section
        aria-labelledby="organization-summary-heading"
        className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-xs sm:p-8"
      >
        <div
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-lg font-bold text-brand-blue"
        >
          ORG
        </div>
        <h2
          id="organization-summary-heading"
          className="mt-4 text-lg font-bold text-slate-900"
        >
          No organization profile yet
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
          Complete the form to create your organization profile before posting jobs.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="organization-summary-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-lg font-bold text-brand-blue"
        >
          {initialsOf(organization.name)}
        </div>
        <div className="min-w-0">
          <h2
            id="organization-summary-heading"
            className="break-words text-xl font-bold text-slate-900"
          >
            {organization.name}
          </h2>
          {organization.location && (
            <p className="mt-0.5 break-words text-sm font-medium text-slate-600">
              {organization.location}
            </p>
          )}
        </div>
      </div>

      {organization.description && (
        <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-700">
          {organization.description}
        </p>
      )}

      {organization.website && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Website
          </h3>
          <div className="mt-2">
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block max-w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {organization.website}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

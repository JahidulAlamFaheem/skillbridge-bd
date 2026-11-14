import { isProfileEmpty, type OwnCandidateProfile } from "@/lib/candidate/profile";

type ProfileSummaryProps = {
  name: string;
  profile: OwnCandidateProfile;
};

function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export function ProfileSummary({ name, profile }: ProfileSummaryProps) {
  if (isProfileEmpty(profile)) {
    return (
      <section
        aria-labelledby="profile-summary-heading"
        className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-xs sm:p-8"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-lg font-bold text-brand-blue">
          {initialsOf(name)}
        </div>
        <h2 id="profile-summary-heading" className="mt-4 text-lg font-bold text-slate-900">
          Your profile is empty
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
          Add a headline and a short bio in the form to introduce yourself to employers.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="profile-summary-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue-light text-lg font-bold text-brand-blue"
        >
          {initialsOf(name)}
        </div>
        <div className="min-w-0">
          <h2 id="profile-summary-heading" className="text-xl font-bold text-slate-900">
            {name}
          </h2>
          {profile.headline && (
            <p className="mt-0.5 break-words text-sm font-semibold text-brand-blue">
              {profile.headline}
            </p>
          )}
        </div>
      </div>

      {(profile.location || profile.phone) && (
        <dl className="mt-4 flex flex-col gap-1 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {profile.location && (
            <div className="flex gap-1.5">
              <dt className="font-medium text-slate-700">Location:</dt>
              <dd className="break-words">{profile.location}</dd>
            </div>
          )}
          {profile.phone && (
            <div className="flex gap-1.5">
              <dt className="font-medium text-slate-700">Phone:</dt>
              <dd className="break-words">{profile.phone}</dd>
            </div>
          )}
        </dl>
      )}

      {profile.bio && (
        <p className="mt-4 whitespace-pre-line break-words text-sm leading-6 text-slate-700">
          {profile.bio}
        </p>
      )}

      {profile.links.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Links</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {profile.links.map((link) => (
              <li key={link} className="min-w-0 max-w-full">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

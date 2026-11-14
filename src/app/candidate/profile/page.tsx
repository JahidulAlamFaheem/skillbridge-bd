import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfileForm } from "@/components/candidate/profile-form";
import { ProfileSummary } from "@/components/candidate/profile-summary";
import { requireRole } from "@/lib/auth/session";
import { getOwnProfile } from "@/lib/candidate/profile";

export const metadata: Metadata = {
  title: "My Profile — SkillBridge BD",
};

async function ProfileContent() {
  const user = await requireRole("CANDIDATE");
  const profile = await getOwnProfile(user.id);
  const displayName = user.name ?? user.email ?? "Candidate";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      <ProfileSummary name={displayName} profile={profile} />

      <section
        aria-labelledby="profile-form-heading"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <h2 id="profile-form-heading" className="text-lg font-bold text-slate-900">
          Edit profile details
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-600">
          All fields are optional.
        </p>
        <ProfileForm initialProfile={profile} />
      </section>
    </div>
  );
}

function ProfileFallback() {
  return (
    <div
      role="status"
      aria-label="Loading profile"
      className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-xs"
    >
      Loading profile...
    </div>
  );
}

export default function CandidateProfilePage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">My profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Keep your details up to date. Skills and projects will be added in a later step.
        </p>
      </header>

      <Suspense fallback={<ProfileFallback />}>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

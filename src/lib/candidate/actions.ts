"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import { saveOwnProfile, type OwnCandidateProfile } from "@/lib/candidate/profile";
import { MAX_PROFILE_LINKS, candidateProfileSchema } from "@/lib/validation/candidate";

export type ProfileFieldName = "headline" | "bio" | "location" | "phone" | "links";

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProfileFieldName, string[]>>;
  profile?: OwnCandidateProfile;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readLinks(formData: FormData): string[] {
  return formData
    .getAll("links")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value !== "");
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  // Identity comes only from the session. Any id/userId in the form is ignored.
  const user = await requireRole("CANDIDATE");

  const rawLinks = readLinks(formData);
  const submitted = {
    headline: readText(formData, "headline"),
    bio: readText(formData, "bio"),
    location: readText(formData, "location"),
    phone: readText(formData, "phone"),
    links: rawLinks,
  };

  const echo: OwnCandidateProfile = {
    headline: submitted.headline,
    bio: submitted.bio,
    location: submitted.location,
    phone: submitted.phone,
    links: rawLinks.slice(0, MAX_PROFILE_LINKS + 1),
  };

  const parsed = candidateProfileSchema.safeParse(submitted);
  if (!parsed.success) {
    const fieldErrors: ProfileActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "headline" ||
        field === "bio" ||
        field === "location" ||
        field === "phone" ||
        field === "links"
      ) {
        fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      profile: echo,
    };
  }

  const { headline, bio, location, phone, links } = parsed.data;
  const uniqueLinks = Array.from(new Set(links));

  const saved = await saveOwnProfile(user.id, {
    headline,
    bio,
    location,
    phone: phone === "" ? null : phone,
    links: uniqueLinks,
  });

  revalidatePath("/candidate/profile");

  return {
    status: "success",
    message: "Profile saved.",
    profile: saved,
  };
}

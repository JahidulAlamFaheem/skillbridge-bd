import { prisma } from "@/lib/db";

export type OwnCandidateProfile = {
  headline: string;
  bio: string;
  location: string;
  phone: string | null;
  links: string[];
};

const PROFILE_SELECT = {
  headline: true,
  bio: true,
  location: true,
  phone: true,
  links: true,
} as const;

export async function getOwnProfile(userId: string): Promise<OwnCandidateProfile> {
  return prisma.candidateProfile.upsert({
    where: { userId },
    update: {},
    create: { userId, headline: "", bio: "", location: "", links: [] },
    select: PROFILE_SELECT,
  });
}

export async function saveOwnProfile(
  userId: string,
  data: OwnCandidateProfile,
): Promise<OwnCandidateProfile> {
  return prisma.candidateProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
    select: PROFILE_SELECT,
  });
}

export function isProfileEmpty(profile: OwnCandidateProfile): boolean {
  return (
    profile.headline === "" &&
    profile.bio === "" &&
    profile.location === "" &&
    !profile.phone &&
    profile.links.length === 0
  );
}

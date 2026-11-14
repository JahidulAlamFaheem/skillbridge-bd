import type { ProjectKind } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { MAX_CANDIDATE_PROJECTS } from "@/lib/validation/project";

export type OwnCandidateProject = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  kind: ProjectKind;
};

const PROJECT_SELECT = {
  id: true,
  title: true,
  description: true,
  url: true,
  kind: true,
} as const;

export async function getOrCreateCandidateProfileId(userId: string): Promise<string> {
  const profile = await prisma.candidateProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      headline: "",
      bio: "",
      location: "",
      links: [],
    },
    select: { id: true },
  });
  return profile.id;
}

export async function listOwnProjects(userId: string): Promise<OwnCandidateProject[]> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);
  return prisma.project.findMany({
    where: { candidateProfileId },
    select: PROJECT_SELECT,
    orderBy: { id: "desc" },
  });
}

export type CreateOwnProjectResult =
  | { ok: true; project: OwnCandidateProject }
  | { ok: false; reason: "limit_reached" };

export async function createOwnProject(
  userId: string,
  data: {
    title: string;
    description: string;
    url: string | null;
    kind: ProjectKind;
  },
): Promise<CreateOwnProjectResult> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  return prisma.$transaction(async (tx) => {
    const existingCount = await tx.project.count({
      where: { candidateProfileId },
    });

    if (existingCount >= MAX_CANDIDATE_PROJECTS) {
      return { ok: false, reason: "limit_reached" };
    }

    const project = await tx.project.create({
      data: {
        candidateProfileId,
        title: data.title,
        description: data.description,
        url: data.url,
        kind: data.kind,
      },
      select: PROJECT_SELECT,
    });

    return { ok: true, project };
  });
}

export async function updateOwnProject(
  userId: string,
  projectId: string,
  data: {
    title: string;
    description: string;
    url: string | null;
    kind: ProjectKind;
  },
): Promise<{ updated: boolean }> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  const result = await prisma.project.updateMany({
    where: {
      id: projectId,
      candidateProfileId,
    },
    data: {
      title: data.title,
      description: data.description,
      url: data.url,
      kind: data.kind,
    },
  });

  return { updated: result.count > 0 };
}

export async function deleteOwnProject(
  userId: string,
  projectId: string,
): Promise<{ deleted: boolean }> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  const result = await prisma.project.deleteMany({
    where: {
      id: projectId,
      candidateProfileId,
    },
  });

  return { deleted: result.count > 0 };
}

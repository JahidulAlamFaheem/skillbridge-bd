import { Prisma } from "@/generated/prisma/client";
import { getOrCreateCandidateProfileId } from "@/lib/candidate/projects";
import { prisma } from "@/lib/db";
import type { CanonicalSkill, SkillCatalogEntry } from "@/lib/skills/normalise";
import { MAX_CANDIDATE_SKILLS } from "@/lib/validation/skill";

export type OwnCandidateSkill = {
  id: string;
  skill: CanonicalSkill;
};

const CANDIDATE_SKILL_SELECT = {
  id: true,
  skill: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const;

export async function listControlledSkills(): Promise<SkillCatalogEntry[]> {
  const rows = await prisma.skill.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      aliases: {
        select: {
          alias: true,
        },
        orderBy: {
          alias: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    aliases: row.aliases.map((a) => a.alias),
  }));
}

export async function listOwnCandidateSkills(userId: string): Promise<OwnCandidateSkill[]> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  return prisma.candidateSkill.findMany({
    where: { candidateProfileId },
    select: CANDIDATE_SKILL_SELECT,
    orderBy: {
      skill: {
        name: "asc",
      },
    },
  });
}

export type AddOwnCandidateSkillResult =
  | { ok: true; candidateSkill: OwnCandidateSkill }
  | { ok: false; reason: "duplicate" | "limit_reached" };

export async function addOwnCandidateSkill(
  userId: string,
  skillId: string,
): Promise<AddOwnCandidateSkillResult> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.candidateSkill.findUnique({
        where: {
          candidateProfileId_skillId: {
            candidateProfileId,
            skillId,
          },
        },
        select: { id: true },
      });

      if (existing) {
        return { ok: false, reason: "duplicate" };
      }

      const count = await tx.candidateSkill.count({
        where: { candidateProfileId },
      });

      if (count >= MAX_CANDIDATE_SKILLS) {
        return { ok: false, reason: "limit_reached" };
      }

      const created = await tx.candidateSkill.create({
        data: {
          candidateProfileId,
          skillId,
        },
        select: CANDIDATE_SKILL_SELECT,
      });

      return { ok: true, candidateSkill: created };
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, reason: "duplicate" };
    }
    throw err;
  }
}

export async function removeOwnCandidateSkill(
  userId: string,
  candidateSkillId: string,
): Promise<{ deleted: boolean }> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  const result = await prisma.candidateSkill.deleteMany({
    where: {
      id: candidateSkillId,
      candidateProfileId,
    },
  });

  return { deleted: result.count > 0 };
}

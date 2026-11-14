import { Prisma } from "@/generated/prisma/client";
import { getOrCreateCandidateProfileId } from "@/lib/candidate/projects";
import { prisma } from "@/lib/db";
import { MAX_EVIDENCE_PER_SKILL } from "@/lib/validation/evidence";

export type LinkSkillEvidenceResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "duplicate" | "limit_reached" };

export async function linkSkillEvidence(
  userId: string,
  candidateSkillId: string,
  projectId: string,
): Promise<LinkSkillEvidenceResult> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  try {
    return await prisma.$transaction(async (tx) => {
      const [ownedSkill, ownedProject] = await Promise.all([
        tx.candidateSkill.findFirst({
          where: {
            id: candidateSkillId,
            candidateProfileId,
          },
          select: { id: true },
        }),
        tx.project.findFirst({
          where: {
            id: projectId,
            candidateProfileId,
          },
          select: { id: true },
        }),
      ]);

      if (!ownedSkill || !ownedProject) {
        return { ok: false, reason: "not_found" };
      }

      const existing = await tx.skillEvidence.findUnique({
        where: {
          candidateSkillId_projectId: {
            candidateSkillId,
            projectId,
          },
        },
        select: { candidateSkillId: true },
      });

      if (existing) {
        return { ok: false, reason: "duplicate" };
      }

      const count = await tx.skillEvidence.count({
        where: { candidateSkillId },
      });

      if (count >= MAX_EVIDENCE_PER_SKILL) {
        return { ok: false, reason: "limit_reached" };
      }

      await tx.skillEvidence.create({
        data: {
          candidateSkillId,
          projectId,
        },
        select: { candidateSkillId: true },
      });

      return { ok: true };
    });
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, reason: "duplicate" };
    }
    throw err;
  }
}

export async function unlinkSkillEvidence(
  userId: string,
  candidateSkillId: string,
  projectId: string,
): Promise<{ deleted: boolean }> {
  const candidateProfileId = await getOrCreateCandidateProfileId(userId);

  const result = await prisma.skillEvidence.deleteMany({
    where: {
      candidateSkillId,
      projectId,
      candidateSkill: {
        candidateProfileId,
      },
    },
  });

  return { deleted: result.count > 0 };
}

"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import {
  linkSkillEvidence,
  unlinkSkillEvidence,
} from "@/lib/candidate/evidence";
import {
  MAX_EVIDENCE_PER_SKILL,
  evidenceLinkSchema,
} from "@/lib/validation/evidence";

export type EvidenceActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function linkEvidenceAction(
  _prevState: EvidenceActionState,
  formData: FormData,
): Promise<EvidenceActionState> {
  // Ownership comes strictly from the session user id; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const parsed = evidenceLinkSchema.safeParse({
    candidateSkillId: readText(formData, "candidateSkillId"),
    projectId: readText(formData, "projectId"),
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      status: "error",
      message: firstIssue?.message ?? "Please select a project.",
    };
  }

  const { candidateSkillId, projectId } = parsed.data;
  const result = await linkSkillEvidence(user.id, candidateSkillId, projectId);

  if (!result.ok) {
    if (result.reason === "not_found") {
      return {
        status: "error",
        message: "Skill or project not found.",
      };
    }

    if (result.reason === "duplicate") {
      return {
        status: "error",
        message: "This project is already linked to this skill.",
      };
    }

    return {
      status: "error",
      message: `You can link at most ${MAX_EVIDENCE_PER_SKILL} projects to a single skill.`,
    };
  }

  revalidatePath("/candidate/skills");

  return {
    status: "success",
    message: "Project linked as evidence.",
  };
}

export async function unlinkEvidenceAction(
  _prevState: EvidenceActionState,
  formData: FormData,
): Promise<EvidenceActionState> {
  // Ownership comes strictly from the session user id; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const parsed = evidenceLinkSchema.safeParse({
    candidateSkillId: readText(formData, "candidateSkillId"),
    projectId: readText(formData, "projectId"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Evidence link not found.",
    };
  }

  const { candidateSkillId, projectId } = parsed.data;
  const result = await unlinkSkillEvidence(user.id, candidateSkillId, projectId);

  if (!result.deleted) {
    return {
      status: "error",
      message: "Evidence link not found.",
    };
  }

  revalidatePath("/candidate/skills");

  return {
    status: "success",
    message: "Project unlinked.",
  };
}

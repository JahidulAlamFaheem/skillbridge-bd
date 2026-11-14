"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import {
  addOwnCandidateSkill,
  listControlledSkills,
  removeOwnCandidateSkill,
} from "@/lib/candidate/skills";
import { normalise, type CanonicalSkill } from "@/lib/skills/normalise";
import {
  MAX_CANDIDATE_SKILLS,
  addCandidateSkillSchema,
  removeCandidateSkillSchema,
} from "@/lib/validation/skill";

export type AddSkillActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  query?: string;
  nonce?: number;
};

export type RemoveSkillActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function addSkillAction(
  _prevState: AddSkillActionState,
  formData: FormData,
): Promise<AddSkillActionState> {
  // Identity comes strictly from the session; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const rawSkillId = readText(formData, "skillId");
  const rawQuery = readText(formData, "query");

  const parsed = addCandidateSkillSchema.safeParse({
    skillId: rawSkillId,
    query: rawQuery,
  });

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      status: "error",
      message: firstIssue?.message ?? "Choose a skill from the list.",
      query: rawQuery,
    };
  }

  const { skillId, query } = parsed.data;
  const catalog = await listControlledSkills();

  let resolved: CanonicalSkill | null = null;

  if (skillId !== "") {
    const foundById = catalog.find((entry) => entry.id === skillId);
    if (foundById) {
      resolved = {
        id: foundById.id,
        name: foundById.name,
        slug: foundById.slug,
      };
    }
  } else if (query !== "") {
    resolved = normalise(query, catalog);
  }

  if (!resolved) {
    return {
      status: "error",
      message: "Choose a skill from the list.",
      query: rawQuery,
    };
  }

  const result = await addOwnCandidateSkill(user.id, resolved.id);

  if (!result.ok) {
    if (result.reason === "duplicate") {
      return {
        status: "error",
        message: `${resolved.name} is already on your profile.`,
        query: rawQuery,
      };
    }

    return {
      status: "error",
      message: `You can have at most ${MAX_CANDIDATE_SKILLS} skills on your profile. Remove an existing skill before adding another.`,
      query: rawQuery,
    };
  }

  revalidatePath("/candidate/skills");

  return {
    status: "success",
    message: `Added ${resolved.name} to your skills.`,
    query: "",
    nonce: Date.now(),
  };
}

export async function removeSkillAction(
  _prevState: RemoveSkillActionState,
  formData: FormData,
): Promise<RemoveSkillActionState> {
  // Identity comes strictly from the session; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const rawCandidateSkillId = readText(formData, "candidateSkillId");
  const parsed = removeCandidateSkillSchema.safeParse({
    candidateSkillId: rawCandidateSkillId,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Skill not found.",
    };
  }

  const result = await removeOwnCandidateSkill(user.id, parsed.data.candidateSkillId);
  if (!result.deleted) {
    return {
      status: "error",
      message: "Skill not found.",
    };
  }

  revalidatePath("/candidate/skills");

  return {
    status: "success",
    message: "Skill removed.",
  };
}

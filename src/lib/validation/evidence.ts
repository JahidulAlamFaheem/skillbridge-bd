import { z } from "zod";

export const MAX_EVIDENCE_PER_SKILL = 10;

export const evidenceLinkSchema = z.object({
  candidateSkillId: z
    .string()
    .trim()
    .min(1, "Skill not found.")
    .max(100, "Skill not found."),
  projectId: z
    .string()
    .trim()
    .min(1, "Please select a project.")
    .max(100, "Project not found."),
});

export type EvidenceLinkInput = z.infer<typeof evidenceLinkSchema>;

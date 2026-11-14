import { z } from "zod";

export const MAX_CANDIDATE_SKILLS = 30;

export const addCandidateSkillSchema = z
  .object({
    skillId: z.string().trim().max(100, "Invalid skill selection.").default(""),
    query: z.string().trim().max(100, "Skill search must be at most 100 characters.").default(""),
  })
  .refine((data) => data.skillId !== "" || data.query !== "", {
    message: "Choose a skill from the list.",
    path: ["query"],
  });

export type AddCandidateSkillInput = z.infer<typeof addCandidateSkillSchema>;

export const removeCandidateSkillSchema = z.object({
  candidateSkillId: z.string().trim().min(1, "Skill not found.").max(100, "Skill not found."),
});

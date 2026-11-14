import { z } from "zod";

export const MAX_CANDIDATE_PROJECTS = 20;
export const PROJECT_KINDS = ["PROJECT", "PORTFOLIO"] as const;
export type ProjectKindValue = (typeof PROJECT_KINDS)[number];

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Description is required.")
    .max(1000, "Description must be at most 1000 characters."),
  url: z
    .string()
    .trim()
    .max(300, "URL must be at most 300 characters.")
    .refine(
      (value) => value === "" || isHttpUrl(value),
      "URL must be a valid link starting with http:// or https://.",
    )
    .default(""),
  kind: z.enum(PROJECT_KINDS, {
    error: "Please choose Project or Portfolio.",
  }),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const projectIdSchema = z.string().trim().min(1, "Project ID is required.");

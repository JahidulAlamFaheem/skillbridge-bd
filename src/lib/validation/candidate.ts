import { z } from "zod";

export const MAX_PROFILE_LINKS = 5;

const PHONE_PATTERN = /^[0-9+\-()\s]+$/;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const linkSchema = z
  .string()
  .trim()
  .max(300, "Each link must be at most 300 characters.")
  .refine(isHttpUrl, "Links must be valid URLs starting with http:// or https://.");

export const candidateProfileSchema = z.object({
  headline: z.string().trim().max(120, "Headline must be at most 120 characters.").default(""),
  bio: z.string().trim().max(1000, "Bio must be at most 1000 characters.").default(""),
  location: z.string().trim().max(100, "Location must be at most 100 characters.").default(""),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be at most 20 characters.")
    .refine(
      (value) => value === "" || PHONE_PATTERN.test(value),
      "Phone can only contain digits, spaces, +, -, and parentheses.",
    )
    .default(""),
  links: z
    .array(linkSchema)
    .max(MAX_PROFILE_LINKS, `You can add at most ${MAX_PROFILE_LINKS} links.`)
    .default([]),
});

export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;

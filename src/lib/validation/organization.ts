import { z } from "zod";

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name is required.")
    .max(100, "Organization name must be at most 100 characters."),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters.")
    .default(""),
  website: z
    .string()
    .trim()
    .max(300, "Website URL must be at most 300 characters.")
    .refine(
      (value) => value === "" || isHttpUrl(value),
      "Website must be a valid URL starting with http:// or https://.",
    )
    .default(""),
  location: z
    .string()
    .trim()
    .max(100, "Location must be at most 100 characters.")
    .default(""),
});

export type OrganizationInput = z.infer<typeof organizationSchema>;

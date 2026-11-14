import { z } from "zod";

export const MAX_JOBS_PER_ORGANIZATION = 50;
export const MIN_JOB_SKILLS = 1;
export const MAX_JOB_SKILLS = 15;

export const EXPERIENCE_LEVELS = ["INTERN", "ENTRY", "JUNIOR", "MID", "SENIOR"] as const;
export type ExperienceLevelValue = (typeof EXPERIENCE_LEVELS)[number];

export const JOB_TYPES = ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"] as const;
export type JobTypeValue = (typeof JOB_TYPES)[number];

export const WORK_ARRANGEMENTS = ["ONSITE", "REMOTE", "HYBRID"] as const;
export type WorkArrangementValue = (typeof WORK_ARRANGEMENTS)[number];

export const JOB_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED", "REMOVED"] as const;
export type JobStatusValue = (typeof JOB_STATUSES)[number];

export const SUBMIT_INTENTS = ["DRAFT", "PUBLISH"] as const;
export type SubmitIntentValue = (typeof SUBMIT_INTENTS)[number];

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateOnlyUtc(value: string): Date | null {
  const match = DATE_ONLY_REGEX.exec(value.trim());
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

/**
 * Compares dates only (year, month, day), ignoring time-of-day.
 */
export function isDateInPast(date: Date, now: Date = new Date()): boolean {
  const targetDay = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  const todayDay = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  return targetDay < todayDay;
}

export function formatDateForInput(date: Date | null): string {
  if (!date) {
    return "";
  }
  return date.toISOString().slice(0, 10);
}

export const jobFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Job title is required.")
    .max(120, "Job title must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Job description is required.")
    .max(5000, "Job description must be at most 5000 characters."),
  location: z
    .string()
    .trim()
    .min(1, "Location is required.")
    .max(100, "Location must be at most 100 characters."),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    error: "Please select a valid experience level.",
  }),
  jobType: z.enum(JOB_TYPES, {
    error: "Please select a valid job type.",
  }),
  workArrangement: z.enum(WORK_ARRANGEMENTS, {
    error: "Please select a valid work arrangement.",
  }),
  deadline: z
    .string()
    .trim()
    .default("")
    .refine((value) => {
      if (value === "") {
        return true;
      }
      return parseDateOnlyUtc(value) !== null;
    }, "Please enter a valid deadline date (YYYY-MM-DD).")
    .refine((value) => {
      if (value === "") {
        return true;
      }
      const parsed = parseDateOnlyUtc(value);
      return parsed !== null && !isDateInPast(parsed);
    }, "Deadline cannot be in the past."),
  skillIds: z
    .array(z.string().trim().min(1))
    .transform((ids) => Array.from(new Set(ids)))
    .refine(
      (ids) => ids.length >= MIN_JOB_SKILLS,
      "Please select at least 1 required skill.",
    )
    .refine(
      (ids) => ids.length <= MAX_JOB_SKILLS,
      `You can select at most ${MAX_JOB_SKILLS} required skills.`,
    ),
  intent: z.enum(SUBMIT_INTENTS, {
    error: "Invalid form action.",
  }),
});

export type JobFormInput = z.infer<typeof jobFormSchema>;

export const jobIdSchema = z
  .string()
  .trim()
  .min(1, "Job not found.")
  .max(100, "Job not found.");

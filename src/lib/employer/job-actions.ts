"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import {
  closeOwnJob,
  createOwnJob,
  publishOwnJob,
  updateOwnJob,
} from "@/lib/employer/jobs";
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  MAX_JOBS_PER_ORGANIZATION,
  WORK_ARRANGEMENTS,
  jobFormSchema,
  jobIdSchema,
  parseDateOnlyUtc,
  type ExperienceLevelValue,
  type JobTypeValue,
  type WorkArrangementValue,
} from "@/lib/validation/job";

export type JobFieldName =
  | "title"
  | "description"
  | "location"
  | "experienceLevel"
  | "jobType"
  | "workArrangement"
  | "deadline"
  | "skillIds";

export type JobFormValues = {
  title: string;
  description: string;
  location: string;
  experienceLevel: ExperienceLevelValue;
  jobType: JobTypeValue;
  workArrangement: WorkArrangementValue;
  deadline: string;
  skillIds: string[];
};

export type JobFormActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<JobFieldName, string[]>>;
  values?: JobFormValues;
};

export type JobStatusActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readSkillIds(formData: FormData): string[] {
  return formData
    .getAll("skillIds")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => value !== "");
}

function coerceEnumValue<T extends readonly string[]>(
  raw: string,
  allowed: T,
  fallback: T[number],
): T[number] {
  return (allowed as readonly string[]).includes(raw) ? (raw as T[number]) : fallback;
}

function collectFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Partial<Record<JobFieldName, string[]>> {
  const fieldErrors: Partial<Record<JobFieldName, string[]>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (
      field === "title" ||
      field === "description" ||
      field === "location" ||
      field === "experienceLevel" ||
      field === "jobType" ||
      field === "workArrangement" ||
      field === "deadline" ||
      field === "skillIds"
    ) {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
  }
  return fieldErrors;
}

export async function createJobAction(
  _prevState: JobFormActionState,
  formData: FormData,
): Promise<JobFormActionState> {
  // Identity and organization ownership come strictly from the session user ID.
  const user = await requireRole("EMPLOYER");

  const rawTitle = readText(formData, "title");
  const rawDescription = readText(formData, "description");
  const rawLocation = readText(formData, "location");
  const rawExperienceLevel = readText(formData, "experienceLevel");
  const rawJobType = readText(formData, "jobType");
  const rawWorkArrangement = readText(formData, "workArrangement");
  const rawDeadline = readText(formData, "deadline");
  const rawSkillIds = readSkillIds(formData);
  const rawIntent = readText(formData, "intent") || "DRAFT";

  const echoValues: JobFormValues = {
    title: rawTitle,
    description: rawDescription,
    location: rawLocation,
    experienceLevel: coerceEnumValue(rawExperienceLevel, EXPERIENCE_LEVELS, "ENTRY"),
    jobType: coerceEnumValue(rawJobType, JOB_TYPES, "FULL_TIME"),
    workArrangement: coerceEnumValue(rawWorkArrangement, WORK_ARRANGEMENTS, "ONSITE"),
    deadline: rawDeadline,
    skillIds: Array.from(new Set(rawSkillIds)),
  };

  const parsed = jobFormSchema.safeParse({
    title: rawTitle,
    description: rawDescription,
    location: rawLocation,
    experienceLevel: rawExperienceLevel,
    jobType: rawJobType,
    workArrangement: rawWorkArrangement,
    deadline: rawDeadline,
    skillIds: rawSkillIds,
    intent: rawIntent,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
      values: echoValues,
    };
  }

  const data = parsed.data;
  const deadlineDate =
    data.deadline === "" ? null : parseDateOnlyUtc(data.deadline);

  const result = await createOwnJob(user.id, {
    title: data.title,
    description: data.description,
    location: data.location,
    experienceLevel: data.experienceLevel,
    jobType: data.jobType,
    workArrangement: data.workArrangement,
    deadline: deadlineDate,
    skillIds: data.skillIds,
    intent: data.intent,
  });

  if (!result.ok) {
    if (result.reason === "no_organization") {
      redirect("/employer/organization?notice=create-first");
    }

    if (result.reason === "limit_reached") {
      return {
        status: "error",
        message: `Your organization has reached the maximum of ${MAX_JOBS_PER_ORGANIZATION} jobs.`,
        values: echoValues,
      };
    }

    return {
      status: "error",
      message: "One or more selected skills are not in the controlled skill list.",
      fieldErrors: {
        skillIds: ["Choose skills from the controlled list only."],
      },
      values: echoValues,
    };
  }

  revalidatePath("/employer/jobs");
  redirect(
    result.status === "PUBLISHED"
      ? "/employer/jobs?saved=published"
      : "/employer/jobs?saved=draft",
  );
}

export async function updateJobAction(
  _prevState: JobFormActionState,
  formData: FormData,
): Promise<JobFormActionState> {
  // Identity and organization ownership come strictly from the session user ID.
  const user = await requireRole("EMPLOYER");

  const rawJobId = readText(formData, "jobId");
  const rawTitle = readText(formData, "title");
  const rawDescription = readText(formData, "description");
  const rawLocation = readText(formData, "location");
  const rawExperienceLevel = readText(formData, "experienceLevel");
  const rawJobType = readText(formData, "jobType");
  const rawWorkArrangement = readText(formData, "workArrangement");
  const rawDeadline = readText(formData, "deadline");
  const rawSkillIds = readSkillIds(formData);
  const rawIntent = readText(formData, "intent") || "DRAFT";

  const echoValues: JobFormValues = {
    title: rawTitle,
    description: rawDescription,
    location: rawLocation,
    experienceLevel: coerceEnumValue(rawExperienceLevel, EXPERIENCE_LEVELS, "ENTRY"),
    jobType: coerceEnumValue(rawJobType, JOB_TYPES, "FULL_TIME"),
    workArrangement: coerceEnumValue(rawWorkArrangement, WORK_ARRANGEMENTS, "ONSITE"),
    deadline: rawDeadline,
    skillIds: Array.from(new Set(rawSkillIds)),
  };

  const parsedId = jobIdSchema.safeParse(rawJobId);
  if (!parsedId.success) {
    return {
      status: "error",
      message: "Job not found.",
      values: echoValues,
    };
  }

  const parsed = jobFormSchema.safeParse({
    title: rawTitle,
    description: rawDescription,
    location: rawLocation,
    experienceLevel: rawExperienceLevel,
    jobType: rawJobType,
    workArrangement: rawWorkArrangement,
    deadline: rawDeadline,
    skillIds: rawSkillIds,
    intent: rawIntent,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
      values: echoValues,
    };
  }

  const data = parsed.data;
  const deadlineDate =
    data.deadline === "" ? null : parseDateOnlyUtc(data.deadline);

  const result = await updateOwnJob(user.id, parsedId.data, {
    title: data.title,
    description: data.description,
    location: data.location,
    experienceLevel: data.experienceLevel,
    jobType: data.jobType,
    workArrangement: data.workArrangement,
    deadline: deadlineDate,
    skillIds: data.skillIds,
    intent: data.intent,
  });

  if (!result.ok) {
    if (result.reason === "no_organization") {
      redirect("/employer/organization?notice=create-first");
    }

    if (result.reason === "not_found") {
      return {
        status: "error",
        message: "Job not found.",
        values: echoValues,
      };
    }

    if (result.reason === "locked_removed") {
      return {
        status: "error",
        message: "This job has been removed and is locked from editing.",
        values: echoValues,
      };
    }

    return {
      status: "error",
      message: "One or more selected skills are not in the controlled skill list.",
      fieldErrors: {
        skillIds: ["Choose skills from the controlled list only."],
      },
      values: echoValues,
    };
  }

  revalidatePath("/employer/jobs");
  revalidatePath(`/employer/jobs/${parsedId.data}/edit`);

  return {
    status: "success",
    message:
      result.status === "PUBLISHED"
        ? "Job saved and published."
        : "Job saved as draft.",
    values: {
      title: data.title,
      description: data.description,
      location: data.location,
      experienceLevel: data.experienceLevel,
      jobType: data.jobType,
      workArrangement: data.workArrangement,
      deadline: data.deadline,
      skillIds: data.skillIds,
    },
  };
}

export async function publishJobAction(
  _prevState: JobStatusActionState,
  formData: FormData,
): Promise<JobStatusActionState> {
  // Identity and organization ownership come strictly from the session user ID.
  const user = await requireRole("EMPLOYER");

  const parsedId = jobIdSchema.safeParse(readText(formData, "jobId"));
  if (!parsedId.success) {
    return {
      status: "error",
      message: "Job not found.",
    };
  }

  const result = await publishOwnJob(user.id, parsedId.data);
  if (!result.ok) {
    if (result.reason === "not_found") {
      return { status: "error", message: "Job not found." };
    }
    if (result.reason === "locked_removed") {
      return {
        status: "error",
        message: "This job has been removed and cannot be published.",
      };
    }
    if (result.reason === "deadline_passed") {
      return {
        status: "error",
        message:
          "Cannot publish this job because its deadline has passed. Edit the deadline first.",
      };
    }
    if (result.reason === "incomplete_job") {
      return {
        status: "error",
        message:
          "Publishing requires all fields and at least 1 required skill. Please edit the job first.",
      };
    }
    return {
      status: "error",
      message: "Only draft or closed jobs can be published.",
    };
  }

  revalidatePath("/employer/jobs");
  revalidatePath(`/employer/jobs/${parsedId.data}/edit`);

  return {
    status: "success",
    message: "Job published.",
  };
}

export async function closeJobAction(
  _prevState: JobStatusActionState,
  formData: FormData,
): Promise<JobStatusActionState> {
  // Identity and organization ownership come strictly from the session user ID.
  const user = await requireRole("EMPLOYER");

  const parsedId = jobIdSchema.safeParse(readText(formData, "jobId"));
  if (!parsedId.success) {
    return {
      status: "error",
      message: "Job not found.",
    };
  }

  const result = await closeOwnJob(user.id, parsedId.data);
  if (!result.ok) {
    if (result.reason === "not_found") {
      return { status: "error", message: "Job not found." };
    }
    if (result.reason === "locked_removed") {
      return {
        status: "error",
        message: "This job has been removed and cannot be modified.",
      };
    }
    return {
      status: "error",
      message: "Only published jobs can be closed.",
    };
  }

  revalidatePath("/employer/jobs");
  revalidatePath(`/employer/jobs/${parsedId.data}/edit`);

  return {
    status: "success",
    message: "Job closed.",
  };
}

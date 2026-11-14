import type {
  ExperienceLevel,
  JobStatus,
  JobType,
  WorkArrangement,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import type { CanonicalSkill } from "@/lib/skills/normalise";
import {
  MAX_JOBS_PER_ORGANIZATION,
  MIN_JOB_SKILLS,
  isDateInPast,
  type SubmitIntentValue,
} from "@/lib/validation/job";

export type EmployerOrganizationBasic = {
  id: string;
  name: string;
};

export type EmployerJobSummary = {
  id: string;
  title: string;
  status: JobStatus;
  location: string;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  workArrangement: WorkArrangement;
  deadline: Date | null;
  createdAt: Date;
  requiredSkillCount: number;
};

export type EmployerJobDetail = {
  id: string;
  title: string;
  description: string;
  location: string;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  workArrangement: WorkArrangement;
  deadline: Date | null;
  status: JobStatus;
  createdAt: Date;
  skills: CanonicalSkill[];
};

export async function getEmployerOrganizationBasic(
  userId: string,
): Promise<EmployerOrganizationBasic | null> {
  return prisma.organization.findUnique({
    where: { ownerUserId: userId },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function listOwnOrganizationJobs(
  userId: string,
): Promise<{ organization: EmployerOrganizationBasic | null; jobs: EmployerJobSummary[] }> {
  const organization = await getEmployerOrganizationBasic(userId);
  if (!organization) {
    return { organization: null, jobs: [] };
  }

  const rows = await prisma.job.findMany({
    where: {
      organization: {
        ownerUserId: userId,
      },
    },
    select: {
      id: true,
      title: true,
      status: true,
      location: true,
      experienceLevel: true,
      jobType: true,
      workArrangement: true,
      deadline: true,
      createdAt: true,
      _count: {
        select: {
          skills: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    organization,
    jobs: rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      location: row.location,
      experienceLevel: row.experienceLevel,
      jobType: row.jobType,
      workArrangement: row.workArrangement,
      deadline: row.deadline,
      createdAt: row.createdAt,
      requiredSkillCount: row._count.skills,
    })),
  };
}

export async function getOwnJobForEdit(
  userId: string,
  jobId: string,
): Promise<EmployerJobDetail | null> {
  const row = await prisma.job.findFirst({
    where: {
      id: jobId,
      organization: {
        ownerUserId: userId,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      experienceLevel: true,
      jobType: true,
      workArrangement: true,
      deadline: true,
      status: true,
      createdAt: true,
      skills: {
        select: {
          skill: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          skill: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    experienceLevel: row.experienceLevel,
    jobType: row.jobType,
    workArrangement: row.workArrangement,
    deadline: row.deadline,
    status: row.status,
    createdAt: row.createdAt,
    skills: row.skills.map((entry) => entry.skill),
  };
}

export type SaveJobPayload = {
  title: string;
  description: string;
  location: string;
  experienceLevel: ExperienceLevel;
  jobType: JobType;
  workArrangement: WorkArrangement;
  deadline: Date | null;
  skillIds: string[];
  intent: SubmitIntentValue;
};

export type CreateOwnJobResult =
  | { ok: true; jobId: string; status: JobStatus }
  | {
      ok: false;
      reason: "no_organization" | "limit_reached" | "unknown_skills";
    };

export async function createOwnJob(
  userId: string,
  payload: SaveJobPayload,
): Promise<CreateOwnJobResult> {
  const uniqueSkillIds = Array.from(new Set(payload.skillIds));

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.findUnique({
      where: { ownerUserId: userId },
      select: { id: true },
    });

    if (!organization) {
      return { ok: false, reason: "no_organization" };
    }

    const existingJobCount = await tx.job.count({
      where: { organizationId: organization.id },
    });

    if (existingJobCount >= MAX_JOBS_PER_ORGANIZATION) {
      return { ok: false, reason: "limit_reached" };
    }

    const validSkillCount = await tx.skill.count({
      where: {
        id: {
          in: uniqueSkillIds,
        },
      },
    });

    if (validSkillCount !== uniqueSkillIds.length) {
      return { ok: false, reason: "unknown_skills" };
    }

    const targetStatus: JobStatus = payload.intent === "PUBLISH" ? "PUBLISHED" : "DRAFT";

    const created = await tx.job.create({
      data: {
        organizationId: organization.id,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        experienceLevel: payload.experienceLevel,
        jobType: payload.jobType,
        workArrangement: payload.workArrangement,
        deadline: payload.deadline,
        status: targetStatus,
        skills: {
          create: uniqueSkillIds.map((skillId) => ({
            skillId,
          })),
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    return {
      ok: true,
      jobId: created.id,
      status: created.status,
    };
  });
}

export type UpdateOwnJobResult =
  | { ok: true; jobId: string; status: JobStatus }
  | {
      ok: false;
      reason:
        | "no_organization"
        | "not_found"
        | "locked_removed"
        | "unknown_skills";
    };

export async function updateOwnJob(
  userId: string,
  jobId: string,
  payload: SaveJobPayload,
): Promise<UpdateOwnJobResult> {
  const uniqueSkillIds = Array.from(new Set(payload.skillIds));

  return prisma.$transaction(async (tx) => {
    const organization = await tx.organization.findUnique({
      where: { ownerUserId: userId },
      select: { id: true },
    });

    if (!organization) {
      return { ok: false, reason: "no_organization" };
    }

    const existingJob = await tx.job.findFirst({
      where: {
        id: jobId,
        organization: {
          ownerUserId: userId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existingJob) {
      return { ok: false, reason: "not_found" };
    }

    if (existingJob.status === "REMOVED") {
      return { ok: false, reason: "locked_removed" };
    }

    const validSkillCount = await tx.skill.count({
      where: {
        id: {
          in: uniqueSkillIds,
        },
      },
    });

    if (validSkillCount !== uniqueSkillIds.length) {
      return { ok: false, reason: "unknown_skills" };
    }

    const nextStatus: JobStatus =
      payload.intent === "PUBLISH" ? "PUBLISHED" : "DRAFT";

    await tx.jobSkill.deleteMany({
      where: { jobId: existingJob.id },
    });

    const updated = await tx.job.update({
      where: { id: existingJob.id },
      data: {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        experienceLevel: payload.experienceLevel,
        jobType: payload.jobType,
        workArrangement: payload.workArrangement,
        deadline: payload.deadline,
        status: nextStatus,
        skills: {
          create: uniqueSkillIds.map((skillId) => ({
            skillId,
          })),
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    return {
      ok: true,
      jobId: updated.id,
      status: updated.status,
    };
  });
}

export type TransitionJobStatusResult =
  | { ok: true; status: JobStatus }
  | {
      ok: false;
      reason:
        | "not_found"
        | "locked_removed"
        | "invalid_transition"
        | "deadline_passed"
        | "incomplete_job";
    };

export async function publishOwnJob(
  userId: string,
  jobId: string,
): Promise<TransitionJobStatusResult> {
  return prisma.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: {
        id: jobId,
        organization: {
          ownerUserId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        deadline: true,
        status: true,
        _count: {
          select: {
            skills: true,
          },
        },
      },
    });

    if (!job) {
      return { ok: false, reason: "not_found" };
    }

    if (job.status === "REMOVED") {
      return { ok: false, reason: "locked_removed" };
    }

    if (job.status !== "DRAFT" && job.status !== "CLOSED") {
      return { ok: false, reason: "invalid_transition" };
    }

    if (job.deadline && isDateInPast(job.deadline)) {
      return { ok: false, reason: "deadline_passed" };
    }

    if (
      job.title.trim() === "" ||
      job.description.trim() === "" ||
      job.location.trim() === "" ||
      job._count.skills < MIN_JOB_SKILLS
    ) {
      return { ok: false, reason: "incomplete_job" };
    }

    const updated = await tx.job.update({
      where: { id: job.id },
      data: { status: "PUBLISHED" },
      select: { status: true },
    });

    return { ok: true, status: updated.status };
  });
}

export async function closeOwnJob(
  userId: string,
  jobId: string,
): Promise<TransitionJobStatusResult> {
  return prisma.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: {
        id: jobId,
        organization: {
          ownerUserId: userId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!job) {
      return { ok: false, reason: "not_found" };
    }

    if (job.status === "REMOVED") {
      return { ok: false, reason: "locked_removed" };
    }

    if (job.status !== "PUBLISHED") {
      return { ok: false, reason: "invalid_transition" };
    }

    const updated = await tx.job.update({
      where: { id: job.id },
      data: { status: "CLOSED" },
      select: { status: true },
    });

    return { ok: true, status: updated.status };
  });
}

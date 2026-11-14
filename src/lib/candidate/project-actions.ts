"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import {
  createOwnProject,
  deleteOwnProject,
  updateOwnProject,
} from "@/lib/candidate/projects";
import {
  MAX_CANDIDATE_PROJECTS,
  projectIdSchema,
  projectSchema,
  type ProjectKindValue,
} from "@/lib/validation/project";

export type ProjectFieldName = "title" | "description" | "url" | "kind";

export type ProjectFormActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProjectFieldName, string[]>>;
  values?: {
    title: string;
    description: string;
    url: string;
    kind: ProjectKindValue;
  };
  nonce?: number;
};

export type DeleteProjectActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function collectFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
): Partial<Record<ProjectFieldName, string[]>> {
  const fieldErrors: Partial<Record<ProjectFieldName, string[]>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (
      field === "title" ||
      field === "description" ||
      field === "url" ||
      field === "kind"
    ) {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
  }
  return fieldErrors;
}

export async function createProjectAction(
  _prevState: ProjectFormActionState,
  formData: FormData,
): Promise<ProjectFormActionState> {
  // Ownership comes strictly from the session user id; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const rawTitle = readText(formData, "title");
  const rawDescription = readText(formData, "description");
  const rawUrl = readText(formData, "url");
  const rawKind = readText(formData, "kind");

  const echoValues = {
    title: rawTitle,
    description: rawDescription,
    url: rawUrl,
    kind: (rawKind === "PORTFOLIO" ? "PORTFOLIO" : "PROJECT") as ProjectKindValue,
  };

  const parsed = projectSchema.safeParse({
    title: rawTitle,
    description: rawDescription,
    url: rawUrl,
    kind: rawKind,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
      values: echoValues,
    };
  }

  const { title, description, url, kind } = parsed.data;

  const created = await createOwnProject(user.id, {
    title,
    description,
    url: url === "" ? null : url,
    kind,
  });

  if (!created.ok) {
    return {
      status: "error",
      message: `You can have at most ${MAX_CANDIDATE_PROJECTS} projects. Delete an existing item before adding another.`,
      values: echoValues,
    };
  }

  revalidatePath("/candidate/projects");

  return {
    status: "success",
    message: "Project added.",
    values: {
      title: "",
      description: "",
      url: "",
      kind: "PROJECT",
    },
    nonce: Date.now(),
  };
}

export async function updateProjectAction(
  _prevState: ProjectFormActionState,
  formData: FormData,
): Promise<ProjectFormActionState> {
  // Ownership comes strictly from the session user id; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const rawProjectId = readText(formData, "projectId");
  const rawTitle = readText(formData, "title");
  const rawDescription = readText(formData, "description");
  const rawUrl = readText(formData, "url");
  const rawKind = readText(formData, "kind");

  const echoValues = {
    title: rawTitle,
    description: rawDescription,
    url: rawUrl,
    kind: (rawKind === "PORTFOLIO" ? "PORTFOLIO" : "PROJECT") as ProjectKindValue,
  };

  const parsedId = projectIdSchema.safeParse(rawProjectId);
  if (!parsedId.success) {
    return {
      status: "error",
      message: "Project not found.",
      values: echoValues,
    };
  }

  const parsed = projectSchema.safeParse({
    title: rawTitle,
    description: rawDescription,
    url: rawUrl,
    kind: rawKind,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
      values: echoValues,
    };
  }

  const { title, description, url, kind } = parsed.data;

  const result = await updateOwnProject(user.id, parsedId.data, {
    title,
    description,
    url: url === "" ? null : url,
    kind,
  });

  if (!result.updated) {
    return {
      status: "error",
      message: "Project not found.",
      values: echoValues,
    };
  }

  revalidatePath("/candidate/projects");

  return {
    status: "success",
    message: "Project updated.",
    values: {
      title,
      description,
      url,
      kind,
    },
    nonce: Date.now(),
  };
}

export async function deleteProjectAction(
  _prevState: DeleteProjectActionState,
  formData: FormData,
): Promise<DeleteProjectActionState> {
  // Ownership comes strictly from the session user id; any userId/candidateProfileId in formData is ignored.
  const user = await requireRole("CANDIDATE");

  const rawProjectId = readText(formData, "projectId");
  const parsedId = projectIdSchema.safeParse(rawProjectId);
  if (!parsedId.success) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  const result = await deleteOwnProject(user.id, parsedId.data);
  if (!result.deleted) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  revalidatePath("/candidate/projects");

  return {
    status: "success",
    message: "Project deleted.",
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/session";
import {
  saveOwnOrganization,
  type OwnOrganization,
} from "@/lib/employer/organization";
import { organizationSchema } from "@/lib/validation/organization";

export type OrganizationFieldName = "name" | "description" | "website" | "location";

export type OrganizationActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<OrganizationFieldName, string[]>>;
  organization?: OwnOrganization;
};

function readText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function saveOrganizationAction(
  _prevState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  // Identity comes strictly from the session; any id or ownerUserId in formData is ignored.
  const user = await requireRole("EMPLOYER");

  const rawName = readText(formData, "name");
  const rawDescription = readText(formData, "description");
  const rawWebsite = readText(formData, "website");
  const rawLocation = readText(formData, "location");

  const echo: OwnOrganization = {
    name: rawName,
    description: rawDescription,
    website: rawWebsite === "" ? null : rawWebsite,
    location: rawLocation,
  };

  const parsed = organizationSchema.safeParse({
    name: rawName,
    description: rawDescription,
    website: rawWebsite,
    location: rawLocation,
  });

  if (!parsed.success) {
    const fieldErrors: OrganizationActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        field === "name" ||
        field === "description" ||
        field === "website" ||
        field === "location"
      ) {
        fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
      }
    }
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors,
      organization: echo,
    };
  }

  const { name, description, website, location } = parsed.data;

  const saved = await saveOwnOrganization(user.id, {
    name,
    description,
    website: website === "" ? null : website,
    location,
  });

  revalidatePath("/employer/organization");

  return {
    status: "success",
    message: "Organization saved.",
    organization: saved,
  };
}

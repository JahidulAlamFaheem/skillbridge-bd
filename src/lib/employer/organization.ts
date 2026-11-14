import { prisma } from "@/lib/db";

export type OwnOrganization = {
  name: string;
  description: string;
  website: string | null;
  location: string;
};

const ORGANIZATION_SELECT = {
  name: true,
  description: true,
  website: true,
  location: true,
} as const;

export async function getOwnOrganization(userId: string): Promise<OwnOrganization | null> {
  return prisma.organization.findUnique({
    where: { ownerUserId: userId },
    select: ORGANIZATION_SELECT,
  });
}

export async function saveOwnOrganization(
  userId: string,
  data: OwnOrganization,
): Promise<OwnOrganization> {
  return prisma.organization.upsert({
    where: { ownerUserId: userId },
    update: data,
    create: {
      ownerUserId: userId,
      ...data,
    },
    select: ORGANIZATION_SELECT,
  });
}

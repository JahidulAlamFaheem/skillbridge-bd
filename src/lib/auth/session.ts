import { cache } from "react";
import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/options";
import type { Role } from "@/lib/auth/roles";

export type SessionUser = Session["user"];

export const getSession = cache(async (): Promise<Session | null> => {
  return getServerSession(authOptions);
});

export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }
  return session.user;
}

export async function requireRole(allowedRoles: Role | readonly Role[]): Promise<SessionUser> {
  const user = await requireUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!roles.includes(user.role)) {
    redirect("/not-allowed");
  }
  return user;
}


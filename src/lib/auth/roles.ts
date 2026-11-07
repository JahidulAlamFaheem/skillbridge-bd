export const ROLES = ["CANDIDATE", "EMPLOYER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const REGISTERABLE_ROLES = ["CANDIDATE", "EMPLOYER"] as const;
export type RegisterableRole = (typeof REGISTERABLE_ROLES)[number];

export const ROLE_HOME: Record<Role, string> = {
  CANDIDATE: "/candidate/profile",
  EMPLOYER: "/employer/organization",
  ADMIN: "/admin/reports",
};

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

export function requiredRoleForPath(pathname: string): Role | null {
  if (pathname === "/candidate" || pathname.startsWith("/candidate/")) {
    return "CANDIDATE";
  }
  if (pathname === "/employer" || pathname.startsWith("/employer/")) {
    return "EMPLOYER";
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "ADMIN";
  }
  return null;
}

export function isRoleAllowedForPath(pathname: string, role: Role): boolean {
  const required = requiredRoleForPath(pathname);
  if (!required) {
    return true;
  }
  return role === required;
}


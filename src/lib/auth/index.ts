export { authOptions } from "@/lib/auth/options";
export { getSession, requireRole, requireUser, type SessionUser } from "@/lib/auth/session";
export { registerUser, type RegisterResult } from "@/lib/auth/register";
export { getSafeCallbackUrl } from "@/lib/auth/redirects";
export {
  ROLES,
  REGISTERABLE_ROLES,
  ROLE_HOME,
  isRole,
  isRoleAllowedForPath,
  requiredRoleForPath,
  type Role,
  type RegisterableRole,
} from "@/lib/auth/roles";


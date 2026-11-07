import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isRole, isRoleAllowedForPath } from "@/lib/auth/roles";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !isRole(token.role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!isRoleAllowedForPath(pathname, token.role)) {
    return NextResponse.redirect(new URL("/not-allowed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/candidate/:path*", "/employer/:path*", "/admin/:path*"],
};


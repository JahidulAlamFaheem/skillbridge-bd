"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  const defaultStyles =
    "inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className={className ?? defaultStyles}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}

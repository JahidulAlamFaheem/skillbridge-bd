"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}


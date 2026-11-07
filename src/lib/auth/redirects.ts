const BASE_ORIGIN = "http://localhost";

/**
 * Returns the callbackUrl only if it is a safe relative path starting with a single "/"
 * on the same origin. Returns null otherwise to prevent open redirects.
 */
export function getSafeCallbackUrl(callbackUrl: string | null | undefined): string | null {
  if (!callbackUrl || typeof callbackUrl !== "string") {
    return null;
  }

  const trimmed = callbackUrl.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return null;
  }

  // Reject ASCII control characters
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed, BASE_ORIGIN);
    if (parsed.origin !== BASE_ORIGIN) {
      return null;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}


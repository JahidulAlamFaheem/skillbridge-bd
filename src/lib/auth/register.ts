import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import type { Role } from "@/lib/auth/roles";
import { registerSchema } from "@/lib/validation/auth";

export type RegisterResult =
  | {
      ok: true;
      user: {
        id: string;
        email: string;
        name: string;
        role: Role;
      };
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<"name" | "email" | "password" | "role", string[]>>;
    };

const DUPLICATE_EMAIL_MESSAGE =
  "Unable to register with this email address. If you already have an account, please sign in.";

export async function registerUser(rawInput: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(rawInput);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattened.fieldErrors,
    };
  }

  const { name, email, password, role } = parsed.data;

  // Explicit defense-in-depth check: never allow ADMIN registration
  if (role !== "CANDIDATE" && role !== "EMPLOYER") {
    return {
      ok: false,
      error: "Invalid role selection.",
    };
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return {
      ok: false,
      error: DUPLICATE_EMAIL_MESSAGE,
    };
  }

  const passwordHash = await hashPassword(password);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (role === "CANDIDATE") {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            headline: "",
            bio: "",
            location: "",
            links: [],
          },
          select: { id: true },
        });
      }

      return user;
    });

    return {
      ok: true,
      user: created,
    };
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        ok: false,
        error: DUPLICATE_EMAIL_MESSAGE,
      };
    }
    throw err;
  }
}


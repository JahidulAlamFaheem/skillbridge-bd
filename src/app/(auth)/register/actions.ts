"use server";

import { registerUser } from "@/lib/auth/register";

export type RegisterActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "role", string[]>>;
  values?: {
    name: string;
    email: string;
    role: string;
  };
};

export async function registerAction(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = typeof formData.get("name") === "string" ? String(formData.get("name")) : "";
  const email = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  const password =
    typeof formData.get("password") === "string" ? String(formData.get("password")) : "";
  const role = typeof formData.get("role") === "string" ? String(formData.get("role")) : "";

  const result = await registerUser({
    name,
    email,
    password,
    role,
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.error,
      fieldErrors: result.fieldErrors,
      values: {
        name,
        email,
        role: role === "EMPLOYER" ? "EMPLOYER" : "CANDIDATE",
      },
    };
  }

  return {
    status: "success",
    message: "Account created! You can now sign in with your email and password.",
  };
}


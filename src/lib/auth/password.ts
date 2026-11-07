import { compare, hash, hashSync } from "bcryptjs";

const BCRYPT_ROUNDS = 12;

// Precomputed once at module load with the same cost factor so that login attempts
// for non-existent emails still run a full bcrypt comparison.
const DUMMY_PASSWORD_HASH = hashSync("dummy-password-for-timing-parity", BCRYPT_ROUNDS);

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, passwordHash: string): Promise<boolean> {
  return compare(plain, passwordHash);
}

export async function verifyDummyPassword(plain: string): Promise<void> {
  await compare(plain, DUMMY_PASSWORD_HASH);
}


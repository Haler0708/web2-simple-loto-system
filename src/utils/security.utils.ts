import { genSalt, hash, compare } from "bcrypt";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { loginIps, users } from "../db/schema";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
};

export const queryForUsername = async (
  username: string,
  sqlInjectionSwitch: boolean
) => {
  if (sqlInjectionSwitch)
    return (
      await db.execute(
        sql.raw(`SELECT * FROM public.users WHERE "username" = '${username}'`)
      )
    ).rows;

  return await db.select().from(users).where(eq(users.username, username));
};

export const isPasswordValid = async (
  password: string,
  hashedPassword: string
) => {
  return await compare(password, hashedPassword);
};

export const checkIfTimeoutPassed = (
  loginIpsEntry: typeof loginIps.$inferSelect
) => {
  const blockedAt = loginIpsEntry.blockedAt!;
  const now = Date.now();

  const blockDuration = now - blockedAt;
  const blockDurationInSeconds = blockDuration / 1000;

  if (blockDurationInSeconds < 60) return false;

  return true;
};

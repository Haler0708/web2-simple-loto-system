import { genSalt, hash, compare } from "bcrypt";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { users } from "../db/schema";

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

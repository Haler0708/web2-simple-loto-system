import { genSalt, hash } from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
};

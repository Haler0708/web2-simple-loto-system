import { Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword } from "../utils/security.utils";

dotenv.config();

export const renderSecurity = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.render("security", {
    username: null,
    password: null,
    sqlInjectionSwitch: null,
  });
};

export const submitUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, sqlInjectionSwitch } = req.body;

  console.log(username);
  console.log(sqlInjectionSwitch);

  res
    .status(200)
    .render("security", { username, sqlInjectionSwitch, password: null });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Username or password not good.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({ username, password: hashedPassword });

  res.status(201).send("New user created.");
};

import { Request, Response } from "express";
import dotenv from "dotenv";

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

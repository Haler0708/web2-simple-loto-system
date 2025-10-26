import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<void> => {
  res.oidc.login({
    returnTo: process.env.BASE_URL,
    authorizationParams: { screen_hint: "signup" },
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.oidc.logout({
    returnTo: process.env.BASE_URL,
  });
};

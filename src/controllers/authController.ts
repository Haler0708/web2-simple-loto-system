import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  res.oidc.login({
    returnTo: "https://localhost:8443/",
    authorizationParams: { screen_hint: "signup" },
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.oidc.logout({
    returnTo: "https://localhost:8443/",
  });
};

import { Request, Response } from "express";

export const renderHome = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.oidc.user ? req.oidc.user.email : "Guest";
  res.render("home", { user });
};

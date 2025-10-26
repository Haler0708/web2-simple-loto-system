import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const renderHome = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.oidc.user ? req.oidc.user.email : "Guest";
  const isLoggedIn = req.oidc.user;

  const authButton = isLoggedIn
    ? { href: `${process.env.BASE_URL}/auth/logout`, text: "Logout" }
    : { href: `${process.env.BASE_URL}/auth`, text: "Login" };

  const ticketsElement = isLoggedIn
    ? { href: `${process.env.BASE_URL}/tickets`, text: "Create New Ticket" }
    : { text: "Login to be able to create a ticket first." };

  res.render("home", {
    user,
    authButton,
    ticketsElement,
  });
};

import { Request, Response } from "express";
import dotenv from "dotenv";
import { db } from "../db";
import { getTicketsElementContent } from "../utils/home.utils";

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

  const latestRound = await db.query.rounds.findFirst({
    orderBy: (rounds, { desc }) => [desc(rounds.id)],
    with: {
      tickets: true,
    },
  });

  const ticketsElement = getTicketsElementContent(
    !!isLoggedIn,
    !!latestRound &&
      !(latestRound.closedAt !== null && latestRound.drawnNumbers?.length !== 0)
  );

  if (!latestRound) {
    res.render("home", {
      user,
      authButton,
      ticketsElement,
      ticketInCurrentRoundText: "",
      drawnNumbersInTheLatestRoundText: "",
    });
    return;
  }

  const numberOfTicketsInCurrentRound = latestRound?.tickets.length || 0;

  const ticketInCurrentRoundText = `In the latest round there are ${numberOfTicketsInCurrentRound} tickets.`;
  const drawnNumbersInTheLatestRoundText =
    latestRound.drawnNumbers && latestRound.drawnNumbers?.length > 0
      ? `In the latest round the drawn numbers are: ${latestRound.drawnNumbers?.join(
          ", "
        )}`
      : "";

  res.render("home", {
    user,
    authButton,
    ticketsElement,
    ticketInCurrentRoundText,
    drawnNumbersInTheLatestRoundText,
  });
};

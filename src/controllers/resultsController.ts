import { Request, Response } from "express";
import { rounds, tickets, ticketsRelations } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export const renderResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ticketUuid } = req.params;

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.uuid, ticketUuid),
    with: {
      rounds: true,
    },
  });

  if (!ticket) {
    res.status(400).send("No ticket found for the provided QR code.");
    return;
  }

  const { drawnNumbersMessage, resultMessage } = getDrawnNumbersMessage(ticket);

  res.render("results", {
    drawnNumbersMessage,
    resultMessage,
    numbers: ticket.numbers,
  });
};

const getDrawnNumbersMessage = (
  ticket: typeof tickets.$inferSelect & {
    rounds: typeof rounds.$inferSelect | null;
  }
) => {
  if (!ticket.rounds?.closedAt) {
    return {
      drawnNumbersMessage: "The round is not closed yet.",
      resultsMessage: "",
    };
  }

  if (ticket.rounds?.closedAt && !ticket.rounds?.drawnNumbers) {
    return {
      drawnNumbersMessage:
        "The round is closed but the numbers haven't been drawn yet.",
      resultsMessage: "",
    };
  }

  const drawnNumbers = ticket.rounds.drawnNumbers ?? [];

  const areDrawnAndTicketNumbersSame = ticket.numbers.every((tn) =>
    drawnNumbers.includes(tn)
  );

  const resultMessage = areDrawnAndTicketNumbersSame
    ? "Congrats! Yours and drawn numbers match."
    : "Better luck with the next ticket.";

  return {
    drawnNumbersMessage: `The drawn numbers for this round: ${drawnNumbers}`,
    resultMessage,
  };
};

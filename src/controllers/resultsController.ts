import { Request, Response } from "express";
import { rounds, tickets, ticketsRelations } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { getDrawnNumbersMessage } from "../utils/results.utils";

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

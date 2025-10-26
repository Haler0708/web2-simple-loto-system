import { Request, Response } from "express";
import { db } from "../db";
import QRCode from "qrcode";
import { tickets } from "../db/schema";
import dotenv from "dotenv";

dotenv.config();

export const renderNewTicketForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.render("newTicket");
};

export const createTicket = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idNumber, numbers, roundId } = req.body as {
    idNumber: string;
    numbers: Array<number>;
    roundId: number;
  };

  try {
    const ticket = (
      await db
        .insert(tickets)
        .values({ idNumber, numbers, roundId })
        .returning()
    )[0];

    const homeUrl = process.env.BASE_URL;

    const ticketUrl = `${homeUrl}/results/${ticket.uuid}`;

    const qrBuffer = await QRCode.toBuffer(ticketUrl, {
      type: "png",
      width: 300,
    });

    res
      .status(201)
      .render("ticketQrCode", { image: qrBuffer.toString("base64"), homeUrl });
    return;
  } catch (err) {
    console.error("Error with ticket creation.", err);
    res.status(500).send("Error with ticket creation");
  }
};

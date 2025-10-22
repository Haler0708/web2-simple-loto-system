import { Request, Response } from "express";
import { db } from "../db";
import QRCode from "qrcode";
import { tickets } from "../db/schema";

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
  const { idNumber, numbers } = req.body as {
    idNumber: string;
    numbers: Array<number>;
  };

  try {
    const ticket = (
      await db.insert(tickets).values({ idNumber, numbers }).returning()
    )[0];

    const ticketUrl = `http://localhost:3000/result/${ticket.uuid}`;

    const qrBuffer = await QRCode.toBuffer(ticketUrl, {
      type: "png",
      width: 300,
    });

    res
      .status(201)
      .render("ticketQrCode", { image: qrBuffer.toString("base64") });
    return;
  } catch (err) {
    console.error("Error with ticket creation.", err);
    res.status(500).send("Error with ticket creation");
  }
};

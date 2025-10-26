import { Request, Response } from "express";
import { rounds } from "../db/schema";
import { db } from "../db";
import { and, isNotNull, isNull, or } from "drizzle-orm";

export const openNewRound = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const openRoundExists = await db
      .select()
      .from(rounds)
      .where(
        and(
          isNotNull(rounds.createdAt),
          or(isNull(rounds.closedAt), isNull(rounds.drawnNumbers))
        )
      );

    if (!!openRoundExists) {
      res.status(204).send("An open round already exists.");
      return;
    }

    const round = (await db.insert(rounds).values({}).returning())[0];

    res.status(201).json({ round });
    return;
  } catch (err) {
    console.error("Error with round openning.", err);
    res.status(500).send("Error with round openning");
  }
};

export const closeExistingRound = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const round = (
      await db
        .update(rounds)
        .set({ closedAt: new Date() })
        .where(and(isNotNull(rounds.createdAt), isNull(rounds.closedAt)))
        .returning()
    )[0];

    if (round) {
      res.status(204).send("The round is already closed.");
      return;
    }

    res.status(200).json({ round });
    return;
  } catch (err) {
    console.error("Error with round closing.", err);
    res.status(500).send("Error with round closing.");
  }
};

export const drawExistingRoundNumbers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { numbers } = req.body as { numbers: number[] };

  try {
    const round = (
      await db
        .update(rounds)
        .set({ drawnNumbers: numbers })
        .where(
          and(
            isNotNull(rounds.createdAt),
            isNotNull(rounds.closedAt),
            isNull(rounds.drawnNumbers)
          )
        )
        .returning()
    )[0];

    if (!round) {
      res
        .status(400)
        .send("Numbers already drawn or the round is not closed yet.");
      return;
    }

    res.status(204).json({ round });
    return;
  } catch (err) {
    console.error("Error with drawn numbers update.", err);
    res.status(500).send("Error with drawn numbers update.");
  }
};

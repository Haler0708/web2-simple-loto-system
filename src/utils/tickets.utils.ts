import { NextFunction, Request, Response } from "express";

export const validateInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idNumber, numbers } = req.body as {
    idNumber: string;
    numbers: Array<number>;
  };

  if (idNumber.length > 20) {
    res
      .status(400)
      .send(
        "Provide OIB or a passport identification number that is 20 characters at most."
      );
    return;
  }

  if (numbers.length < 6 || numbers.length > 10) {
    res.status(400).send("Input 6 to 10 numbers.");
    return;
  }

  const invalidNumbers = numbers.filter((n) => n < 1 || n > 45);

  if (invalidNumbers.length > 0) {
    res
      .status(400)
      .send("Numbers must be between 1 and 45 (including 1 and 45) .");
    return;
  }

  next();
};

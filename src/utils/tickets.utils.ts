import { NextFunction, Request, Response } from "express";

export const validateInputs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idNumber, numbers } = req.body as {
    idNumber: string;
    numbers: string;
  };

  if (idNumber.length > 20) {
    res
      .status(400)
      .send("Provide ID or a passport number that is 20 characters at most.");
    return;
  }

  const trimmedNumbers = numbers.endsWith(",")
    ? numbers.slice(0, numbers.length - 1)
    : numbers;

  const numbersArray: Array<number> = trimmedNumbers
    .split(",")
    .map((el) => Number(el.trim()));

  const stringsInNumbersArray = numbersArray.filter((el) => isNaN(el));
  const numbersArrayHasStrings = stringsInNumbersArray.length > 0;

  if (numbersArrayHasStrings) {
    res.status(400).send("Input only numbers seperated by commas.");
    return;
  }

  if (numbersArray.length < 6 || numbersArray.length > 10) {
    res.status(400).send("Input 6 to 10 numbers.");
    return;
  }

  const invalidNumbers = numbersArray.filter((n) => n < 1 || n > 45);

  if (invalidNumbers.length > 0) {
    res
      .status(400)
      .send("Numbers must be between 1 and 45 (including 1 and 45).");
    return;
  }

  req.body.numbers = numbersArray;

  next();
};

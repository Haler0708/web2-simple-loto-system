import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export const renderSecurity = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.render("security");
};

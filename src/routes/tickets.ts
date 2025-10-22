import express from "express";
import { createTicket } from "../controllers/ticketsController";
import { validateInputs } from "../utils/tickets.utils";

const ticketsRouter = express.Router();

ticketsRouter.post("/create", validateInputs, createTicket);

export default ticketsRouter;

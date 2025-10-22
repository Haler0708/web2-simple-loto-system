import express from "express";
import {
  createTicket,
  renderNewTicketForm,
} from "../controllers/ticketsController";
import { validateInputs } from "../utils/tickets.utils";

const ticketsRouter = express.Router();

ticketsRouter.get("/", renderNewTicketForm);

ticketsRouter.post("/create", validateInputs, createTicket);

export default ticketsRouter;

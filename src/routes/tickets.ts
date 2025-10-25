import express from "express";
import {
  createTicket,
  renderNewTicketForm,
} from "../controllers/ticketsController";
import { validateInputs } from "../utils/tickets.utils";
import { requiresAuth } from "express-openid-connect";

const ticketsRouter = express.Router();

ticketsRouter.get("/", requiresAuth(), renderNewTicketForm);

ticketsRouter.post("/create", validateInputs, createTicket);

export default ticketsRouter;

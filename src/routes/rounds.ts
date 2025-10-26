import express from "express";
import {
  createTicket,
  renderNewTicketForm,
} from "../controllers/ticketsController";
import { validateInputs } from "../utils/tickets.utils";
import { requiresAuth } from "express-openid-connect";
import {
  closeExistingRound,
  drawExistingRoundNumbers,
  openNewRound,
} from "../controllers/roundsController";

const roundsRouter = express.Router();

roundsRouter.post("/new-round", openNewRound);

roundsRouter.post("/close", closeExistingRound);

roundsRouter.post("/store-results", drawExistingRoundNumbers);

export default roundsRouter;

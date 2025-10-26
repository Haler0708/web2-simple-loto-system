import express from "express";
import {
  closeExistingRound,
  drawExistingRoundNumbers,
  openNewRound,
} from "../controllers/roundsController";
import { roundsJwtValidation } from "../utils/auth.utils";

const roundsRouter = express.Router();

roundsRouter.use(roundsJwtValidation);

roundsRouter.post("/new-round", openNewRound);

roundsRouter.post("/close", closeExistingRound);

roundsRouter.post("/store-results", drawExistingRoundNumbers);

export default roundsRouter;

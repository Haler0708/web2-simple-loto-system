import express from "express";
import { renderResults } from "../controllers/resultsController";

const resultsRouter = express.Router();

resultsRouter.get("/:ticketUuid", renderResults);

export default resultsRouter;

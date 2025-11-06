import express from "express";
import { renderSecurity } from "../controllers/securityController";

const securityRouter = express.Router();

securityRouter.get("/", renderSecurity);

export default securityRouter;

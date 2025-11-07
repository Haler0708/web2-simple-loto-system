import express from "express";
import {
  renderSecurity,
  submitUsername,
} from "../controllers/securityController";

const securityRouter = express.Router();

securityRouter.get("/", renderSecurity);
securityRouter.post("/submitUsername", submitUsername);

export default securityRouter;

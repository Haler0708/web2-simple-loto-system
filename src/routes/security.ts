import express from "express";
import {
  createUser,
  renderSecurity,
  submitUsername,
} from "../controllers/securityController";

const securityRouter = express.Router();

securityRouter.get("/", renderSecurity);
securityRouter.post("/submitUsername", submitUsername);
securityRouter.post("/createUser", createUser);

export default securityRouter;

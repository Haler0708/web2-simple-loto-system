import express from "express";
import { logout, signUp } from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/", signUp);

authRouter.get("/logout", logout);

export default authRouter;

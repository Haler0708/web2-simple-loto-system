import express from "express";
import dotenv from "dotenv";
import ticketsRouter from "./routes/tickets";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/tickets", ticketsRouter);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

import express from "express";
import dotenv from "dotenv";
import ticketsRouter from "./routes/tickets";
import cors from "cors";
import path from "path";
import { auth0Init } from "./utils/auth.utils";
import authRouter from "./routes/auth";
import https from "https";
import fs from "fs";
import { renderHome } from "./controllers/homeController";
import resultsRouter from "./routes/results";
import roundsRouter from "./routes/rounds";

dotenv.config();

const PORT = process.env.PORT || 8443;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth0Init);

app.use("/tickets", ticketsRouter);
app.use("/auth", authRouter);
app.use("/results", resultsRouter);
app.use("/rounds", roundsRouter);
app.get("/", renderHome);

const isLocalDevelopment = process.env.LOCAL_ENVIRONMENT || false;

if (isLocalDevelopment) {
  const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "../local-cert/server.key")),
    cert: fs.readFileSync(path.join(__dirname, "../local-cert/server.cert")),
  };
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () =>
    console.log(`✅ HTTPS server running on port ${PORT}`)
  );
}

import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(cors());
app.use(helmet());

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

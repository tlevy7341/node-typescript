import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth/AuthRoutes";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

app.use((req: Request, res: Response) => {
  res.sendStatus(404);
});

export default app;

import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";

dotenv.config();

const app: Express = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).send({ error: "This route does not exist." });
});

export default app;

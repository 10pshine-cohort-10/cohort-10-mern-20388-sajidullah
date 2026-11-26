import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./config/logger";
import { AppError, errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";

const app: Application = express();

app.use(helmet());
app.use(cors());

app.use(
  pinoHttp({
    logger,
    autoLogging: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;

import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export class AppError extends Error implements CustomError {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,

  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const isDevelopment = process.env.NODE_ENV === "development";

  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
        isOperational: err.isOperational ?? false,
      },
      req: {
        method: req.method,
        url: req.originalUrl,
      },
    },
    "Request Error Encountered"
  );

  if (err.isOperational || isDevelopment) {
    res.status(statusCode).json({
      status,
      message: err.message,
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong! Please try again later.",
  });
};
import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  type?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let status = err.status || "error";
  let message = err.message;
  let isOperational = err.isOperational ?? false;

  // Recognize JSON parser client errors (malformed JSON or payload too large)
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    status = "fail";
    message = "Invalid JSON payload in request body";
    isOperational = true;
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    status = "fail";
    message = "Request payload exceeds size limit";
    isOperational = true;
  }

  const isDevelopment = process.env.NODE_ENV === "development";

  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: err.stack,
        isOperational,
      },
      req: {
        method: req.method,
        url: req.originalUrl,
      },
    },
    "Request Error Encountered"
  );

  if (isOperational || isDevelopment) {
    res.status(statusCode).json({
      status,
      message,
      ...(isDevelopment && { stack: err.stack }),
    });
    return;
  }

  res.status(500).json({
    status: "error",
    message: "Something went wrong! Please try again later.",
  });
};
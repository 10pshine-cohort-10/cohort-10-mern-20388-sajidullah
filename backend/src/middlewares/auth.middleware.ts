import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

export interface TokenPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid authentication token", 401));
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Authentication token has expired", 401));
      return;
    }
    next(error);
  }
};

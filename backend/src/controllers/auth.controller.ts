import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, getCurrentUser } from "../services/auth.service";
import { AppError } from "../middlewares/errorHandler";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Name, email, and password are required", 400);
    }

    const result = await registerUser(name, email, password);

    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      data: result,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      data: result,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error: unknown) {
    next(error);
  }
};

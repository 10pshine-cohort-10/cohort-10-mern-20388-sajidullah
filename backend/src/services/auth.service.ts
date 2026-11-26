import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import { AppError } from "../middlewares/errorHandler";

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

interface AuthResult {
  user: UserResponse;
  token: string;
}

const signToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId, email }, secret, options);
};

export const registerUser = async (
  name: string,
  email: string,
  password?: string
): Promise<AuthResult> => {
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("An account with this email already exists", 409);
    }

    const user = new User({
      name,
      email,
      password,
    });

    const token = signToken(user._id.toString(), user.email);

    await user.save();

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      throw new AppError("An account with this email already exists", 409);
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "ValidationError"
    ) {
      const message = error instanceof Error ? error.message : "Validation error";
      throw new AppError(message, 400);
    }

    throw error;
  }
};

export const loginUser = async (
  email: string,
  password?: string
): Promise<AuthResult> => {
  try {
    if (!password) {
      throw new AppError("Please provide email and password", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken(user._id.toString(), user.email);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      token,
    };
  } catch (error: unknown) {
    throw error;
  }
};

export const getCurrentUser = async (userId: string): Promise<UserResponse> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch (error: unknown) {
    throw error;
  }
};

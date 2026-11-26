import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";

const PORT =
  process.env.PORT !== undefined &&
  process.env.PORT.trim() !== "" &&
  !Number.isNaN(Number(process.env.PORT))
    ? Number(process.env.PORT)
    : 5000;

const startServer = async (): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      logger.error("Configuration error: JWT_SECRET is not defined");
      process.exit(1);
    }

    await connectDB();

    const server = app.listen(PORT, (err?: Error) => {
      if (err) {
        logger.error({ err }, `Failed to bind server to port ${PORT}`);
        process.exit(1);
      }

      const address = server.address();
      const actualPort =
        typeof address === "object" && address !== null ? address.port : PORT;

      logger.info(
        `Server running on port ${actualPort} in ${process.env.NODE_ENV || "development"} mode`
      );
    });
  } catch (error: unknown) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

startServer();

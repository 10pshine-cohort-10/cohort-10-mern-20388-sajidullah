import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(PORT, (err?: Error) => {
      if (err) {
        logger.error({ err }, `Failed to bind server to port ${PORT}`);
        process.exit(1);
      }

      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
      );
    });
  } catch (error: unknown) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

startServer();
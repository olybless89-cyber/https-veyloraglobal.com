import app from "./app";
import { logger } from "./lib/logger";

// Startup diagnostic — logs which env vars are present (no values)
console.log("[STARTUP] Environment check:", {
  PORT: !!process.env.PORT,
  SESSION_SECRET: !!process.env.SESSION_SECRET,
  DATABASE_URL: !!process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
});

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

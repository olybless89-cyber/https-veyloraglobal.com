import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.SESSION_SECRET) {
  // Log the issue but don't crash — allows healthcheck to pass so Deploy Logs show up
  console.warn(
    "[WARN] SESSION_SECRET is not set. Using insecure fallback — set this in Railway Variables.",
  );
  process.env.SESSION_SECRET = "insecure-fallback-change-me";
}

const app: Express = express();

// Railway (and most PaaS hosts) terminate TLS at an edge proxy and forward
// plain HTTP to this container. Without this, Express doesn't know the
// original request was HTTPS, which can affect how it and downstream
// middleware (like the secure session cookie below) reason about the
// connection.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(
  express.json({
    // Stash the raw request body alongside the parsed one so the Resend
    // inbound-email webhook route can verify its signature against the
    // exact bytes Resend sent (signature verification breaks if it's
    // computed over a re-serialized JSON object instead).
    verify: (req, _res, buf) => {
      (req as unknown as { rawBody?: Buffer }).rawBody = Buffer.from(buf);
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  }),
);

app.use("/api", router);

// In production, serve the built React frontend
if (process.env.NODE_ENV === "production") {
  // The Vite build outputs to artifacts/veylora-global/dist/public relative to monorepo root
  // At runtime, dist/index.mjs sits in artifacts/api-server/dist/, so we go up 3 levels
  const frontendDist = path.resolve(__dirname, "../../../artifacts/veylora-global/dist/public");
  app.use(express.static(frontendDist));
  // Catch-all: let React Router handle client-side navigation
  // Express 5 + path-to-regexp 8 requires a named wildcard — bare "*" throws PathError
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;

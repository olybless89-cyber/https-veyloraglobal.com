import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { appSettingsTable, officersTable, couriersTable, officesTable, trackUpdatesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

// Diagnostic endpoint — safe, no auth required, exposes no secret values.
// Checks DB connectivity and whether the schema has actually been pushed.
router.get("/diag", async (_req, res) => {
  const result: Record<string, string> = {};

  try {
    await db.select().from(appSettingsTable).limit(1);
    result.appSettingsTable = "ok";
  } catch (e: any) {
    result.appSettingsTable = "FAIL: " + e.message;
  }

  try {
    await db.select().from(officersTable).limit(1);
    result.officersTable = "ok";
  } catch (e: any) {
    result.officersTable = "FAIL: " + e.message;
  }

  try {
    await db.select().from(couriersTable).limit(1);
    result.couriersTable = "ok";
  } catch (e: any) {
    result.couriersTable = "FAIL: " + e.message;
  }

  try {
    await db.select().from(officesTable).limit(1);
    result.officesTable = "ok";
  } catch (e: any) {
    result.officesTable = "FAIL: " + e.message;
  }

  try {
    await db.select().from(trackUpdatesTable).limit(1);
    result.trackUpdatesTable = "ok";
  } catch (e: any) {
    result.trackUpdatesTable = "FAIL: " + e.message;
  }

  result.hasDatabaseUrl = process.env.DATABASE_URL ? "yes" : "NO";
  result.hasSessionSecret = process.env.SESSION_SECRET ? "yes" : "NO";
  result.nodeEnv = process.env.NODE_ENV ?? "(unset)";

  const allOk = [
    result.appSettingsTable,
    result.officersTable,
    result.couriersTable,
    result.officesTable,
    result.trackUpdatesTable,
  ].every((v) => v === "ok");
  res.status(allOk ? 200 : 500).json(result);
});

export default router;

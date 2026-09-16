import { Router } from "express";
import { db, couriersTable, trackUpdatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// POST /api/track
router.post("/track", async (req, res) => {
  const { consNo } = req.body as { consNo?: string };

  if (!consNo || consNo.trim().length < 5) {
    res.status(400).json({ error: "A valid consignment number is required" });
    return;
  }

  try {
    const [courier] = await db
      .select()
      .from(couriersTable)
      .where(eq(couriersTable.consNo, consNo.trim()))
      .limit(1);

    if (!courier) {
      res.status(404).json({ error: "Shipment not found. Please check your tracking number." });
      return;
    }

    const updates = await db
      .select()
      .from(trackUpdatesTable)
      .where(eq(trackUpdatesTable.consNo, consNo.trim()))
      .orderBy(trackUpdatesTable.id);

    res.json({ courier, updates });
  } catch (err) {
    req.log.error({ err }, "Track shipment error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

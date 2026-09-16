import { Router } from "express";
import { db, trackUpdatesTable, couriersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userName) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// GET /api/couriers/:consNo/track-updates
router.get("/couriers/:consNo/track-updates", async (req, res) => {
  const { consNo } = req.params;
  try {
    const updates = await db
      .select()
      .from(trackUpdatesTable)
      .where(eq(trackUpdatesTable.consNo, consNo))
      .orderBy(desc(trackUpdatesTable.id));
    res.json(updates);
  } catch (err) {
    req.log.error({ err }, "List track updates error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/couriers/:consNo/track-updates
router.post("/couriers/:consNo/track-updates", requireAuth, async (req, res) => {
  const { consNo } = req.params;
  const body = req.body;

  // Get courier id
  try {
    const [courier] = await db
      .select({ id: couriersTable.id })
      .from(couriersTable)
      .where(eq(couriersTable.consNo, consNo))
      .limit(1);

    const [created] = await db
      .insert(trackUpdatesTable)
      .values({
        cid: courier?.id ?? 0,
        consNo,
        updateDate: body.updateDate,
        currentCity: body.currentCity,
        newStatus: body.newStatus,
        comments: body.comments,
        currentLocation: body.currentLocation,
        bkTime: body.bkTime,
        rName: body.rName ?? "",
        rPhone: body.rPhone ?? "",
        rMail: body.rMail ?? "",
        rAdd: body.rAdd ?? "",
      })
      .returning();

    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Add track update error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/track-updates/:id
router.delete("/track-updates/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    await db.delete(trackUpdatesTable).where(eq(trackUpdatesTable.id, id));
    res.json({ message: "Tracking update deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete track update error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

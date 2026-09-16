import { Router } from "express";
import { db, officesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userName) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// GET /api/offices
router.get("/offices", requireAuth, async (req, res) => {
  try {
    const offices = await db.select().from(officesTable);
    res.json(offices);
  } catch (err) {
    req.log.error({ err }, "List offices error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/offices
router.post("/offices", requireAuth, async (req, res) => {
  const body = req.body;
  try {
    const [created] = await db
      .insert(officesTable)
      .values({
        offName: body.offName,
        address: body.address,
        city: body.city,
        phNo: body.phNo,
        officeTime: body.officeTime,
        contactPerson: body.contactPerson,
      })
      .returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Create office error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/offices/:id
router.delete("/offices/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    await db.delete(officesTable).where(eq(officesTable.id, id));
    res.json({ message: "Office deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete office error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db, officersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userName) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// GET /api/officers
router.get("/officers", requireAuth, async (req, res) => {
  try {
    const officers = await db
      .select({
        id: officersTable.id,
        officerName: officersTable.officerName,
        address: officersTable.address,
        email: officersTable.email,
        phNo: officersTable.phNo,
        office: officersTable.office,
        regDate: officersTable.regDate,
      })
      .from(officersTable);
    res.json(officers.map(o => ({ ...o, regDate: o.regDate.toISOString() })));
  } catch (err) {
    req.log.error({ err }, "List officers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/officers
router.post("/officers", requireAuth, async (req, res) => {
  const body = req.body;
  try {
    const [created] = await db
      .insert(officersTable)
      .values({
        officerName: body.officerName,
        offPwd: body.offPwd,
        address: body.address,
        email: body.email,
        phNo: body.phNo,
        office: body.office,
      })
      .returning({
        id: officersTable.id,
        officerName: officersTable.officerName,
        address: officersTable.address,
        email: officersTable.email,
        phNo: officersTable.phNo,
        office: officersTable.office,
        regDate: officersTable.regDate,
      });
    res.status(201).json({ ...created, regDate: created.regDate.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Create officer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/officers/:id
router.delete("/officers/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    await db.delete(officersTable).where(eq(officersTable.id, id));
    res.json({ message: "Officer deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete officer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

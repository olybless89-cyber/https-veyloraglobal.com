import { Router } from "express";
import { db, couriersTable, trackUpdatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// Middleware: require auth
function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userName) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// GET /api/couriers
router.get("/couriers", requireAuth, async (req, res) => {
  try {
    const couriers = await db
      .select()
      .from(couriersTable)
      .orderBy(desc(couriersTable.id));
    res.json(couriers);
  } catch (err) {
    req.log.error({ err }, "List couriers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/couriers
router.post("/couriers", requireAuth, async (req, res) => {
  try {
    const body = req.body;
    const [created] = await db.insert(couriersTable).values({
      consNo: body.consNo,
      sName: body.sName,
      sMail: body.sMail,
      sPhone: body.sPhone,
      sAdd: body.sAdd,
      rName: body.rName,
      rMail: body.rMail,
      rPhone: body.rPhone,
      rAdd: body.rAdd,
      type: body.type,
      weight: body.weight,
      invoiceNo: body.invoiceNo,
      qty: body.qty ?? 1,
      freight: body.freight,
      mode: body.mode,
      pmode: body.pmode,
      pickDate: body.pickDate,
      deptDate: body.deptDate,
      status: body.status,
      product: body.product,
      origin: body.origin,
      destination: body.destination,
      lat: body.lat ?? "",
      lon: body.lon ?? "",
    }).returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Create courier error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/couriers/:id
router.get("/couriers/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    const [courier] = await db
      .select()
      .from(couriersTable)
      .where(eq(couriersTable.id, id))
      .limit(1);
    if (!courier) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }
    res.json(courier);
  } catch (err) {
    req.log.error({ err }, "Get courier error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/couriers/:id
router.put("/couriers/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    const body = req.body;
    const [updated] = await db
      .update(couriersTable)
      .set({
        ...(body.sName !== undefined && { sName: body.sName }),
        ...(body.sMail !== undefined && { sMail: body.sMail }),
        ...(body.sPhone !== undefined && { sPhone: body.sPhone }),
        ...(body.sAdd !== undefined && { sAdd: body.sAdd }),
        ...(body.rName !== undefined && { rName: body.rName }),
        ...(body.rMail !== undefined && { rMail: body.rMail }),
        ...(body.rPhone !== undefined && { rPhone: body.rPhone }),
        ...(body.rAdd !== undefined && { rAdd: body.rAdd }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.weight !== undefined && { weight: body.weight }),
        ...(body.qty !== undefined && { qty: body.qty }),
        ...(body.freight !== undefined && { freight: body.freight }),
        ...(body.mode !== undefined && { mode: body.mode }),
        ...(body.pmode !== undefined && { pmode: body.pmode }),
        ...(body.pickDate !== undefined && { pickDate: body.pickDate }),
        ...(body.deptDate !== undefined && { deptDate: body.deptDate }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.product !== undefined && { product: body.product }),
        ...(body.origin !== undefined && { origin: body.origin }),
        ...(body.destination !== undefined && { destination: body.destination }),
        ...(body.lat !== undefined && { lat: body.lat }),
        ...(body.lon !== undefined && { lon: body.lon }),
      })
      .where(eq(couriersTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Update courier error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/couriers/:id
router.delete("/couriers/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  try {
    // Delete associated track updates first
    await db.delete(trackUpdatesTable).where(eq(trackUpdatesTable.consNo,
      (await db.select({ consNo: couriersTable.consNo }).from(couriersTable).where(eq(couriersTable.id, id)).limit(1))[0]?.consNo ?? ""
    ));
    await db.delete(couriersTable).where(eq(couriersTable.id, id));
    res.json({ message: "Shipment deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete courier error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db, couriersTable, officersTable, officesTable } from "@workspace/db";
import { sql, desc } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userName) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  next();
}

// GET /api/dashboard/stats
router.get("/dashboard/stats", requireAuth, async (req, res) => {
  try {
    const [[totalShipmentsRow], [inTransitRow], [deliveredRow], [totalOfficersRow], [totalOfficesRow], recentShipments] =
      await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(couriersTable),
        db.select({ count: sql<number>`count(*)::int` }).from(couriersTable).where(sql`lower(status) like '%transit%' or lower(status) like '%progress%' or lower(status) like '%shipped%'`),
        db.select({ count: sql<number>`count(*)::int` }).from(couriersTable).where(sql`lower(status) like '%deliver%'`),
        db.select({ count: sql<number>`count(*)::int` }).from(officersTable),
        db.select({ count: sql<number>`count(*)::int` }).from(officesTable),
        db.select().from(couriersTable).orderBy(desc(couriersTable.id)).limit(5),
      ]);

    res.json({
      totalShipments: totalShipmentsRow?.count ?? 0,
      inTransit: inTransitRow?.count ?? 0,
      delivered: deliveredRow?.count ?? 0,
      totalOfficers: totalOfficersRow?.count ?? 0,
      totalOffices: totalOfficesRow?.count ?? 0,
      recentShipments,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

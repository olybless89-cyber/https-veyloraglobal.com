import { pgTable, serial, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const couriersTable = pgTable("couriers", {
  id: serial("id").primaryKey(),
  consNo: varchar("cons_no", { length: 30 }).notNull().unique(),
  sName: varchar("s_name", { length: 100 }).notNull(),
  sMail: varchar("s_mail", { length: 100 }).notNull(),
  sPhone: varchar("s_phone", { length: 30 }).notNull(),
  sAdd: varchar("s_add", { length: 200 }).notNull(),
  rName: varchar("r_name", { length: 100 }).notNull(),
  rMail: varchar("r_mail", { length: 100 }).notNull(),
  rPhone: varchar("r_phone", { length: 30 }).notNull(),
  rAdd: varchar("r_add", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  weight: varchar("weight", { length: 20 }).notNull(),
  invoiceNo: varchar("invoice_no", { length: 30 }).notNull(),
  qty: integer("qty").notNull().default(1),
  freight: varchar("freight", { length: 50 }).notNull(),
  mode: varchar("mode", { length: 30 }).notNull(),
  pmode: varchar("pmode", { length: 40 }).notNull(),
  pickDate: varchar("pick_date", { length: 100 }).notNull(),
  deptDate: varchar("dept_date", { length: 100 }).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  product: varchar("product", { length: 100 }).notNull(),
  origin: varchar("origin", { length: 100 }).notNull(),
  destination: varchar("destination", { length: 100 }).notNull(),
  lat: varchar("lat", { length: 255 }).notNull().default(""),
  lon: varchar("lon", { length: 255 }).notNull().default(""),
});

export const insertCourierSchema = createInsertSchema(couriersTable).omit({ id: true });
export type InsertCourier = z.infer<typeof insertCourierSchema>;
export type Courier = typeof couriersTable.$inferSelect;

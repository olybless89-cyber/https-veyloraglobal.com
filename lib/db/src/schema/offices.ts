import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const officesTable = pgTable("offices", {
  id: serial("id").primaryKey(),
  offName: varchar("off_name", { length: 100 }).notNull(),
  address: varchar("address", { length: 230 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phNo: varchar("ph_no", { length: 30 }).notNull(),
  officeTime: varchar("office_time", { length: 100 }).notNull(),
  contactPerson: varchar("contact_person", { length: 100 }).notNull(),
});

export const insertOfficeSchema = createInsertSchema(officesTable).omit({ id: true });
export type InsertOffice = z.infer<typeof insertOfficeSchema>;
export type Office = typeof officesTable.$inferSelect;

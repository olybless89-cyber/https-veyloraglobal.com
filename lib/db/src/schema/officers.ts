import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const officersTable = pgTable("officers", {
  id: serial("id").primaryKey(),
  officerName: varchar("officer_name", { length: 60 }).notNull().unique(),
  offPwd: varchar("off_pwd", { length: 100 }).notNull(),
  address: varchar("address", { length: 250 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phNo: varchar("ph_no", { length: 20 }).notNull(),
  office: varchar("office", { length: 100 }).notNull(),
  regDate: timestamp("reg_date").notNull().defaultNow(),
});

export const insertOfficerSchema = createInsertSchema(officersTable).omit({ id: true, regDate: true });
export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type Officer = typeof officersTable.$inferSelect;

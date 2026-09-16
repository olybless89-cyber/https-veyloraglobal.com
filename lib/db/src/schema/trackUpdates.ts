import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trackUpdatesTable = pgTable("track_updates", {
  id: serial("id").primaryKey(),
  cid: integer("cid").notNull().default(0),
  consNo: varchar("cons_no", { length: 30 }).notNull(),
  updateDate: varchar("update_date", { length: 60 }).notNull(),
  currentCity: varchar("current_city", { length: 100 }).notNull(),
  newStatus: varchar("new_status", { length: 300 }).notNull(),
  comments: varchar("comments", { length: 500 }).notNull(),
  currentLocation: varchar("current_location", { length: 300 }).notNull(),
  bkTime: varchar("bk_time", { length: 60 }).notNull(),
  rName: varchar("r_name", { length: 255 }).notNull().default(""),
  rPhone: varchar("r_phone", { length: 255 }).notNull().default(""),
  rMail: varchar("r_mail", { length: 255 }).notNull().default(""),
  rAdd: varchar("r_add", { length: 255 }).notNull().default(""),
});

export const insertTrackUpdateSchema = createInsertSchema(trackUpdatesTable).omit({ id: true });
export type InsertTrackUpdate = z.infer<typeof insertTrackUpdateSchema>;
export type TrackUpdate = typeof trackUpdatesTable.$inferSelect;

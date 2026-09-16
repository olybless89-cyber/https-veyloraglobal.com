import { pgTable, serial, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// A simple two-way email log: inbound messages received via the Resend
// Inbound webhook, and outbound replies sent by admins from the Inbox.
// Messages are grouped into a "thread" per external counterpart address
// (lowercased, trimmed) so the admin Inbox can show a conversation view
// without needing to parse MIME In-Reply-To/References headers.
export const emailsTable = pgTable("emails", {
  id: serial("id").primaryKey(),
  direction: varchar("direction", { length: 10 }).notNull(), // "inbound" | "outbound"
  fromAddress: varchar("from_address", { length: 255 }).notNull(),
  toAddress: varchar("to_address", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull().default(""),
  textBody: text("text_body").notNull().default(""),
  htmlBody: text("html_body").notNull().default(""),
  messageId: varchar("message_id", { length: 255 }).notNull().default(""),
  threadId: varchar("thread_id", { length: 255 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEmailSchema = createInsertSchema(emailsTable).omit({ id: true, createdAt: true });
export type InsertEmail = z.infer<typeof insertEmailSchema>;
export type Email = typeof emailsTable.$inferSelect;

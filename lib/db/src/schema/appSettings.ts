import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const appSettingsTable = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
});

export type AppSetting = typeof appSettingsTable.$inferSelect;

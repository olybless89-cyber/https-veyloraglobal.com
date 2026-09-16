// Central helper for the admin-editable site settings, backed by the
// generic `app_settings` key/value table. Every getter falls back to an
// env var (so existing Railway-configured deployments keep working
// unchanged) and ultimately to a hardcoded default so the public site
// never renders blank/broken content before an admin fills anything in.
import { db } from "@workspace/db";
import { appSettingsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";

export async function getSetting(key: string, envFallback?: string): Promise<string | undefined> {
  try {
    const [row] = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, key))
      .limit(1);
    if (row && row.value !== "") return row.value;
  } catch {
    // fall through to env fallback below
  }
  return envFallback;
}

/** Batch fetch — one query instead of N. Returns a map of key -> stored value (only for keys that have a non-empty row). */
export async function getSettingsMap(keys: string[]): Promise<Record<string, string>> {
  if (keys.length === 0) return {};
  try {
    const rows = await db
      .select()
      .from(appSettingsTable)
      .where(inArray(appSettingsTable.key, keys));
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row.value !== "") map[row.key] = row.value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const [existing] = await db
    .select()
    .from(appSettingsTable)
    .where(eq(appSettingsTable.key, key))
    .limit(1);

  if (existing) {
    await db.update(appSettingsTable).set({ value }).where(eq(appSettingsTable.key, key));
  } else {
    await db.insert(appSettingsTable).values({ key, value });
  }
}

/** Writes multiple keys in one call. Skips any key whose value is `undefined` (as opposed to an empty string, which is a valid "clear this field" write). */
export async function setSettings(entries: Record<string, string | undefined>): Promise<void> {
  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined) continue;
    await setSetting(key, value);
  }
}

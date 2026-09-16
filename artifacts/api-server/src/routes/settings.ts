import { Router } from "express";
import { getSettingsMap } from "../lib/settings";
import { PUBLIC_GROUPS, SETTINGS_FIELDS } from "../lib/settingsFields";

const router = Router();

const publicKeys = SETTINGS_FIELDS.filter((f) => PUBLIC_GROUPS.includes(f.group)).map((f) => f.key);

// GET /api/settings/public — unauthenticated, non-secret site settings
// (company info, theme colors, SEO) consumed by the public frontend.
// Every key always resolves to a value: the stored setting, or the
// hardcoded default, so the site never renders blank company info.
router.get("/settings/public", async (_req, res) => {
  try {
    const stored = await getSettingsMap(publicKeys);
    const result: Record<string, string> = {};
    for (const field of SETTINGS_FIELDS) {
      if (!PUBLIC_GROUPS.includes(field.group)) continue;
      result[field.key] = stored[field.key] ?? field.default;
    }
    res.json(result);
  } catch (err) {
    // Never let a settings-fetch failure break the public site — fall
    // back to defaults for every field.
    const result: Record<string, string> = {};
    for (const field of SETTINGS_FIELDS) {
      if (!PUBLIC_GROUPS.includes(field.group)) continue;
      result[field.key] = field.default;
    }
    res.json(result);
  }
});

export default router;

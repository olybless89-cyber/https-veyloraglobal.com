import { Router } from "express";
import { getSettingsMap, setSettings } from "../lib/settings";
import { SETTINGS_FIELDS, fieldByKey, type SettingGroup } from "../lib/settingsFields";

const router = Router();

const ALL_KEYS = SETTINGS_FIELDS.map((f) => f.key);

// GET /api/admin/settings — auth-protected. Returns every field grouped,
// with `secret` fields never sent back in plaintext: once a secret has a
// stored value, its `value` comes back as an empty string and `hasValue`
// is true, so the admin UI can show "configured, leave blank to keep"
// instead of ever re-displaying the key.
router.get("/admin/settings", async (req, res) => {
  if (!req.session.userName) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  try {
    const stored = await getSettingsMap(ALL_KEYS);
    const groups: Record<SettingGroup, Array<{
      key: string;
      label: string;
      secret: boolean;
      value: string;
      hasValue: boolean;
    }>> = { general: [], branding: [], integrations: [], seo: [] };

    for (const field of SETTINGS_FIELDS) {
      const storedValue = stored[field.key];
      const hasValue = storedValue !== undefined && storedValue !== "";
      groups[field.group].push({
        key: field.key,
        label: field.label,
        secret: field.secret,
        // Non-secret fields: show the effective value (stored, or default
        // pre-filled so the form isn't blank). Secret fields: never echo
        // the real value back once it's set.
        value: field.secret ? "" : (storedValue ?? field.default),
        hasValue: field.secret ? hasValue : true,
      });
    }

    res.json(groups);
  } catch (err) {
    req.log.error({ err }, "Failed to load settings");
    res.status(500).json({ error: "Failed to load settings" });
  }
});

// PUT /api/admin/settings — auth-protected. Body: partial map of
// key -> value. Non-secret fields: any value (including "") is written
// verbatim. Secret fields: an empty/missing value means "leave
// unchanged" (never clears a stored key to blank by accident).
router.put("/admin/settings", async (req, res) => {
  if (!req.session.userName) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const body = req.body as Record<string, unknown>;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const toWrite: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(body)) {
    const field = fieldByKey(key);
    if (!field) continue; // ignore unknown keys rather than erroring
    if (typeof rawValue !== "string") continue;
    if (field.secret && rawValue === "") continue; // "leave unchanged"
    toWrite[key] = rawValue;
  }

  try {
    await setSettings(toWrite);
    res.json({ success: true, updated: Object.keys(toWrite) });
  } catch (err) {
    req.log.error({ err }, "Failed to save settings");
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;

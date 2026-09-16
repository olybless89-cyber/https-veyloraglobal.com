import { Router } from "express";
import { db } from "@workspace/db";
import { officersTable, appSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    userName: string;
    userRole: string;
  }
}

const router = Router();

async function getAdminPassword(): Promise<string> {
  try {
    const [setting] = await db
      .select()
      .from(appSettingsTable)
      .where(eq(appSettingsTable.key, "admin_password"))
      .limit(1);
    return setting?.value ?? "admin";
  } catch {
    return "admin";
  }
}

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  // Super-admin: check DB-stored password (falls back to "admin" if never changed)
  if (username === "admin") {
    try {
      const adminPassword = await getAdminPassword();
      if (password === adminPassword) {
        req.session.userName = "admin";
        req.session.userRole = "admin";
        res.json({ success: true, username: "admin", role: "admin" });
        return;
      }
      res.status(401).json({ error: "Invalid credentials. Please try again." });
      return;
    } catch (err) {
      req.log.error({ err }, "Admin login error");
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  // Check officers table
  try {
    const [officer] = await db
      .select()
      .from(officersTable)
      .where(eq(officersTable.officerName, username))
      .limit(1);

    if (!officer || officer.offPwd !== password) {
      res.status(401).json({ error: "Invalid credentials. Please try again." });
      return;
    }

    req.session.userName = officer.officerName;
    req.session.userRole = "officer";
    res.json({ success: true, username: officer.officerName, role: "officer" });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/logout
router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

// GET /api/auth/session
router.get("/auth/session", (req, res) => {
  if (req.session.userName) {
    res.json({
      authenticated: true,
      username: req.session.userName,
      role: req.session.userRole,
    });
  } else {
    res.json({ authenticated: false, username: null, role: null });
  }
});

// PUT /api/auth/change-password
router.put("/auth/change-password", async (req, res) => {
  if (!req.session.userName) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new password are required" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }

  try {
    if (req.session.userRole === "admin") {
      // Verify current admin password
      const adminPassword = await getAdminPassword();
      if (currentPassword !== adminPassword) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
      // Update or insert admin password setting
      const [existing] = await db
        .select()
        .from(appSettingsTable)
        .where(eq(appSettingsTable.key, "admin_password"))
        .limit(1);

      if (existing) {
        await db
          .update(appSettingsTable)
          .set({ value: newPassword })
          .where(eq(appSettingsTable.key, "admin_password"));
      } else {
        await db
          .insert(appSettingsTable)
          .values({ key: "admin_password", value: newPassword });
      }

      res.json({ success: true });
    } else {
      // Officer: verify and update in officers table
      const [officer] = await db
        .select()
        .from(officersTable)
        .where(eq(officersTable.officerName, req.session.userName))
        .limit(1);

      if (!officer || officer.offPwd !== currentPassword) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      await db
        .update(officersTable)
        .set({ offPwd: newPassword })
        .where(eq(officersTable.id, officer.id));

      res.json({ success: true });
    }
  } catch (err) {
    req.log.error({ err }, "Change password error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

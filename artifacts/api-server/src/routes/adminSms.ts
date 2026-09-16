import { Router } from "express";
import { sendSms } from "../lib/sms";

const router = Router();

// POST /api/admin/send-sms  (auth-protected)
router.post("/admin/send-sms", async (req, res) => {
  if (!req.session.userName) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { to, message } = req.body as {
    to?: string;
    message?: string;
  };

  if (!to || !message) {
    res.status(400).json({ error: "Recipient phone number and message are required" });
    return;
  }

  const phoneRegex = /^\+?[0-9\s-]{7,20}$/;
  if (!phoneRegex.test(to)) {
    res.status(400).json({ error: "Invalid recipient phone number" });
    return;
  }

  try {
    const { provider } = await sendSms(to, message);
    req.log.info({ to, provider, sentBy: req.session.userName }, "Admin SMS sent");
    res.json({ success: true, message: `SMS sent to ${to} via ${provider === "termii" ? "Termii" : "Twilio"}` });
  } catch (err) {
    req.log.error({ err }, "Failed to send admin SMS");
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to send SMS. Please try again.",
    });
  }
});

export default router;

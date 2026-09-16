import { Router } from "express";
import { sendEmail } from "../lib/resend";

const router = Router();

// POST /api/admin/send-email  (auth-protected)
router.post("/admin/send-email", async (req, res) => {
  if (!req.session.userName) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { to, subject, message } = req.body as {
    to?: string;
    subject?: string;
    message?: string;
  };

  if (!to || !subject || !message) {
    res.status(400).json({ error: "To, subject, and message are required" });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    res.status(400).json({ error: "Invalid recipient email address" });
    return;
  }

  try {
    const html = `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#1a1a2e">
        <div style="background:#1a1a2e;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:#ffffff;margin:0;font-size:20px">Veylora Global</h2>
          <p style="color:#9ca3af;margin:4px 0 0;font-size:13px">Fast. Reliable. Everywhere.</p>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;line-height:1.7;font-size:15px;color:#374151;white-space:pre-wrap">${message}</div>
        <div style="background:#f3f4f6;padding:16px 32px;border-radius:0 0 8px 8px;font-size:12px;color:#9ca3af;border:1px solid #e5e7eb;border-top:none;text-align:center">
          📞 +1 (800) 555-0199 &nbsp;|&nbsp; 📧 support@veyloraglobal.com<br/>
          © 2024 Veylora Global. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail(to, subject, html);

    req.log.info({ to, subject, sentBy: req.session.userName }, "Admin email sent");
    res.json({ success: true, message: `Email sent to ${to}` });
  } catch (err) {
    req.log.error({ err }, "Failed to send admin email");
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

export default router;

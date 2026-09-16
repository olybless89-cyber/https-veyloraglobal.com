import { Router } from "express";
import { Resend } from "resend";
import type { WebhookEventPayload } from "resend";
import { db, emailsTable } from "@workspace/db";
import { getSettingsMap } from "../lib/settings";

const router = Router();

// POST /api/webhooks/resend-inbound — public (no session auth: Resend
// calls this directly), but every request is verified against the
// signing secret before anything is trusted or written to the DB.
//
// Setup (one-time, in the Resend dashboard): Emails -> Receiving -> add
// your receiving domain/address, then Webhooks -> Add Webhook, select
// the `email.received` event, point it at
// `https://<your-deployed-domain>/api/webhooks/resend-inbound`, and copy
// the signing secret (starts with `whsec_`) into
// Admin -> Settings -> Integrations -> "Resend Inbound Webhook Secret".
//
// Resend's inbound webhook payload only carries metadata (sender,
// recipient, subject) — the actual body is fetched separately via the
// Receiving API once we know the email's id.
router.post("/webhooks/resend-inbound", async (req, res) => {
  try {
    const settings = await getSettingsMap(["resend_webhook_secret", "resend_api_key"]);
    const webhookSecret = settings.resend_webhook_secret ?? process.env.RESEND_WEBHOOK_SECRET;
    const apiKey = settings.resend_api_key ?? process.env.RESEND_API_KEY;

    if (!webhookSecret || !apiKey) {
      req.log.warn(
        "Inbound email webhook received but Resend isn't fully configured (need both API key and webhook secret) — ignoring.",
      );
      res.status(503).json({ error: "Inbound email is not configured yet" });
      return;
    }

    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
    if (!rawBody) {
      res.status(400).json({ error: "Missing request body" });
      return;
    }

    const resend = new Resend(apiKey);

    let event: WebhookEventPayload;
    try {
      event = resend.webhooks.verify({
        payload: rawBody.toString("utf8"),
        headers: {
          id: req.header("svix-id") ?? "",
          timestamp: req.header("svix-timestamp") ?? "",
          signature: req.header("svix-signature") ?? "",
        },
        webhookSecret,
      });
    } catch (err) {
      req.log.warn({ err }, "Inbound webhook signature verification failed");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    if (event.type !== "email.received") {
      // Some other webhook event (delivery/bounce/etc) hitting this same
      // endpoint by mistake — acknowledge and ignore rather than error.
      res.status(200).json({ ignored: true });
      return;
    }

    const emailId = event.data.email_id;
    if (!emailId) {
      res.status(200).json({ ignored: true, reason: "no email_id in payload" });
      return;
    }

    const fromAddress = event.data.from ?? "";
    const toAddress = event.data.to?.[0] ?? "";
    const subject = event.data.subject || "(no subject)";

    // Fetch the full body — the webhook payload itself is metadata-only.
    let text = "";
    let html = "";
    try {
      const full = await resend.emails.receiving.get(emailId);
      const fullData = (full as { data?: { text?: string; html?: string } })?.data ?? {};
      text = fullData.text ?? "";
      html = fullData.html ?? "";
    } catch (err) {
      req.log.error({ err, emailId }, "Failed to fetch full inbound email body from Resend");
      // Still record the message with subject/from/to even if the body
      // fetch failed — better than losing the notification entirely.
    }

    await db.insert(emailsTable).values({
      direction: "inbound",
      fromAddress,
      toAddress,
      subject,
      textBody: text,
      htmlBody: html,
      messageId: emailId,
      threadId: fromAddress.toLowerCase().trim(),
      isRead: false,
    });

    req.log.info({ from: fromAddress, subject }, "Inbound email received and stored");
    res.status(200).json({ received: true });
  } catch (err) {
    req.log.error({ err }, "Inbound webhook processing failed");
    // A 500 tells Resend to retry — appropriate for a transient failure
    // (e.g. DB hiccup) as opposed to a bad signature (401, no retry).
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;

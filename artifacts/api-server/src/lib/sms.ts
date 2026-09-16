// SMS notifications, routed to a local (Nigerian) or international provider
// depending on the recipient's number.
//
// Local numbers (+234 / 0-prefixed Nigerian mobile numbers) go through Termii,
// everything else goes through Twilio. Credentials are read from the admin
// Settings (Integrations tab) first, falling back to env vars:
//   TERMII_API_KEY, TERMII_SENDER_ID (optional, defaults to "Veylora")
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
import { getSettingsMap } from "./settings";

export type SmsProvider = "termii" | "twilio";

export function isNigerianNumber(phone: string): boolean {
  const p = phone.replace(/[\s-]/g, "");
  return p.startsWith("+234") || p.startsWith("234") || /^0(7|8|9)\d{9}$/.test(p);
}

function toTermiiFormat(phone: string): string {
  let p = phone.replace(/[\s-]/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "234" + p.slice(1);
  return p;
}

async function sendViaTermii(to: string, message: string): Promise<void> {
  const settings = await getSettingsMap(["termii_api_key", "termii_sender_id"]);
  const apiKey = settings.termii_api_key ?? process.env.TERMII_API_KEY;
  if (!apiKey) {
    throw new Error("Termii API key is not configured. Set it in Admin → Settings → Integrations.");
  }
  const senderId = settings.termii_sender_id ?? process.env.TERMII_SENDER_ID ?? "Veylora";

  const response = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: toTermiiFormat(to),
      from: senderId,
      sms: message,
      type: "plain",
      channel: "generic",
      api_key: apiKey,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Termii API error ${response.status}: ${body}`);
  }

  try {
    const data = JSON.parse(body);
    if (data?.code && data.code !== "ok") {
      throw new Error(`Termii send failed: ${body}`);
    }
  } catch {
    // Non-JSON success response from Termii — treat as delivered.
  }
}

async function sendViaTwilio(to: string, message: string): Promise<void> {
  const settings = await getSettingsMap(["twilio_account_sid", "twilio_auth_token", "twilio_from_number"]);
  const accountSid = settings.twilio_account_sid ?? process.env.TWILIO_ACCOUNT_SID;
  const authToken = settings.twilio_auth_token ?? process.env.TWILIO_AUTH_TOKEN;
  const from = settings.twilio_from_number ?? process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) {
    throw new Error(
      "Twilio Account SID, Auth Token and From Number must be configured in Admin → Settings → Integrations.",
    );
  }

  const params = new URLSearchParams({ To: to, From: from, Body: message });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Twilio API error ${response.status}: ${body}`);
  }
}

/**
 * Sends an SMS, automatically routing to Termii for Nigerian numbers and
 * Twilio for everything else. Throws if the chosen provider isn't
 * configured or the send fails — callers that treat SMS as best-effort
 * (e.g. status-update notifications) should catch and log rather than
 * let this fail the surrounding request.
 */
export async function sendSms(
  to: string,
  message: string,
): Promise<{ provider: SmsProvider }> {
  const trimmed = to.trim();
  if (!trimmed) {
    throw new Error("Recipient phone number is required");
  }

  const provider: SmsProvider = isNigerianNumber(trimmed) ? "termii" : "twilio";

  if (provider === "termii") {
    await sendViaTermii(trimmed, message);
  } else {
    await sendViaTwilio(trimmed, message);
  }

  return { provider };
}

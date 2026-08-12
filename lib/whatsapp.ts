import Message from "./models/Message";
import type { BookingDoc } from "./models/Booking";

/**
 * Meta WhatsApp Cloud API service.
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Business-initiated messages (booking created / approved outside the 24h
 * window) MUST use pre-approved templates. Admin chat replies can stay plain
 * text once the customer has messaged (24h window).
 *
 * Templates in WhatsApp Manager (Utility, language en):
 *   booking_received  — sent when booking is created
 *   booking_confirmed — sent when admin approves
 */

const API_VERSION = "v20.0";

function config() {
  return {
    enabled: process.env.WHATSAPP_ENABLED === "true",
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    farmName: process.env.FARMHOUSE_NAME || "Vicky Farmhouse",
    locationUrl: process.env.FARMHOUSE_LOCATION_URL || "",
    contact: process.env.FARMHOUSE_CONTACT || "",
    templateLang: process.env.WHATSAPP_TEMPLATE_LANG || "en",
    // "false" forces plain text (only works in the 24h window / test numbers)
    useTemplates: process.env.WHATSAPP_USE_TEMPLATES !== "false",
    tplCreated: process.env.WHATSAPP_TEMPLATE_BOOKING_CREATED || "booking_received",
    tplApproved: process.env.WHATSAPP_TEMPLATE_BOOKING_APPROVED || "booking_confirmed",
    // Public site URL, e.g. https://vickyfarmhouse.com (no trailing slash)
    frontendUrl: (process.env.FRONTEND_URL || "").replace(/\/$/, ""),
    // Flip to "true" ONLY after booking_received is re-approved with {{8}} =
    // tracking link, otherwise the param count won't match and sends will fail.
    createdHasLink: process.env.WHATSAPP_CREATED_TEMPLATE_HAS_LINK === "true",
  };
}

async function logOutgoing(to: string, body: string, waMessageId = "") {
  try {
    await Message.create({
      whatsapp: to,
      direction: "out",
      body,
      read: true,
      waMessageId,
    });
  } catch (err) {
    console.error("Failed to log outgoing message:", (err as Error).message);
  }
}

async function graphPost(payload: Record<string, unknown>) {
  const cfg = config();
  const url = `https://graph.facebook.com/${API_VERSION}/${cfg.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      (data as { error?: { message?: string } })?.error?.message ||
      `HTTP ${res.status}`;
    throw new Error(detail);
  }
  return data as { messages?: Array<{ id: string }> };
}

export async function sendText(to: string, body: string) {
  const cfg = config();
  if (!cfg.enabled) {
    console.log(`[whatsapp:disabled] to=${to}\n${body}`);
    await logOutgoing(to, body);
    return { skipped: true };
  }
  try {
    const data = await graphPost({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    });
    await logOutgoing(to, body, data?.messages?.[0]?.id || "");
    return data;
  } catch (err) {
    console.error("WhatsApp send failed:", (err as Error).message);
    return { error: true, detail: (err as Error).message };
  }
}

/**
 * Send an approved template.
 * `params` = ordered body variables matching {{1}}, {{2}}, ...
 */
async function sendTemplate(
  to: string,
  templateName: string,
  params: string[],
  logBody: string
) {
  const cfg = config();
  if (!cfg.enabled) {
    console.log(`[whatsapp:disabled] template=${templateName} to=${to}\n${logBody}`);
    await logOutgoing(to, logBody);
    return { skipped: true };
  }
  try {
    const data = await graphPost({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: cfg.templateLang },
        components: [
          {
            type: "body",
            parameters: params.map((text) => ({ type: "text", text: String(text) })),
          },
        ],
      },
    });
    await logOutgoing(to, logBody, data?.messages?.[0]?.id || "");
    return data;
  } catch (err) {
    console.error("WhatsApp template failed:", (err as Error).message);
    // Fallback to plain text (works in 24h window / test recipients)
    return sendText(to, logBody);
  }
}

const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function fmtTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const fmtWithTime = (d: Date | string, t?: string) =>
  t ? `${fmt(d)} at ${fmtTime(t)}` : fmt(d);

// Day shift ends the SAME day (stored checkOut is the exclusive next date)
const checkoutDisplayDate = (b: BookingDoc) =>
  b.bookingType === "shift" && b.shiftSlot !== "night" ? b.checkIn : b.checkOut;

export async function sendBookingCreated(booking: BookingDoc) {
  const cfg = config();
  const checkIn = fmtWithTime(booking.checkIn, booking.checkInTime);
  const checkOut = fmtWithTime(checkoutDisplayDate(booking), booking.checkOutTime);
  const amount = Number(booking.fee || 0).toLocaleString("en-PK");
  const trackLink = cfg.frontendUrl
    ? `${cfg.frontendUrl}/track/${booking.bookingCode}`
    : "";
  const logBody =
    `Assalam o Alaikum ${booking.name}!\n\n` +
    `Your booking request at *${cfg.farmName}* has been received and is *waiting for approval*.\n\n` +
    `Booking ID: *${booking.bookingCode}*\n` +
    `Check-in: ${checkIn}\n` +
    `Check-out: ${checkOut}\n` +
    `Guests: ${booking.guests}\n\n` +
    `Please send the amount of ${amount} Rs.\n` +
    (trackLink ? `Track your booking: ${trackLink}\n` : "") +
    `We will notify you once it is approved. Keep your Booking ID safe.`;

  if (cfg.useTemplates) {
    // booking_received: {{1}} name, {{2}} farm, {{3}} id, {{4}} check-in,
    // {{5}} check-out, {{6}} guests, {{7}} amount, {{8}} tracking link (opt-in)
    const params = [
      booking.name,
      cfg.farmName,
      booking.bookingCode,
      checkIn,
      checkOut,
      String(booking.guests),
      amount,
    ];
    if (cfg.createdHasLink) params.push(trackLink || "our website");
    return sendTemplate(booking.whatsapp, cfg.tplCreated, params, logBody);
  }
  return sendText(booking.whatsapp, logBody);
}

export async function sendBookingApproved(booking: BookingDoc) {
  const cfg = config();
  const checkIn = fmtWithTime(booking.checkIn, booking.checkInTime);
  const checkOut = fmtWithTime(checkoutDisplayDate(booking), booking.checkOutTime);
  const logBody =
    `Great news ${booking.name}!\n\n` +
    `Your booking at *${cfg.farmName}* is *CONFIRMED*.\n\n` +
    `Booking ID: *${booking.bookingCode}*\n` +
    `Check-in: ${checkIn}\n` +
    `Check-out: ${checkOut}\n` +
    `Guests: ${booking.guests}\n\n` +
    `Location: ${cfg.locationUrl}\n` +
    `Contact: ${cfg.contact}\n` +
    `Please arrive on time and show this message at entry.`;

  if (cfg.useTemplates) {
    // booking_confirmed: {{1}} check-in, {{2}} check-out
    return sendTemplate(booking.whatsapp, cfg.tplApproved, [checkIn, checkOut], logBody);
  }
  return sendText(booking.whatsapp, logBody);
}

export async function sendBookingRejected(booking: BookingDoc) {
  const cfg = config();
  const body =
    `Dear ${booking.name},\n\n` +
    `Unfortunately your booking request *${booking.bookingCode}* at ${cfg.farmName} could not be approved` +
    (booking.adminNote ? ` (reason: ${booking.adminNote})` : "") +
    `.\n\nYou are welcome to try different dates.\nContact: ${cfg.contact}`;
  return sendText(booking.whatsapp, body);
}

export async function sendBookingCancelled(booking: BookingDoc) {
  const cfg = config();
  const body =
    `Dear ${booking.name},\n\n` +
    `Your previously confirmed booking *${booking.bookingCode}* at ${cfg.farmName} has been *cancelled*` +
    (booking.adminNote ? ` (reason: ${booking.adminNote})` : "") +
    `.\n\nWe apologize for the inconvenience. Please contact us to rebook.\nContact: ${cfg.contact}`;
  return sendText(booking.whatsapp, body);
}

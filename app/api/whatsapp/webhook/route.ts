import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Cloud API webhook.
 * Meta App Dashboard -> WhatsApp -> Configuration:
 *   Callback URL:  https://vickyfarmhouse.com/api/whatsapp/webhook
 *   Verify token:  WHATSAPP_WEBHOOK_VERIFY_TOKEN
 * Subscribe to the "messages" webhook field.
 */

/** GET — one-time verification handshake from Meta */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("WhatsApp webhook verified");
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

interface WaMessage {
  from: string;
  id?: string;
  type: string;
  text?: { body?: string };
  button?: { text?: string };
  interactive?: {
    button_reply?: { title?: string };
    list_reply?: { title?: string };
  };
}

function extractBody(msg: WaMessage): string {
  if (msg.type === "text") return msg.text?.body || "";
  if (msg.type === "button") return msg.button?.text || "";
  if (msg.type === "interactive") {
    return (
      msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || ""
    );
  }
  return `[${msg.type} message]`;
}

/**
 * POST — incoming messages and status updates.
 *
 * The Express version acked first and processed afterwards. On serverless the
 * function is frozen once a response is returned, so the work has to finish
 * first. A single insert is well inside Meta's timeout. Errors are swallowed
 * so we always return 200 — Meta disables webhooks that look flaky.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    await dbConnect();

    for (const entry of payload?.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const contacts: Array<{ wa_id?: string; profile?: { name?: string } }> =
          value.contacts || [];

        for (const msg of (value.messages || []) as WaMessage[]) {
          const body = extractBody(msg);
          if (!body) continue;

          const profileName =
            contacts.find((c) => c.wa_id === msg.from)?.profile?.name || "";

          try {
            await Message.create({
              whatsapp: msg.from,
              direction: "in",
              body,
              profileName,
              waMessageId: msg.id || "",
            });
          } catch (err) {
            // 11000 = duplicate webhook delivery, safe to ignore
            if ((err as { code?: number }).code !== 11000) throw err;
          }
        }
      }
    }
  } catch (err) {
    console.error("Webhook processing failed:", (err as Error).message);
  }

  return new NextResponse(null, { status: 200 });
}

import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import { requireAdmin } from "@/lib/adminAuth";
import { sendText } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ whatsapp: string }> };

/** GET — full thread (marks incoming messages as read) */
export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const { whatsapp } = await params;

    const messages = await Message.find({ whatsapp }).sort({ createdAt: 1 }).limit(500);
    await Message.updateMany({ whatsapp, direction: "in", read: false }, { read: true });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("GET conversations/[whatsapp]/messages failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST — admin reply */
export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const { whatsapp } = await params;
    const payload = await req.json().catch(() => ({}));
    const body = String(payload?.body || "").trim();

    if (!body) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    const result = (await sendText(whatsapp, body)) as { error?: boolean; detail?: string };
    if (result?.error) {
      return NextResponse.json(
        { error: `WhatsApp send failed: ${result.detail || "unknown error"}` },
        { status: 502 }
      );
    }

    const message = await Message.findOne({ whatsapp, direction: "out" }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("POST conversations/[whatsapp]/messages failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

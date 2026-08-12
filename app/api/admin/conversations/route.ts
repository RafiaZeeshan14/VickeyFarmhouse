import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Message from "@/lib/models/Message";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const escapeRe = (s: string) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface ConversationRow {
  _id: string;
  lastBody: string;
  lastDirection: "in" | "out";
  lastAt: Date;
  profileName: string;
  unread: number;
}

/** GET /api/admin/conversations — one row per WhatsApp number, latest first */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const q = req.nextUrl.searchParams.get("q");

    const match: Record<string, unknown> = {};
    if (q) {
      const re = new RegExp(escapeRe(q), "i");
      match.$or = [{ whatsapp: re }, { profileName: re }, { body: re }];
    }

    const conversations = (await Message.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$whatsapp",
          lastBody: { $first: "$body" },
          lastDirection: { $first: "$direction" },
          lastAt: { $first: "$createdAt" },
          profileName: { $max: "$profileName" },
          unread: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$direction", "in"] }, { $eq: ["$read", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastAt: -1 } },
      { $limit: 100 },
    ])) as ConversationRow[];

    // Attach guest name from bookings where we have one
    const numbers = conversations.map((c) => c._id);
    const bookings = (await Booking.aggregate([
      { $match: { whatsapp: { $in: numbers } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$whatsapp", name: { $first: "$name" } } },
    ])) as Array<{ _id: string; name: string }>;
    const nameByNumber = Object.fromEntries(bookings.map((b) => [b._id, b.name]));

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        whatsapp: c._id,
        name: nameByNumber[c._id] || c.profileName || "",
        lastBody: c.lastBody,
        lastDirection: c.lastDirection,
        lastAt: c.lastAt,
        unread: c.unread,
      })),
    });
  } catch (err) {
    console.error("GET /api/admin/conversations failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

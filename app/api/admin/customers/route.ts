import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const escapeRe = (s: string) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface CustomerRow {
  _id: string;
  name: string;
  bookingsCount: number;
  approvedCount: number;
  totalFee: number;
  totalPaid: number;
  lastBookingAt: Date;
}

/** GET /api/admin/customers?q=&page=&limit= — guests grouped by WhatsApp number */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q");
    const page = Math.max(1, parseInt(sp.get("page") || "", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "", 10) || 20));

    const match: Record<string, unknown> = {};
    if (q) {
      const re = new RegExp(escapeRe(q), "i");
      match.$or = [{ name: re }, { whatsapp: re }];
    }

    const all = (await Booking.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$whatsapp",
          name: { $first: "$name" },
          bookingsCount: { $sum: 1 },
          approvedCount: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } },
          totalFee: { $sum: { $ifNull: ["$fee", 0] } },
          totalPaid: { $sum: { $ifNull: ["$amountPaid", 0] } },
          lastBookingAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastBookingAt: -1 } },
    ])) as CustomerRow[];

    const customers = all
      .slice((page - 1) * limit, (page - 1) * limit + limit)
      .map(({ _id, ...rest }) => ({ whatsapp: _id, ...rest }));

    return NextResponse.json({ customers, total: all.length, page, limit });
  } catch (err) {
    console.error("GET /api/admin/customers failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

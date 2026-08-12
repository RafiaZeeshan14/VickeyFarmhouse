import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "approved", "rejected", "cancelled"];

const escapeRe = (s: string) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** GET /api/admin/bookings?status=&q=&from=&to=&page=&limit= */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();
    const sp = req.nextUrl.searchParams;
    const status = sp.get("status");
    const q = sp.get("q");
    const from = sp.get("from");
    const to = sp.get("to");
    const page = Math.max(1, parseInt(sp.get("page") || "", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "", 10) || 20));

    const filter: Record<string, unknown> = {};
    if (status && STATUSES.includes(status)) filter.status = status;

    if (q) {
      const re = new RegExp(escapeRe(q), "i");
      filter.$or = [{ name: re }, { whatsapp: re }, { bookingCode: re }];
    }

    if (from || to) {
      const checkIn: Record<string, Date> = {};
      if (from) {
        const f = new Date(from);
        if (!Number.isNaN(f.getTime())) checkIn.$gte = f;
      }
      if (to) {
        const t = new Date(to);
        if (!Number.isNaN(t.getTime())) checkIn.$lte = t;
      }
      if (Object.keys(checkIn).length) filter.checkIn = checkIn;
    }

    type Q = Parameters<typeof Booking.find>[0];
    const [bookings, total, counts] = await Promise.all([
      Booking.find(filter as unknown as Q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(filter as unknown as Q),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const countsByStatus: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
    };
    counts.forEach((c: { _id: string; count: number }) => {
      countsByStatus[c._id] = c.count;
    });

    return NextResponse.json({
      bookings,
      total,
      page,
      limit,
      counts: {
        ...countsByStatus,
        total: Object.values(countsByStatus).reduce((a, b) => a + b, 0),
      },
    });
  } catch (err) {
    console.error("GET /api/admin/bookings failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

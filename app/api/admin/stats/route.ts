import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import Message from "@/lib/models/Message";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** GET /api/admin/stats — dashboard overview numbers + last-6-month series */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await dbConnect();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const [
      monthlyRaw,
      statusRaw,
      typeRaw,
      upcoming,
      upcomingBookings,
      recentBookings,
      totalsRaw,
      unreadMessages,
      customerNumbers,
    ] = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $ne: "rejected" } } },
        {
          $group: {
            _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
            bookings: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "approved"] },
                  { $ifNull: ["$amountPaid", 0] },
                  0,
                ],
              },
            },
          },
        },
      ]),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Booking.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$bookingType", "shift"] },
                { $cond: [{ $eq: ["$shiftSlot", "night"] }, "night", "day"] },
                "fullday",
              ],
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Booking.countDocuments({ status: "approved", checkIn: { $gte: todayStart } }),
      Booking.find({ status: "approved", checkIn: { $gte: todayStart } })
        .sort({ checkIn: 1 })
        .limit(5)
        .select(
          "bookingCode name checkIn checkInTime bookingType shiftSlot guests fee amountPaid"
        ),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("bookingCode name status createdAt bookingType shiftSlot fee amountPaid"),
      Booking.aggregate([
        { $match: { status: "approved" } },
        {
          $group: {
            _id: null,
            revenue: { $sum: { $ifNull: ["$amountPaid", 0] } },
            billed: { $sum: { $ifNull: ["$fee", 0] } },
          },
        },
      ]),
      Message.countDocuments({ direction: "in", read: false }),
      Booking.distinct("whatsapp"),
    ]);

    // Zero-filled last 6 months, oldest first
    const byKey = Object.fromEntries(
      (monthlyRaw as Array<{ _id: { y: number; m: number }; bookings: number; revenue: number }>)
        .map((m) => [`${m._id.y}-${m._id.m}`, { bookings: m.bookings, revenue: m.revenue }])
    );
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      monthly.push({
        label: MONTHS[d.getMonth()],
        bookings: byKey[key]?.bookings || 0,
        revenue: byKey[key]?.revenue || 0,
      });
    }

    const statusCounts: Record<string, number> = {
      pending: 0, approved: 0, rejected: 0, cancelled: 0,
    };
    (statusRaw as Array<{ _id: string; count: number }>).forEach((s) => {
      if (statusCounts[s._id] !== undefined) statusCounts[s._id] = s.count;
    });

    const typeCounts: Record<string, number> = { fullday: 0, day: 0, night: 0 };
    (typeRaw as Array<{ _id: string; count: number }>).forEach((t) => {
      if (typeCounts[t._id] !== undefined) typeCounts[t._id] = t.count;
    });

    const totals = (totalsRaw as Array<{ revenue: number; billed: number }>)[0];

    return NextResponse.json({
      monthly,
      statusCounts,
      typeCounts,
      upcoming,
      upcomingBookings,
      recentBookings,
      totalRevenue: totals?.revenue || 0,
      totalBilled: totals?.billed || 0,
      outstanding: Math.max(0, (totals?.billed || 0) - (totals?.revenue || 0)),
      totalBookings: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      unreadMessages,
      customerCount: (customerNumbers as string[]).length,
    });
  } catch (err) {
    console.error("GET /api/admin/stats failed:", (err as Error).message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

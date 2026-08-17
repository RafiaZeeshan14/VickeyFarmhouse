"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Banknote,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminStats, BookingStatus } from "@/lib/api";
import type { AdminTab } from "@/app/admin/AdminClient";

/* Chart palette drawn from the site: gold is the lead colour, navy the
 * secondary, and the status hues stay semantic (green approved, red rejected,
 * amber pending) so they read the same as the badges elsewhere. */
const GOLD = "#e6a334";
const NAVY = "#06233a";
const GREEN = "#5f9270";
const RED = "#dc2626";
const AMBER = "#d97706";
const SLATE = "#64748b";
const GRID = "#e4e9ee";
const AXIS = "#7a8794";
const TOOLTIP = {
  borderRadius: 8,
  border: `1px solid ${GRID}`,
  background: "#fff",
  boxShadow: "0 6px 18px rgba(6,35,58,.12)",
  padding: "6px 10px",
  fontSize: 11,
  lineHeight: 1.3,
  color: NAVY,
};
const TOOLTIP_LABEL = {
  fontSize: 10,
  fontWeight: 700,
  color: AXIS,
  marginBottom: 2,
};
const TOOLTIP_ITEM = {
  fontSize: 11,
  fontWeight: 600,
  color: NAVY,
  padding: 0,
};

const STATUS_META: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: AMBER },
  approved: { label: "Approved", color: GREEN },
  rejected: { label: "Rejected", color: RED },
  cancelled: { label: "Cancelled", color: "#9aa6b2" },
};

const TYPE_META: Record<string, { label: string; color: string }> = {
  fullday: { label: "Full day", color: NAVY },
  day: { label: "Day shift", color: GOLD },
  night: { label: "Night shift", color: SLATE },
};

const money = (value?: number) => `Rs ${Number(value || 0).toLocaleString("en-PK")}`;

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "forest",
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  tone?: "forest" | "terracotta" | "amber" | "slate";
}) {
  return (
    <article className={`dash-metric dash-metric-${tone}`}>
      <div className="dash-metric-top">
        <span className="dash-metric-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={2} />
        </span>
        <ArrowUpRight size={17} className="dash-metric-arrow" aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <span>{label}</span>
      <small>{helper}</small>
    </article>
  );
}

function PanelTitle({
  eyebrow,
  title,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="dash-panel-title">
      <div>
        <span>{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {action && (
        <button type="button" className="dash-text-action" onClick={onAction}>
          {action} <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="dashboard-overview" aria-label="Loading dashboard">
      <div className="dash-metrics-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="dash-skeleton dash-skeleton-metric" key={index} />
        ))}
      </div>
      <div className="dash-overview-grid">
        <div className="dash-skeleton dash-skeleton-chart" />
        <div className="dash-skeleton dash-skeleton-chart" />
      </div>
    </div>
  );
}

export default function AdminOverview({
  stats,
  loading,
  error,
  onNavigate,
}: {
  stats: AdminStats | null;
  loading: boolean;
  error: string;
  onNavigate: (tab: AdminTab) => void;
}) {
  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="dashboard-overview">
        <div className="dash-empty-state">
          <CircleDollarSign size={32} aria-hidden="true" />
          <h3>Analytics could not be loaded</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusData = Object.entries(stats.statusCounts || {}).map(([key, value]) => ({
    name: STATUS_META[key as BookingStatus]?.label || key,
    value,
    color: STATUS_META[key as BookingStatus]?.color || "#9aa6b2",
  }));
  const typeData = Object.entries(stats.typeCounts || {}).map(([key, value]) => ({
    name: TYPE_META[key]?.label || key,
    value,
    color: TYPE_META[key]?.color || "#9aa6b2",
  }));
  const collectionRate = stats.totalBilled
    ? Math.round((stats.totalRevenue / stats.totalBilled) * 100)
    : 0;

  return (
    <div className="dashboard-overview">
      <div className="dash-metrics-grid">
        <MetricCard
          label="Total bookings"
          value={stats.totalBookings}
          helper={`${stats.statusCounts?.pending || 0} need attention`}
          icon={CalendarCheck}
        />
        <MetricCard
          label="Collected revenue"
          value={money(stats.totalRevenue)}
          helper={`${collectionRate}% of approved billing`}
          icon={Banknote}
          tone="terracotta"
        />
        <MetricCard
          label="Outstanding"
          value={money(stats.outstanding)}
          helper="Across approved bookings"
          icon={CircleDollarSign}
          tone="amber"
        />
        <MetricCard
          label="Upcoming stays"
          value={stats.upcoming}
          helper="Approved arrivals ahead"
          icon={CalendarClock}
          tone="forest"
        />
        <MetricCard
          label="Customers"
          value={stats.customerCount}
          helper="Unique WhatsApp contacts"
          icon={Users}
          tone="slate"
        />
        <MetricCard
          label="Unread messages"
          value={stats.unreadMessages}
          helper="Open Chats to respond"
          icon={MessageCircle}
          tone="terracotta"
        />
      </div>

      <div className="dash-overview-grid">
        <section className="dash-panel dash-panel-wide">
          <PanelTitle eyebrow="Performance" title="Bookings & revenue trend" />
          <div className="dash-chart dash-chart-large">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthly} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.34} />
                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: AXIS, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fill: AXIS, fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ stroke: GOLD, strokeDasharray: "3 3" }}
                  contentStyle={TOOLTIP}
                  labelStyle={TOOLTIP_LABEL}
                  itemStyle={TOOLTIP_ITEM}
                  wrapperStyle={{ outline: "none", zIndex: 20 }}
                  formatter={(value, name) => [
                    name === "revenue" ? money(Number(value)) : String(value ?? ""),
                    name === "revenue" ? "Collected" : "Bookings",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={GOLD}
                  strokeWidth={3}
                  fill="url(#bookingsFill)"
                  activeDot={{ r: 5, fill: NAVY, stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="dash-revenue-strip">
            {stats.monthly.map((month) => (
              <span key={month.label}>
                <small>{month.label} collected</small>
                <strong>{money(month.revenue)}</strong>
              </span>
            ))}
          </div>
        </section>

        <section className="dash-panel">
          <PanelTitle eyebrow="Pipeline" title="Booking status" />
          <div className="dash-donut-wrap">
            <div className="dash-chart dash-chart-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TOOLTIP}
                    labelStyle={TOOLTIP_LABEL}
                    itemStyle={TOOLTIP_ITEM}
                    wrapperStyle={{ outline: "none", zIndex: 20 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="dash-donut-center">
                <strong>{stats.totalBookings}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="dash-legend">
              {statusData.map((item) => (
                <div key={item.name}>
                  <i style={{ background: item.color }} />
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dash-panel">
          <PanelTitle eyebrow="Demand" title="Booking mix" />
          <div className="dash-chart dash-chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} layout="vertical" margin={{ left: 8, right: 18 }}>
                <CartesianGrid stroke={GRID} horizontal={false} strokeDasharray="3 5" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={76}
                  tick={{ fill: AXIS, fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f6f8fa" }}
                  contentStyle={TOOLTIP}
                  labelStyle={TOOLTIP_LABEL}
                  itemStyle={TOOLTIP_ITEM}
                  wrapperStyle={{ outline: "none", zIndex: 20 }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={22}>
                  {typeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="dash-panel dash-panel-list">
          <PanelTitle
            eyebrow="Next up"
            title="Upcoming arrivals"
            action="View bookings"
            onAction={() => onNavigate("bookings")}
          />
          <div className="dash-activity-list">
            {(stats.upcomingBookings || []).map((booking) => (
              <div className="dash-activity-item" key={booking._id}>
                <span className="dash-activity-icon">
                  <CalendarClock size={18} aria-hidden="true" />
                </span>
                <div>
                  <strong>{booking.name}</strong>
                  <span>
                    {booking.bookingCode} · {booking.guests} guests
                  </span>
                </div>
                <time>
                  {new Date(booking.checkIn).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
            ))}
            {!stats.upcomingBookings?.length && (
              <div className="dash-mini-empty">No approved arrivals scheduled yet.</div>
            )}
          </div>
        </section>

        <section className="dash-panel dash-panel-list">
          <PanelTitle
            eyebrow="Live feed"
            title="Recent activity"
            action="Manage"
            onAction={() => onNavigate("bookings")}
          />
          <div className="dash-activity-list">
            {(stats.recentBookings || []).map((booking) => (
              <div className="dash-activity-item" key={booking._id}>
                <span className={`dash-activity-icon is-${booking.status}`}>
                  {booking.status === "approved" ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : (
                    <Clock3 size={18} aria-hidden="true" />
                  )}
                </span>
                <div>
                  <strong>{booking.name}</strong>
                  <span>
                    {booking.bookingCode} · {STATUS_META[booking.status]?.label || booking.status}
                  </span>
                </div>
                <time>
                  {new Date(booking.createdAt || "").toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

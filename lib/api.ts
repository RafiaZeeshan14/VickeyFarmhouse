import type { Pricing, ShiftSlot } from "./pricing";

/**
 * The booking API now lives in this app's own route handlers, so every call is
 * same-origin — no base URL, no CORS.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options;
  const res = await fetch(path, {
    ...rest,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return data as T;
}

export interface BookedDate {
  date: string;
  slots: ShiftSlot[];
}

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Booking {
  bookingCode: string;
  name: string;
  whatsapp: string;
  guests: number;
  status: BookingStatus;
  bookingType: "fullday" | "shift";
  shiftSlot?: ShiftSlot | null;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface CreateBookingPayload {
  name: string;
  whatsapp: string;
  guests: number | string;
  bookingType: "fullday" | "shift";
  shiftSlot?: ShiftSlot;
  checkIn: string;
  checkOut?: string;
  /** Guest opted out of AC; the server applies the discount. */
  withoutAc?: boolean;
}

export const createBooking = (payload: CreateBookingPayload) =>
  request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getBooking = (code: string) => request<Booking>(`/api/bookings/${code}`);

export const getBookedDates = () =>
  request<{ booked: BookedDate[] }>("/api/bookings/booked/dates");

export const getPricing = () => request<Pricing>("/api/bookings/pricing");

/* ===================== Admin =====================
 * Auth rides on an httpOnly session cookie set by /api/admin/login, so none of
 * these take a key — the browser never holds the admin key at all.
 */

export interface AdminBooking extends Booking {
  _id: string;
  notes?: string;
  adminNote?: string;
  fee?: number;
  amountPaid?: number;
  createdAt?: string;
}

export interface BookingCounts {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  total: number;
}

export interface AdminStats {
  monthly: Array<{ label: string; bookings: number; revenue: number }>;
  statusCounts: Record<BookingStatus, number>;
  typeCounts: { fullday: number; day: number; night: number };
  upcoming: number;
  upcomingBookings: AdminBooking[];
  recentBookings: AdminBooking[];
  totalRevenue: number;
  totalBilled: number;
  outstanding: number;
  totalBookings: number;
  unreadMessages: number;
  customerCount: number;
}

export interface Customer {
  whatsapp: string;
  name: string;
  bookingsCount: number;
  approvedCount: number;
  totalFee: number;
  totalPaid: number;
  lastBookingAt: string;
}

export interface Conversation {
  whatsapp: string;
  name: string;
  lastBody: string;
  lastDirection: "in" | "out";
  lastAt: string;
  unread: number;
}

export interface ChatMessage {
  _id: string;
  whatsapp: string;
  direction: "in" | "out";
  body: string;
  profileName?: string;
  read: boolean;
  createdAt: string;
}

const qs = (params: Record<string, unknown> = {}) => {
  const search = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return search ? `?${search}` : "";
};

export const adminLogin = (key: string) =>
  request<{ ok: true }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ key }),
  });

export const adminLogout = () =>
  request<{ ok: true }>("/api/admin/logout", { method: "POST" });

export const adminSession = () => request<{ authed: boolean }>("/api/admin/session");

export const adminGetStats = () => request<AdminStats>("/api/admin/stats");

export const adminListBookings = (params: Record<string, unknown> = {}) =>
  request<{
    bookings: AdminBooking[];
    total: number;
    page: number;
    limit: number;
    counts: BookingCounts;
  }>(`/api/admin/bookings${qs(params)}`);

export const adminUpdateBooking = (
  id: string,
  action: "approve" | "reject" | "cancel",
  extra: Record<string, unknown> = {}
) =>
  request<AdminBooking>(`/api/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action, ...extra }),
  });

export const adminEditBooking = (id: string, payload: Record<string, unknown>) =>
  request<AdminBooking>(`/api/admin/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const adminDeleteBooking = (id: string) =>
  request<{ ok: true }>(`/api/admin/bookings/${id}`, { method: "DELETE" });

export const adminGetSettings = () => request<Pricing>("/api/admin/settings");

export const adminSaveSettings = (payload: Record<string, unknown>) =>
  request<Pricing>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const adminListCustomers = (params: Record<string, unknown> = {}) =>
  request<{ customers: Customer[]; total: number; page: number; limit: number }>(
    `/api/admin/customers${qs(params)}`
  );

export const adminListConversations = (params: Record<string, unknown> = {}) =>
  request<{ conversations: Conversation[] }>(`/api/admin/conversations${qs(params)}`);

export const adminGetMessages = (whatsapp: string) =>
  request<{ messages: ChatMessage[] }>(
    `/api/admin/conversations/${whatsapp}/messages`
  );

export const adminSendMessage = (whatsapp: string, body: string) =>
  request<{ message: ChatMessage }>(`/api/admin/conversations/${whatsapp}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

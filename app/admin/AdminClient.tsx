"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  adminListBookings,
  adminUpdateBooking,
  adminEditBooking,
  adminDeleteBooking,
  adminListCustomers,
  adminListConversations,
  adminGetMessages,
  adminSendMessage,
  adminGetStats,
  adminGetSettings,
  adminSaveSettings,
  adminLogout,
  type AdminBooking,
  type AdminStats,
  type BookingCounts,
  type ChatMessage,
  type Conversation,
  type Customer,
} from "@/lib/api";
import { formatTime12 } from "@/lib/format";
import AdminOverview from "@/components/admin/AdminOverview";
import DateRangePicker from "@/components/DateRangePicker/DateRangePicker";
import {
  Bell,
  Banknote,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  CircleX,
  Clock3,
  ExternalLink,
  Filter,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";

const LIMIT = 20;

export type AdminTab = "overview" | "bookings" | "customers" | "chats" | "settings";

interface EditForm {
  name: string;
  whatsapp: string;
  typeChoice: "fullday" | "day" | "night";
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  guests: number | string;
  notes: string;
  fee: number | string;
  amountPaid: number | string;
}

const emptyEditForm: EditForm = {
  name: "",
  whatsapp: "",
  typeChoice: "fullday",
  checkIn: "",
  checkOut: "",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  guests: 1,
  notes: "",
  fee: "",
  amountPaid: "",
};

const TYPE_LABEL = {
  fullday: { text: "Full Day", cls: "type-fullday" },
  day: { text: "Day Shift", cls: "type-day" },
  night: { text: "Night Shift", cls: "type-night" },
} as const;

type TypeKey = keyof typeof TYPE_LABEL;

function typeKeyOf(b: AdminBooking): TypeKey {
  return (b.bookingType || "fullday") === "shift"
    ? b.shiftSlot === "night"
      ? "night"
      : "day"
    : "fullday";
}

function toDateInput(d?: string) {
  return d ? new Date(d).toISOString().split("T")[0] : "";
}

const money = (n?: number | string) => `Rs ${Number(n || 0).toLocaleString("en-PK")}`;

const PRICE_PACKAGES = [
  { key: "weekend24Hrs", label: "Weekend – 24 Hrs", hint: "Rs / 24-hour booking" },
  { key: "nonWeekend24Hrs", label: "Non-Weekend – 24 Hrs", hint: "Rs / 24-hour booking" },
  { key: "weekend12Hrs", label: "Weekend – 12 Hrs", hint: "Rs / 12-hour night shift" },
  { key: "weekend12HrsDay", label: "Weekend – 12 Hrs (Day)", hint: "Rs / 12-hour day shift" },
  {
    key: "nonWeekend12HrsDay",
    label: "Non-Weekend – 12 Hrs (Day)",
    hint: "Rs / 12-hour day shift",
  },
  {
    key: "nonWeekend40Person12Hrs",
    label: "Non-Weekend – 40 Person – 12 Hrs",
    hint: "Rs / 12-hour shift (up to 40 guests)",
  },
] as const;

type ActionType = "approve" | "reject" | "cancel" | "delete";

const ACTION_META: Record<ActionType, { title: string; cta: string; cls: string }> = {
  approve: { title: "Approve Booking & Payment", cta: "Approve Booking", cls: "btn-approve" },
  reject: { title: "Reject Booking", cta: "Reject Booking", cls: "btn-reject" },
  cancel: { title: "Cancel Booking", cta: "Cancel Booking", cls: "btn-cancel" },
  delete: { title: "Delete Booking", cta: "Delete Permanently", cls: "btn-delete" },
};

type SettingsForm = Record<string, string | number>;

export default function AdminClient() {
  const router = useRouter();

  const [tab, setTab] = useState<AdminTab>("overview");
  const [error, setError] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Overview analytics
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  // Bookings
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [counts, setCounts] = useState<BookingCounts>({
    pending: 0, approved: 0, rejected: 0, cancelled: 0, total: 0,
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("pending");
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Customers
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersTotal, setCustomersTotal] = useState(0);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersQ, setCustomersQ] = useState("");
  const [customersQInput, setCustomersQInput] = useState("");

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [convQ, setConvQ] = useState("");
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Edit modal
  const [editing, setEditing] = useState<AdminBooking | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [editError, setEditError] = useState("");

  // Settings
  const [settingsForm, setSettingsForm] = useState<SettingsForm | null>(null);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Action modal
  const [actionModal, setActionModal] = useState<{
    type: ActionType;
    booking: AdminBooking;
  } | null>(null);
  const [modalFee, setModalFee] = useState("");
  const [modalPaid, setModalPaid] = useState("");
  const [modalNote, setModalNote] = useState("");
  const [modalNotes, setModalNotes] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalBusy, setModalBusy] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const customersTotalPages = Math.max(1, Math.ceil(customersTotal / LIMIT));

  /** An expired session shows up as a 401 — bounce back to the sign-in page. */
  const handleError = useCallback(
    (e: unknown, set: (msg: string) => void) => {
      const msg = e instanceof Error ? e.message : "Request failed";
      if (msg === "Unauthorized") {
        router.replace("/admin/login");
        return;
      }
      set(msg);
    },
    [router]
  );

  const load = useCallback(async () => {
    try {
      const data = await adminListBookings({
        status: filter === "all" ? "" : filter,
        q,
        from: dateFrom,
        to: dateTo,
        page,
        limit: LIMIT,
      });
      setBookings(data.bookings);
      setCounts(data.counts);
      setTotal(data.total);
      setError("");
    } catch (e) {
      handleError(e, setError);
    }
  }, [filter, q, dateFrom, dateTo, page, handleError]);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await adminListCustomers({
        q: customersQ,
        page: customersPage,
        limit: LIMIT,
      });
      setCustomers(data.customers);
      setCustomersTotal(data.total);
      setError("");
    } catch (e) {
      handleError(e, setError);
    }
  }, [customersQ, customersPage, handleError]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError("");
    try {
      setStats(await adminGetStats());
    } catch (e) {
      handleError(e, setStatsError);
    } finally {
      setStatsLoading(false);
    }
  }, [handleError]);

  const loadConversations = useCallback(async () => {
    try {
      const data = await adminListConversations({ q: convQ });
      setConversations(data.conversations);
    } catch (e) {
      handleError(e, setError);
    }
  }, [convQ, handleError]);

  const loadMessages = useCallback(async () => {
    if (!activeChat) return;
    try {
      const data = await adminGetMessages(activeChat);
      setMessages(data.messages);
      setChatError("");
    } catch (e) {
      handleError(e, setChatError);
    }
  }, [activeChat, handleError]);

  useEffect(() => {
    if (tab === "bookings") load();
  }, [tab, load]);

  useEffect(() => {
    if (tab === "customers") loadCustomers();
  }, [tab, loadCustomers]);

  useEffect(() => {
    if (tab === "overview") loadStats();
  }, [tab, loadStats]);

  // Poll the inbox and the open thread while the chats tab is active
  useEffect(() => {
    if (tab !== "chats") return;
    loadConversations();
    const id = setInterval(loadConversations, 10000);
    return () => clearInterval(id);
  }, [tab, loadConversations]);

  useEffect(() => {
    if (tab !== "chats" || !activeChat) return;
    loadMessages();
    const id = setInterval(loadMessages, 5000);
    return () => clearInterval(id);
  }, [tab, activeChat, loadMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeChat]);

  useEffect(() => {
    if (tab !== "settings") return;
    adminGetSettings()
      .then((s) => {
        setSettingsForm(s as SettingsForm);
        setSettingsMsg("");
      })
      .catch((e) => handleError(e, setSettingsMsg));
  }, [tab, handleError]);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settingsForm) return;
    setSettingsSaving(true);
    setSettingsMsg("");
    try {
      const saved = await adminSaveSettings(settingsForm);
      setSettingsForm(saved as SettingsForm);
      setSettingsMsg("saved");
    } catch (e2) {
      handleError(e2, setSettingsMsg);
    } finally {
      setSettingsSaving(false);
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    const body = replyText.trim();
    if (!body || !activeChat || sending) return;
    setSending(true);
    setChatError("");
    try {
      await adminSendMessage(activeChat, body);
      setReplyText("");
      await loadMessages();
      loadConversations();
    } catch (e2) {
      handleError(e2, setChatError);
    } finally {
      setSending(false);
    }
  }

  function changeFilter(s: string) {
    setFilter(s);
    setPage(1);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(qInput.trim());
    setPage(1);
  }

  function submitCustomerSearch(e: React.FormEvent) {
    e.preventDefault();
    setCustomersQ(customersQInput.trim());
    setCustomersPage(1);
  }

  function viewCustomerBookings(whatsapp: string) {
    setTab("bookings");
    setFilter("all");
    setQInput(whatsapp);
    setQ(whatsapp);
    setPage(1);
  }

  function navigate(nextTab: AdminTab) {
    setTab(nextTab);
    setMobileNavOpen(false);
  }

  async function logout() {
    try {
      await adminLogout();
    } catch {
      // signing out locally is enough even if the call fails
    }
    router.replace("/admin/login");
    router.refresh();
  }

  function openAction(type: ActionType, booking: AdminBooking) {
    setActionModal({ type, booking });
    setModalError("");
    setModalNote("");
    setModalNotes(booking.notes || "");
    setModalFee(booking.fee ? String(booking.fee) : "");
    setModalPaid(booking.amountPaid ? String(booking.amountPaid) : "");
  }

  async function submitAction() {
    if (!actionModal) return;
    setModalBusy(true);
    setModalError("");
    try {
      const { type, booking } = actionModal;
      if (type === "delete") {
        await adminDeleteBooking(booking._id);
      } else if (type === "approve") {
        await adminUpdateBooking(booking._id, "approve", {
          adminNote: modalNote,
          notes: modalNotes,
          fee: modalFee === "" ? 0 : Number(modalFee),
          amountPaid: modalPaid === "" ? 0 : Number(modalPaid),
        });
      } else {
        await adminUpdateBooking(booking._id, type, { adminNote: modalNote });
      }
      setActionModal(null);
      await load();
    } catch (e) {
      handleError(e, setModalError);
    } finally {
      setModalBusy(false);
    }
  }

  function openEdit(b: AdminBooking) {
    setEditing(b);
    setEditError("");
    setEditForm({
      name: b.name,
      whatsapp: b.whatsapp,
      typeChoice: typeKeyOf(b),
      checkIn: toDateInput(b.checkIn),
      checkOut: toDateInput(b.checkOut),
      checkInTime: b.checkInTime || "14:00",
      checkOutTime: b.checkOutTime || "12:00",
      guests: b.guests,
      notes: b.notes || "",
      fee: b.fee || "",
      amountPaid: b.amountPaid || "",
    });
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setEditError("");
    try {
      const { typeChoice, ...rest } = editForm;
      await adminEditBooking(editing._id, {
        ...rest,
        bookingType: typeChoice === "fullday" ? "fullday" : "shift",
        shiftSlot: typeChoice === "fullday" ? null : typeChoice,
      });
      setEditing(null);
      await load();
    } catch (e2) {
      handleError(e2, setEditError);
    }
  }

  const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString() : "");
  const chatTime = (d: string) => {
    const dt = new Date(d);
    return dt.toDateString() === new Date().toDateString()
      ? dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : dt.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  const activeConv = conversations.find((c) => c.whatsapp === activeChat);

  const PAGE_META: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: { title: "Overview", subtitle: "A quick look at bookings, revenue and guest activity." },
    bookings: { title: "Bookings", subtitle: "Review requests, payments and upcoming stays." },
    customers: { title: "Customers", subtitle: "Understand guest history and booking value." },
    chats: { title: "Conversations", subtitle: "Reply to guests and keep every conversation together." },
    settings: { title: "Settings", subtitle: "Manage booking package prices and shift timings." },
  };
  const pageMeta = PAGE_META[tab];

  const conversationUnread = conversations.reduce((sum, item) => sum + (item.unread || 0), 0);
  const unreadCount = conversations.length > 0 ? conversationUnread : stats?.unreadMessages || 0;

  const NAV_ITEMS = [
    { key: "overview" as const, label: "Overview", icon: LayoutDashboard, badge: 0 },
    { key: "bookings" as const, label: "Bookings", icon: CalendarDays, badge: stats?.statusCounts?.pending || 0 },
    { key: "customers" as const, label: "Customers", icon: Users, badge: 0 },
    { key: "chats" as const, label: "Conversations", icon: MessageCircle, badge: unreadCount },
    { key: "settings" as const, label: "Settings", icon: Settings, badge: 0 },
  ];

  return (
    <div
      className={`admin-page admin admin-v2 ${sidebarCollapsed ? "sidebar-is-collapsed" : ""}`}
    >
      {mobileNavOpen && (
        <button
          className="admin-sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <span className="logo-mark">VF</span>
          <div className="admin-sidebar-brand-copy">
            <strong>Vicky Farmhouse</strong>
            <span>Farm House Admin</span>
          </div>
        </div>

        <nav className="admin-side-nav" aria-label="Admin navigation">
          <span className="admin-nav-label">Workspace</span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`admin-side-link ${tab === item.key ? "active" : ""}`}
                onClick={() => navigate(item.key)}
                aria-current={tab === item.key ? "page" : undefined}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge > 0 && <em>{item.badge > 99 ? "99+" : item.badge}</em>}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <button className="admin-side-link admin-logout" onClick={logout}>
            <LogOut size={20} aria-hidden="true" />
            <span>Sign out</span>
          </button>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
            <span>{sidebarCollapsed ? "Expand" : "Collapse sidebar"}</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <button
              className="admin-menu-button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            {tab !== "overview" && (
              <button
                className="admin-back-overview"
                onClick={() => navigate("overview")}
                aria-label="Back to overview"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h1>{pageMeta.title}</h1>
              <p>{pageMeta.subtitle}</p>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="admin-icon-button"
              onClick={() => navigate("chats")}
              aria-label={`${unreadCount} unread messages`}
            >
              <Bell size={20} />
              {unreadCount > 0 && <span>{unreadCount > 9 ? "9+" : unreadCount}</span>}
            </button>
            <div className="admin-profile">
              <span>VF</span>
              <div>
                <strong>Administrator</strong>
                <small>Vicky Farmhouse</small>
              </div>
            </div>
          </div>
        </header>

        <div className={`admin-content admin-content-${tab}`}>
          {tab === "overview" && (
            <AdminOverview
              stats={stats}
              loading={statsLoading}
              error={statsError}
              onNavigate={navigate}
            />
          )}

          {tab === "bookings" && (
            <div className="operation-view bookings-view">
              <div className="operation-metrics booking-metrics">
                {(
                  [
                    { key: "total", label: "Total bookings", icon: CalendarDays, helper: "All booking requests" },
                    { key: "pending", label: "Pending", icon: Clock3, helper: "Needs your review" },
                    { key: "approved", label: "Approved", icon: CalendarCheck2, helper: "Confirmed stays" },
                    { key: "rejected", label: "Rejected", icon: CircleX, helper: "Declined requests" },
                    { key: "cancelled", label: "Cancelled", icon: CalendarClock, helper: "Cancelled stays" },
                  ] as const
                ).map((card) => {
                  const Icon = card.icon;
                  const cardFilter = card.key === "total" ? "all" : card.key;
                  return (
                    <button
                      type="button"
                      className={`operation-metric operation-metric-${card.key} ${filter === cardFilter ? "is-active" : ""}`}
                      key={card.key}
                      onClick={() => changeFilter(cardFilter)}
                    >
                      <span><Icon size={19} aria-hidden="true" /></span>
                      <strong>{counts[card.key]}</strong>
                      <div>
                        <b>{card.label}</b>
                        <small>{card.helper}</small>
                      </div>
                    </button>
                  );
                })}
              </div>

              <section className="dash-panel operation-panel">
                <div className="operation-panel-head">
                  <div>
                    <span>Booking operations</span>
                    <h3>All booking requests</h3>
                    <p>Search, filter and manage every farmhouse reservation.</p>
                  </div>
                  <button
                    type="button"
                    className="operation-icon-action"
                    onClick={() => load()}
                    title="Refresh bookings"
                  >
                    <RefreshCw size={18} aria-hidden="true" />
                    Refresh
                  </button>
                </div>

                <div className="operation-filter-row">
                  <div className="filters admin-status-filters">
                    <Filter size={16} aria-hidden="true" />
                    {["pending", "approved", "rejected", "cancelled", "all"].map((status) => (
                      <button
                        key={status}
                        className={`chip ${filter === status ? "active" : ""}`}
                        onClick={() => changeFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <form className="admin-search operation-search" onSubmit={submitSearch}>
                    <div className="operation-search-field">
                      <Search size={16} aria-hidden="true" />
                      <input
                        aria-label="Search bookings"
                        placeholder="Search name, WhatsApp, or booking ID"
                        value={qInput}
                        onChange={(e) => setQInput(e.target.value)}
                      />
                    </div>
                    <DateRangePicker
                      className="admin-date-range"
                      mode="range"
                      allowPast
                      showLegend={false}
                      checkInLabel="From"
                      checkOutLabel="To"
                      checkIn={dateFrom}
                      checkOut={dateTo}
                      onChange={({ checkIn, checkOut }) => {
                        setDateFrom(checkIn);
                        setDateTo(checkOut);
                        setPage(1);
                      }}
                    />
                    <button className="btn btn-sm btn-approve" type="submit">Search</button>
                    {(q || dateFrom || dateTo) && (
                      <button
                        type="button"
                        className="btn btn-sm btn-edit"
                        onClick={() => {
                          setQ("");
                          setQInput("");
                          setDateFrom("");
                          setDateTo("");
                          setPage(1);
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </form>
                </div>

                {error && <div className="form-error operation-error">{error}</div>}

                <div className="table-wrap operation-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>WhatsApp</th><th>Type</th><th>Dates</th>
                        <th>Guests</th><th>Fees</th><th>Notes</th><th>Status</th><th>Placed</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const fee = booking.fee || 0;
                        const paid = booking.amountPaid || 0;
                        const feeCls =
                          fee === 0 ? "" : paid >= fee ? "paid-full" : paid > 0 ? "paid-partial" : "paid-none";
                        return (
                          <tr key={booking._id}>
                            <td data-label="ID"><strong className="booking-code">{booking.bookingCode}</strong></td>
                            <td data-label="Name">{booking.name}</td>
                            <td data-label="WhatsApp">
                              <a href={`https://wa.me/${booking.whatsapp}`} target="_blank" rel="noreferrer">
                                {booking.whatsapp}
                              </a>
                            </td>
                            <td data-label="Type">
                              <span className={`type-badge ${TYPE_LABEL[typeKeyOf(booking)].cls}`}>
                                {TYPE_LABEL[typeKeyOf(booking)].text}
                              </span>
                            </td>
                            <td data-label="Dates">
                              <div className="dates-cell">
                                <span>
                                  {fmt(booking.checkIn)}{" "}
                                  {booking.checkInTime && <em>{formatTime12(booking.checkInTime)}</em>}
                                </span>
                                <span>
                                  → {fmt(booking.checkOut)}{" "}
                                  {booking.checkOutTime && <em>{formatTime12(booking.checkOutTime)}</em>}
                                </span>
                              </div>
                            </td>
                            <td data-label="Guests">{booking.guests}</td>
                            <td data-label="Fees">
                              {fee === 0 ? (
                                <span className="fee-pill fee-none">Not set</span>
                              ) : (
                                <span className={`fee-pill ${feeCls}`}>
                                  {money(paid)} / {money(fee)}
                                </span>
                              )}
                            </td>
                            <td data-label="Notes">{booking.notes}</td>
                            <td data-label="Status">
                              <span className={`badge ${booking.status}`}>{booking.status}</span>
                            </td>
                            <td data-label="Placed">{fmt(booking.createdAt)}</td>
                            <td data-label="Actions" className="td-actions">
                              <div className="td-actions-inner">
                                {booking.status === "pending" && (
                                  <>
                                    <button className="btn btn-sm btn-approve" onClick={() => openAction("approve", booking)}>Approve</button>
                                    <button className="btn btn-sm btn-reject" onClick={() => openAction("reject", booking)}>Reject</button>
                                  </>
                                )}
                                {booking.status === "approved" && (
                                  <button className="btn btn-sm btn-cancel" onClick={() => openAction("cancel", booking)}>Cancel</button>
                                )}
                                <button className="btn btn-sm btn-edit" onClick={() => openEdit(booking)}>Edit</button>
                                <button className="btn btn-sm btn-delete" onClick={() => openAction("delete", booking)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {bookings.length === 0 && (
                        <tr><td colSpan={11} className="empty">No bookings match these filters.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pagination operation-pagination">
                  <button className="btn btn-sm btn-edit" disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Previous</button>
                  <span>Page {page} of {totalPages} &middot; {total} bookings</span>
                  <button className="btn btn-sm btn-edit" disabled={page >= totalPages} onClick={() => setPage((v) => v + 1)}>Next</button>
                </div>
              </section>
            </div>
          )}

          {tab === "customers" && (
            <div className="operation-view customers-view">
              <div className="operation-metrics customer-metrics">
                <article className="operation-metric static">
                  <span><Users size={19} aria-hidden="true" /></span>
                  <strong>{stats?.customerCount ?? customersTotal}</strong>
                  <div><b>Total customers</b><small>Unique WhatsApp contacts</small></div>
                </article>
                <article className="operation-metric static operation-metric-approved">
                  <span><UserCheck size={19} aria-hidden="true" /></span>
                  <strong>
                    {stats?.statusCounts?.approved ??
                      customers.reduce((sum, c) => sum + c.approvedCount, 0)}
                  </strong>
                  <div><b>Approved stays</b><small>Confirmed customer bookings</small></div>
                </article>
                <article className="operation-metric static operation-metric-total">
                  <span><WalletCards size={19} aria-hidden="true" /></span>
                  <strong>
                    {money(
                      stats?.totalRevenue || customers.reduce((sum, c) => sum + c.totalPaid, 0)
                    )}
                  </strong>
                  <div><b>Collected</b><small>Approved booking payments</small></div>
                </article>
              </div>

              <section className="dash-panel operation-panel">
                <div className="operation-panel-head">
                  <div>
                    <span>Guest directory</span>
                    <h3>Customer relationships</h3>
                    <p>Review booking frequency, approval history and customer value.</p>
                  </div>
                </div>

                <form className="admin-search customer-search" onSubmit={submitCustomerSearch}>
                  <div className="operation-search-field">
                    <Search size={16} aria-hidden="true" />
                    <input
                      aria-label="Search customers"
                      placeholder="Search by name or WhatsApp number"
                      value={customersQInput}
                      onChange={(e) => setCustomersQInput(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-sm btn-approve" type="submit">Search</button>
                  {customersQ && (
                    <button
                      type="button"
                      className="btn btn-sm btn-edit"
                      onClick={() => {
                        setCustomersQ("");
                        setCustomersQInput("");
                        setCustomersPage(1);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </form>

                {error && <div className="form-error operation-error">{error}</div>}

                <div className="table-wrap operation-table customer-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th><th>WhatsApp</th><th>Bookings</th><th>Approved</th>
                        <th>Paid / Fee</th><th>Last Activity</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.whatsapp}>
                          <td data-label="Name">
                            <div className="customer-name-cell">
                              <span>{(customer.name || "G").slice(0, 2).toUpperCase()}</span>
                              <strong>{customer.name}</strong>
                            </div>
                          </td>
                          <td data-label="WhatsApp">
                            <a href={`https://wa.me/${customer.whatsapp}`} target="_blank" rel="noreferrer">
                              {customer.whatsapp}
                            </a>
                          </td>
                          <td data-label="Bookings">{customer.bookingsCount}</td>
                          <td data-label="Approved">{customer.approvedCount}</td>
                          <td data-label="Paid / Fee">
                            <div className="customer-payment-cell">
                              <strong>{money(customer.totalPaid)}</strong>
                              <span>of {money(customer.totalFee)}</span>
                            </div>
                          </td>
                          <td data-label="Last Activity">{fmt(customer.lastBookingAt)}</td>
                          <td data-label="Actions" className="td-actions">
                            <div className="td-actions-inner">
                              <button
                                className="btn btn-sm btn-edit"
                                onClick={() => viewCustomerBookings(customer.whatsapp)}
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan={7} className="empty">No customers match this search.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="pagination operation-pagination">
                  <button className="btn btn-sm btn-edit" disabled={customersPage <= 1} onClick={() => setCustomersPage((v) => v - 1)}>Previous</button>
                  <span>Page {customersPage} of {customersTotalPages} &middot; {customersTotal} customers</span>
                  <button className="btn btn-sm btn-edit" disabled={customersPage >= customersTotalPages} onClick={() => setCustomersPage((v) => v + 1)}>Next</button>
                </div>
              </section>
            </div>
          )}

          {tab === "chats" && (
            <div className="operation-view chats-view">
              <div className="conversation-summary">
                <div>
                  <span><Inbox size={18} aria-hidden="true" /></span>
                  <strong>{conversations.length}</strong>
                  <small>Active conversations</small>
                </div>
                <div>
                  <span><MessageCircle size={18} aria-hidden="true" /></span>
                  <strong>{conversationUnread}</strong>
                  <small>Unread messages</small>
                </div>
                <button type="button" onClick={() => loadConversations()}>
                  <RefreshCw size={17} aria-hidden="true" />
                  Refresh inbox
                </button>
              </div>

              <div className="chat-layout">
                <aside className="chat-list">
                  <div className="chat-list-title">
                    <div>
                      <span>Guest inbox</span>
                      <strong>Conversations</strong>
                    </div>
                    <em>{conversationUnread} unread</em>
                  </div>
                  <div className="chat-list-head">
                    <Search size={16} aria-hidden="true" />
                    <input
                      aria-label="Search conversations"
                      placeholder="Search conversations"
                      value={convQ}
                      onChange={(e) => setConvQ(e.target.value)}
                    />
                  </div>
                  <div className="chat-list-items">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.whatsapp}
                        className={`chat-item ${activeChat === conversation.whatsapp ? "active" : ""}`}
                        onClick={() => {
                          if (activeChat !== conversation.whatsapp) {
                            setActiveChat(conversation.whatsapp);
                            setMessages([]);
                            setChatError("");
                          }
                        }}
                      >
                        <span className="avatar">
                          {(conversation.name || conversation.whatsapp)
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .slice(0, 2)
                            .toUpperCase() || "?"}
                        </span>
                        <span className="chat-item-main">
                          <strong>{conversation.name || `+${conversation.whatsapp}`}</strong>
                          <em>
                            {conversation.lastDirection === "out" ? "You: " : ""}
                            {conversation.lastBody}
                          </em>
                        </span>
                        <span className="chat-item-meta">
                          <time>{chatTime(conversation.lastAt)}</time>
                          {conversation.unread > 0 && (
                            <span className="unread-badge">{conversation.unread}</span>
                          )}
                        </span>
                      </button>
                    ))}
                    {conversations.length === 0 && (
                      <div className="chat-list-empty">
                        <MessageCircle size={25} aria-hidden="true" />
                        <p>No conversations yet. New WhatsApp messages will appear here.</p>
                      </div>
                    )}
                  </div>
                </aside>

                <section className="chat-window">
                  {activeChat ? (
                    <>
                      <div className="chat-head">
                        <span className="avatar">
                          {(activeConv?.name || activeChat)
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .slice(0, 2)
                            .toUpperCase() || "?"}
                        </span>
                        <div className="chat-head-info">
                          <strong>{activeConv?.name || `+${activeChat}`}</strong>
                          <span>+{activeChat} · WhatsApp conversation</span>
                        </div>
                        <a
                          className="chat-external-link"
                          href={`https://wa.me/${activeChat}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                          Open WhatsApp
                        </a>
                      </div>

                      <div className="chat-thread">
                        {messages.map((message) => (
                          <div key={message._id} className={`bubble-row ${message.direction}`}>
                            <div className={`bubble ${message.direction}`}>
                              <p>{message.body}</p>
                              <time>{chatTime(message.createdAt)}</time>
                            </div>
                          </div>
                        ))}
                        {messages.length === 0 && <p className="chat-list-empty">No messages yet</p>}
                        <div ref={chatEndRef} />
                      </div>

                      {chatError && <div className="form-error chat-error">{chatError}</div>}

                      <form className="chat-reply" onSubmit={sendReply}>
                        <input
                          aria-label="Reply message"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a message..."
                        />
                        <button className="btn btn-primary" disabled={sending || !replyText.trim()}>
                          <Send size={17} aria-hidden="true" />
                          {sending ? "Sending..." : "Send"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="chat-placeholder">
                      <span><MessageCircle size={30} aria-hidden="true" /></span>
                      <strong>Your guest conversations</strong>
                      <p>Select a conversation to view messages and reply.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="operation-view settings-view">
              <div className="settings-overview-strip">
                <article>
                  <span><Banknote size={19} aria-hidden="true" /></span>
                  <div>
                    <small>Weekend – 24 Hrs</small>
                    <strong>{settingsForm ? money(settingsForm.weekend24Hrs) : "—"}</strong>
                  </div>
                </article>
                <article>
                  <span><WalletCards size={19} aria-hidden="true" /></span>
                  <div>
                    <small>Non-Weekend – 24 Hrs</small>
                    <strong>{settingsForm ? money(settingsForm.nonWeekend24Hrs) : "—"}</strong>
                  </div>
                </article>
                <article>
                  <span><SlidersHorizontal size={19} aria-hidden="true" /></span>
                  <div>
                    <small>12 Hr packages</small>
                    <strong>
                      {settingsForm ? `from ${money(settingsForm.nonWeekend12HrsDay)}` : "—"}
                    </strong>
                  </div>
                </article>
              </div>

              <div className="settings-wrap">
                {settingsMsg === "saved" && (
                  <div className="settings-saved">✓ Settings saved successfully</div>
                )}
                {settingsMsg && settingsMsg !== "saved" && (
                  <div className="form-error">{settingsMsg}</div>
                )}
                {settingsForm ? (
                  <form className="settings-form" onSubmit={saveSettings}>
                    <section className="settings-card settings-pricing-card">
                      <div className="settings-card-head">
                        <span className="settings-card-icon">Rs</span>
                        <div>
                          <h3>Booking prices</h3>
                          <p>Weekend is Sat–Sun. Rates apply automatically when guests submit a booking.</p>
                        </div>
                      </div>
                      <div className="settings-fields settings-fields-pricing">
                        {PRICE_PACKAGES.map(({ key, label, hint }) => (
                          <label key={key}>
                            {label} <span>{hint}</span>
                            <input
                              required
                              type="number"
                              min="0"
                              value={settingsForm[key] ?? ""}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, [key]: e.target.value })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </section>

                    <section className="settings-card settings-schedule-card">
                      <div className="settings-card-head">
                        <span className="settings-card-icon settings-clock-icon">24h</span>
                        <div>
                          <h3>Shift schedule</h3>
                          <p>Set the arrival and departure window used across bookings and WhatsApp updates.</p>
                        </div>
                      </div>
                      <div className="settings-fields settings-fields-times">
                        {(
                          [
                            ["dayShiftStart", "Day Shift Start", "08:00", ""],
                            ["dayShiftEnd", "Day Shift End", "20:00", ""],
                            ["nightShiftStart", "Night Shift Start", "20:00", ""],
                            ["nightShiftEnd", "Night Shift End", "08:00", " ( Next Morning )"],
                          ] as const
                        ).map(([key, label, fallback, hint]) => (
                          <label key={key}>
                            <span className="settings-time-label">
                              {label}
                              {hint && <span className="settings-time-hint">{hint}</span>}
                            </span>
                            <input
                              required
                              type="time"
                              value={settingsForm[key] ?? fallback}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, [key]: e.target.value })
                              }
                            />
                          </label>
                        ))}
                      </div>
                    </section>

                    <div className="settings-save-bar">
                      <div>
                        <strong>Save your changes</strong>
                        <span>Updated prices and timings apply to future bookings.</span>
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={settingsSaving}>
                        {settingsSaving ? "Saving..." : "Save Settings"}
                      </button>
                    </div>
                  </form>
                ) : (
                  !settingsMsg && <div className="dash-skeleton settings-loading-card" />
                )}
              </div>
            </div>
          )}

          {editing && (
            <div className="modal-backdrop" onClick={() => setEditing(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Booking {editing.bookingCode}</h3>
                {editError && <div className="form-error">{editError}</div>}
                <form onSubmit={submitEdit}>
                  <div className="grid-2">
                    <label>
                      Full Name
                      <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    </label>
                    <label>
                      WhatsApp Number
                      <input required value={editForm.whatsapp} onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })} />
                    </label>
                    <label>
                      Booking Type
                      <select
                        value={editForm.typeChoice}
                        onChange={(e) =>
                          setEditForm({ ...editForm, typeChoice: e.target.value as EditForm["typeChoice"] })
                        }
                      >
                        <option value="fullday">Full Day</option>
                        <option value="day">Day Shift (12h)</option>
                        <option value="night">Night Shift (12h)</option>
                      </select>
                    </label>
                    <label>
                      Check-in
                      <input required type="date" value={editForm.checkIn} onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })} />
                    </label>
                    <label>
                      Check-out
                      <input required type="date" value={editForm.checkOut} onChange={(e) => setEditForm({ ...editForm, checkOut: e.target.value })} />
                    </label>
                    <label>
                      Check-in Time
                      <input required type="time" value={editForm.checkInTime} onChange={(e) => setEditForm({ ...editForm, checkInTime: e.target.value })} />
                    </label>
                    <label>
                      Check-out Time
                      <input required type="time" value={editForm.checkOutTime} onChange={(e) => setEditForm({ ...editForm, checkOutTime: e.target.value })} />
                    </label>
                    <label>
                      Guests
                      <input required type="number" min="1" max="50" value={editForm.guests} onChange={(e) => setEditForm({ ...editForm, guests: e.target.value })} />
                    </label>
                    <label>
                      Notes
                      <input value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                    </label>
                    <label>
                      Total Fee (Rs)
                      <input type="number" min="0" value={editForm.fee} onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })} />
                    </label>
                    <label>
                      Amount Paid (Rs)
                      <input type="number" min="0" value={editForm.amountPaid} onChange={(e) => setEditForm({ ...editForm, amountPaid: e.target.value })} />
                    </label>
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {actionModal && (
            <div className="modal-backdrop" onClick={() => !modalBusy && setActionModal(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{ACTION_META[actionModal.type].title}</h3>
                <p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
                  {actionModal.booking.bookingCode} &middot; {actionModal.booking.name} &middot;{" "}
                  {fmt(actionModal.booking.checkIn)}
                  {actionModal.booking.checkInTime && ` ${formatTime12(actionModal.booking.checkInTime)}`} →{" "}
                  {fmt(actionModal.booking.checkOut)}
                  {actionModal.booking.checkOutTime && ` ${formatTime12(actionModal.booking.checkOutTime)}`}
                </p>
                {modalError && <div className="form-error">{modalError}</div>}

                {actionModal.type === "approve" && (
                  <>
                    <div className="grid-2">
                      <label>
                        Total Fee (Rs)
                        <input type="number" min="0" placeholder="0" value={modalFee} onChange={(e) => setModalFee(e.target.value)} />
                      </label>
                      <label>
                        Amount Paid (Rs)
                        <input type="number" min="0" placeholder="0" value={modalPaid} onChange={(e) => setModalPaid(e.target.value)} />
                      </label>
                    </div>
                    <label className="modal-field">
                      Notes (optional)
                      <textarea
                        rows={3}
                        value={modalNotes}
                        onChange={(e) => setModalNotes(e.target.value)}
                        placeholder="Internal notes for this booking"
                      />
                    </label>
                  </>
                )}

                {(actionModal.type === "reject" || actionModal.type === "cancel") && (
                  <label className="modal-field">
                    Reason (optional)
                    <textarea
                      rows={3}
                      value={modalNote}
                      onChange={(e) => setModalNote(e.target.value)}
                      placeholder="Let the guest know why"
                    />
                  </label>
                )}

                {actionModal.type === "delete" && (
                  <p className="hint" style={{ marginBottom: 16 }}>
                    This permanently removes the booking record. This cannot be undone.
                  </p>
                )}

                <div className="modal-actions">
                  <button type="button" className="btn" disabled={modalBusy} onClick={() => setActionModal(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn ${ACTION_META[actionModal.type].cls}`}
                    disabled={modalBusy}
                    onClick={submitAction}
                  >
                    {modalBusy ? "Working..." : ACTION_META[actionModal.type].cta}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

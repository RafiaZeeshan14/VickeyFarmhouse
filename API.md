# API Reference

All routes are same-origin Next.js route handlers under `/api`. Requests and
responses are JSON.

Admin routes require a valid session cookie (see
[Authentication](#authentication)); everything else is public. Errors come back
as `{ "error": "message" }` with the status codes listed per route.

The typed browser client for all of this is `lib/api.ts` — prefer it over
hand-rolled `fetch` calls.

---

## Public — bookings

### `GET /api/bookings/pricing`

Current prices and shift timings. Used by the booking page and the landing
pricing section.

```json
{
  "weekend24Hrs": 150000,
  "nonWeekend24Hrs": 100000,
  "weekend12Hrs": 120000,
  "weekend12HrsDay": 100000,
  "nonWeekend12HrsDay": 65000,
  "nonWeekend40Person12Hrs": 75000,
  "dayShiftStart": "08:00",
  "dayShiftEnd": "20:00",
  "nightShiftStart": "20:00",
  "nightShiftEnd": "08:00"
}
```

Missing fields fall back to `PRICE_DEFAULTS`, so this never returns a partial
object.

### `GET /api/bookings/booked/dates`

Per-date slot occupancy for `approved` and `pending` bookings from today
onwards. Drives the greyed-out dates in the calendar.

```json
{
  "booked": [
    { "date": "2026-08-15", "slots": ["day", "night"] },
    { "date": "2026-08-16", "slots": ["night"] }
  ]
}
```

A date only appears if at least one slot is taken. A full-day booking
contributes both slots for every date in its range.

### `POST /api/bookings`

Creates a booking as `pending` and fires a WhatsApp notification.

**Body**

| Field | Required | Notes |
|---|---|---|
| `name` | yes | |
| `whatsapp` | yes | Any Pakistani format; normalised to `92XXXXXXXXXX` |
| `guests` | yes | ≥ 1 |
| `bookingType` | — | `"fullday"` (default) or `"shift"` |
| `shiftSlot` | for shifts | `"day"` or `"night"` |
| `checkIn` | yes | `YYYY-MM-DD` |
| `checkOut` | full day only | Exclusive. Ignored for shifts — the server sets `checkIn + 1 day` |
| `checkInTime` / `checkOutTime` | — | `HH:MM`. Full day only; shifts take their times from settings |
| `notes` | — | |
| `withoutAc` | — | `true` applies the flat no-AC discount |

**`201`** returns the created booking, including the generated `bookingCode`
and the **server-calculated** `fee` — the price the browser showed is ignored.

**Errors**

| Status | When |
|---|---|
| `400` | Missing fields, bad date, past check-in, `checkOut <= checkIn`, bad `HH:MM`, invalid phone |
| `409` | Slot already taken |
| `500` | Server error |

A WhatsApp failure does **not** fail the booking — it is fired and forgotten.

### `GET /api/bookings/:code`

Public status lookup by booking code (e.g. `FH-2B00CE`). Case-insensitive.

Returns booking details **without** fee, notes or admin fields. `404` when the
code doesn't exist.

> Remember: for a day shift the real check-out is `checkIn`, not `checkOut`.
> See ARCHITECTURE.md.

---

## Authentication

### `POST /api/admin/login`

Body: `{ "key": "<ADMIN_KEY>" }`

On success sets an `httpOnly` session cookie (`vf_admin`) valid for 8 hours and
returns `{ "ok": true }`. The key itself is never stored in the browser.

| Status | When |
|---|---|
| `401` | Wrong key |
| `429` | Too many attempts from this IP |
| `500` | `ADMIN_KEY` not configured |

### `POST /api/admin/logout`

Clears the cookie. Always `{ "ok": true }`.

### `GET /api/admin/session`

`{ "authed": true | false }` — lets the dashboard check whether it is still
signed in.

---

## Admin

All of these return `401` when the session is missing or expired. The dashboard
treats that as "signed out" and redirects to `/admin/login`.

### `GET /api/admin/bookings`

Query: `status`, `q`, `from`, `to`, `page` (default 1), `limit` (default 20,
max 100).

`q` matches name, WhatsApp number or booking code. `from`/`to` filter on
check-in date.

```json
{
  "bookings": [ /* full booking documents */ ],
  "total": 16,
  "page": 1,
  "limit": 20,
  "counts": { "pending": 8, "approved": 7, "rejected": 0, "cancelled": 1, "total": 16 }
}
```

`counts` covers **all** bookings, not just the current filter — it feeds the
metric cards.

### `PATCH /api/admin/bookings/:id`

Body: `{ "action": "approve" | "reject" | "cancel", ... }`

| Action | Allowed from | Extra fields | Sends |
|---|---|---|---|
| `approve` | `pending` | `fee`, `amountPaid`, `notes`, `adminNote` | Confirmation template |
| `reject` | `pending` | `adminNote` | Rejection message |
| `cancel` | `approved` | `adminNote` | Cancellation message |

Approving **re-checks for clashes** — another booking may have taken the slot
since the request came in. `409` if it clashes, or if the booking isn't in the
right starting state.

### `PUT /api/admin/bookings/:id`

Edit a booking. Requires `name`, `whatsapp`, `checkIn`, `checkOut`, `guests`;
optionally `checkInTime`, `checkOutTime`, `notes`, `fee`, `amountPaid`,
`bookingType`, `shiftSlot`, `withoutAc`.

Clash checking only runs when the booking is already `approved`. Does **not**
send a WhatsApp message.

### `DELETE /api/admin/bookings/:id`

Permanently removes the record. `{ "ok": true }`. Not reversible.

### `GET /api/admin/stats`

Everything the Overview tab renders: `monthly` (zero-filled last 6 months),
`statusCounts`, `typeCounts`, `upcoming`, `upcomingBookings`, `recentBookings`,
`totalRevenue`, `totalBilled`, `outstanding`, `totalBookings`, `unreadMessages`,
`customerCount`.

Revenue is the sum of `amountPaid` on approved bookings; `totalBilled` is the
sum of `fee`.

### `GET` / `PUT /api/admin/settings`

Read and update the six prices and four shift times. `PUT` accepts a partial
object — only the fields present are changed.

`400` on a negative/non-numeric price or a time that isn't `HH:MM`.

Saved prices reach the public site within 5 minutes (the landing page is ISR
with `revalidate = 300`).

### `GET /api/admin/customers`

Guests grouped by WhatsApp number. Query: `q`, `page`, `limit`.

Each row: `whatsapp`, `name`, `bookingsCount`, `approvedCount`, `totalFee`,
`totalPaid`, `lastBookingAt`.

### `GET /api/admin/conversations`

One row per WhatsApp number, newest first, capped at 100. Query: `q` (matches
number, profile name or message body).

Each row: `whatsapp`, `name`, `lastBody`, `lastDirection`, `lastAt`, `unread`.
`name` prefers the guest's booking name and falls back to their WhatsApp profile
name.

### `GET /api/admin/conversations/:whatsapp/messages`

Full thread, oldest first, capped at 500. **Marks incoming messages as read** as
a side effect.

### `POST /api/admin/conversations/:whatsapp/messages`

Body: `{ "body": "..." }`. Sends a plain-text WhatsApp reply.

`400` on an empty body, `502` if Meta rejects the send.

> Plain text only works inside the 24-hour window after the guest last messaged.
> Outside it Meta requires an approved template, and the send will fail.

---

## WhatsApp webhook

### `GET /api/whatsapp/webhook`

Meta's verification handshake. Echoes `hub.challenge` when
`hub.verify_token` matches `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, otherwise `403`.

### `POST /api/whatsapp/webhook`

Records incoming guest messages.

**Always returns 200**, even on failure — Meta disables webhooks that look
flaky. Processing happens *before* the response because serverless functions are
frozen once they respond. Duplicate deliveries are deduped on the Meta message
id.

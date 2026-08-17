# Architecture

How the booking system actually works. Read this before changing anything to do
with dates, prices or availability — several rules are subtler than they look.

---

## Booking types

A booking is one of two shapes:

| Type | `bookingType` | `shiftSlot` | Occupies |
|---|---|---|---|
| Full day | `"fullday"` | `null` | **Both** slots of every date in `[checkIn, checkOut)` |
| Shift | `"shift"` | `"day"` or `"night"` | **One** slot of a single date |

Two important details:

**`checkOut` is exclusive.** A full-day booking from the 10th to the 12th
occupies the 10th and 11th, not the 12th. For a shift booking the server always
stores `checkOut = checkIn + 1 day` so the same range maths works everywhere.

**A day shift ends the same calendar day.** Because `checkOut` is stored as the
next date, anything showing a check-out date to a guest has to special-case it:

```ts
b.bookingType === "shift" && b.shiftSlot !== "night" ? b.checkIn : b.checkOut
```

That appears in the tracker, the admin table and the WhatsApp messages. Miss it
and a day-shift guest is told they check out tomorrow.

Bookings created before the shift feature have no `bookingType` — they are
treated as full day.

## Availability

`lib/availability.ts` decides whether a candidate booking clashes with an
existing one. A clash exists when the ranges overlap **and** any of:

- the candidate is a full day (it needs both slots free), or
- the existing booking is a full day (it holds both slots), or
- both are shifts on the same slot

So a day shift and a night shift on the same date coexist happily; a full day
blocks both.

Clashes are checked against **`approved` and `pending`** bookings, so two guests
can't both have a pending request for the same slot.

The check runs twice — once when the guest submits, and again when an admin
approves — because time passes in between and another booking may have landed.

`GET /api/bookings/booked/dates` returns per-date slot occupancy
(`{ date, slots: ["day","night"] }`) which the calendar uses to grey out dates.
It only greys a date when the *relevant* slot is taken, so the landing hero
(where the visitor hasn't chosen a type yet) only blocks fully-booked days.

## Pricing

Six rates live in a **singleton settings document** (`_id: "global"`), editable
in Admin → Settings:

| Field | When it applies |
|---|---|
| `weekend24Hrs` | Full day, Sat/Sun |
| `nonWeekend24Hrs` | Full day, weekday |
| `weekend12HrsDay` | Day shift, Sat/Sun |
| `nonWeekend12HrsDay` | Day shift, weekday |
| `weekend12Hrs` | Night shift, Sat/Sun |
| `nonWeekend40Person12Hrs` | Night shift, weekday |

Weekend means Saturday or Sunday. A multi-night full-day booking is priced
**per night**, so a Fri→Mon stay mixes weekday and weekend rates.

Two things worth knowing:

- **The two night-shift fields are named confusingly.** `weekend12Hrs` is the
  *night* rate and `nonWeekend40Person12Hrs` is the weekday *night* rate. The
  names come from the original spreadsheet. Renaming them means a data
  migration, so they were left alone — but don't assume the names describe the
  meaning.
- **The server always recalculates the fee.** Whatever price the browser
  displayed is ignored on submit. `lib/pricing.ts` is shared by both sides so
  they agree, but the server's number is the one that gets stored.

### Without-AC discount

Guests can opt out of air conditioning for a flat discount (`NO_AC_DISCOUNT`,
currently Rs 20,000). It is applied server-side in the same place the fee is
calculated, so the quoted price and the stored price always match.

### Fallbacks

`priceValue()` falls back to `PRICE_DEFAULTS` whenever a field is missing or the
database is unreachable. That's why the public pricing section still renders
sensible numbers if Atlas is down — but it also means a genuinely broken
connection shows *stale-looking* prices rather than an error. The landing page
logs a warning when this happens.

## Data flow of a booking

1. Guest picks a date in the landing hero → `/booking?date=YYYY-MM-DD`
2. `/booking` loads availability + pricing and lists every option for the range
3. Guest submits → `POST /api/bookings`
   - validates phone (normalised to `92XXXXXXXXXX`), dates, times
   - re-checks for clashes
   - calculates the fee server-side
   - saves as `pending` with a generated `bookingCode` (`FH-XXXXXX`)
   - fires a WhatsApp message (failure here does **not** fail the booking)
4. Booking code is saved to `localStorage`, so the status widget can poll it
5. Admin approves or rejects → another WhatsApp message goes out
6. Guest checks `/track/FH-XXXXXX` any time

## WhatsApp

Business-initiated messages (booking received, booking confirmed) must use
**pre-approved Meta templates**. Free-text replies only work inside the 24-hour
window after a guest messages first — which is why admin chat replies are plain
text but automated notifications are templates.

If a template send fails, `lib/whatsapp.ts` falls back to plain text. That
succeeds in the 24-hour window and fails silently outside it, which is the right
trade-off: a notification problem should never break a booking.

`WHATSAPP_ENABLED=false` logs messages to the console instead of sending, and
still records them in the database.

### Webhook

`POST /api/whatsapp/webhook` records incoming guest messages.

**It processes before responding.** The original Express version acked with a
200 first and saved afterwards — on serverless the function is frozen the moment
a response is returned, so that would silently drop every message. It also
always returns 200 even on error, because Meta disables webhooks that look
flaky.

Duplicate deliveries are deduped on `waMessageId` via a partial unique index.

## Admin authentication

The `ADMIN_KEY` never reaches the browser.

1. `POST /api/admin/login` compares the submitted key in constant time
2. On success the server issues `<expiry>.<hmac>`, signed with `ADMIN_KEY`
3. That goes back as an `httpOnly`, `sameSite=lax` cookie lasting 8 hours
4. Every admin route verifies the signature and expiry before doing anything

`proxy.ts` also gates the `/admin` pages, but that's only a UX redirect —
the real enforcement is per-route, since the proxy alone would leave the API
open.

Login attempts are throttled per IP. On serverless each instance keeps its own
counter, so this slows guessing down without being a hard guarantee.

Both admin routes are `noindex` — the dashboard sits on the public marketing
domain.

## Serverless notes

**Connection caching.** `lib/db.ts` caches the Mongoose connection promise on
`globalThis`. Without it every invocation opens a new pool and exhausts the
Atlas connection limit under any real traffic.

**DNS.** Node's resolver can't do SRV lookups on some local networks, breaking
`mongodb+srv://` URIs with `querySrv ECONNREFUSED`. `lib/db.ts` forces public
resolvers when not running on Vercel. This is a local-development workaround
only.

**Rendering.** The landing page is ISR with `revalidate = 300`, so an admin price
change appears publicly within five minutes without a redeploy. Everything under
`/api` and the admin pages are dynamic.

## Things that are still hardcoded

Facilities, gallery images, terms, contact details, opening hours and all
marketing copy live in the components — the admin cannot edit them. Making them
editable means new models, new admin screens and image uploads; it was
deliberately left out of scope.

# Vicky Farmhouse

The full website for Vicky Farmhouse — the public marketing site, the guest
booking flow, and the staff admin dashboard, all in one Next.js app.

**Live:** [vickyfarmhouse.com](https://vickyfarmhouse.com)

---

## What's in here

| Area | Route | Who it's for |
|---|---|---|
| Marketing site | `/` | Visitors |
| Booking flow | `/booking` | Guests picking a date and slot |
| Booking tracker | `/track`, `/track/[code]` | Guests checking their request status |
| Admin dashboard | `/admin` | Staff |
| API | `/api/*` | Internal — used by the pages above |

There is **no separate backend service**. The database, the WhatsApp
integration and the admin API all run inside this app as Next.js route handlers.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** for the marketing site; plain scoped CSS for the booking
  and admin pages (see [Styling](#styling))
- **Framer Motion** for landing-page animation
- **MongoDB** via **Mongoose**
- **Recharts** for admin analytics
- **Meta WhatsApp Cloud API** for guest notifications

## Getting started

```bash
npm install
cp .env.example .env.local    # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You need at minimum `MONGODB_URI` and `ADMIN_KEY` in `.env.local`. Keep
`WHATSAPP_ENABLED=false` locally so testing never messages real guests. Every
variable is documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

Without a database the public pages still render — prices fall back to the
defaults in `lib/pricing.ts` and the calendar shows every date as available.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
app/
├─ page.tsx                 landing page (reads live prices from the DB)
├─ booking/                 date + slot picker, availability, booking form
├─ track/                   guest-facing status lookup
├─ admin/                   dashboard + sign-in page
└─ api/
   ├─ bookings/             public: create, look up, availability, pricing
   ├─ admin/                protected: bookings, stats, settings, chats
   └─ whatsapp/webhook/     incoming WhatsApp messages from Meta

lib/
├─ db.ts                    cached Mongoose connection (serverless-safe)
├─ models/                  Booking, Setting, Message
├─ pricing.ts               price rules, shared by the UI and the server
├─ availability.ts          slot-aware clash detection
├─ whatsapp.ts              Cloud API client + message templates
├─ adminAuth.ts             signed session cookie helpers
└─ api.ts                   typed browser-side API client

components/                 landing sections, shared pickers, admin dashboard
middleware.ts               gates /admin behind a valid session
styles/                     globals (Tailwind) + scoped page stylesheets
```

## Documentation

| Document | For | Covers |
|---|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Developers | Booking model, slot rules, pricing, WhatsApp, admin auth, serverless notes |
| [API.md](./API.md) | Developers | Every endpoint, request/response shapes, status codes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Whoever owns Vercel + Meta | Environment variables, WhatsApp webhook cutover, go-live steps |
| [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) | Farmhouse staff | Day-to-day use of the dashboard — no technical knowledge needed |

## How it works

A short version — see [ARCHITECTURE.md](./ARCHITECTURE.md) for the details.

- A guest picks a date on the landing page and lands on `/booking`, which shows
  every slot available on those dates with a live price.
- Submitting creates a **pending** booking and sends a WhatsApp confirmation
  with a tracking link.
- Staff approve or reject it in `/admin`; the guest gets another WhatsApp
  message either way.
- Prices and shift timings are edited in **Admin → Settings** and flow straight
  through to the public pricing section and every quoted fee.

## Styling

Three separate systems, deliberately kept apart:

- **Landing page** — Tailwind utilities, navy `#06233a` + gold `#e6a334`
- **Booking / track** — `styles/booking.css`, scoped under `.bk-page`
- **Admin** — `styles/admin.css`, scoped under `.admin-page`

The booking and admin stylesheets use generic selectors (`.btn`, `label`,
`input`, `.modal`) inherited from the original standalone apps. The `.bk-page`
and `.admin-page` wrappers are what keep them from leaking into the Tailwind
landing page — **don't remove those wrapper classes.**

`styles/datepicker.css` is shared by both and is global, since the calendar
appears in the landing hero, the booking page and the admin filters. It takes
its accent colour from a CSS variable so each context can retint it.

## Deployment

Hosted on Vercel with `vickyfarmhouse.com` as the custom domain. Environment
variables, the WhatsApp webhook cutover and admin access are all covered in
[DEPLOYMENT.md](./DEPLOYMENT.md).

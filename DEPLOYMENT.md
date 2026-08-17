# Deployment Handover — vickyfarmhouse.com

This app now contains the **full stack**: the public site, the booking flow, the
booking API, the WhatsApp integration and the admin dashboard. There is no
separate backend service to deploy any more.

Everything below has to be done **once**, by whoever owns the Vercel project and
the Meta (WhatsApp) app.

---

## 1. Environment variables (Vercel)

Add these under **Vercel → Project → Settings → Environment Variables**, for
**Production** (and Preview if you use preview deploys).

Without these the site still builds and the public pages render, but bookings,
tracking, WhatsApp and the admin dashboard will not work.

| Variable | Required | What it is |
|---|---|---|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string (`mongodb+srv://…`). Use the **existing** database so current bookings, guests and prices carry over. |
| `ADMIN_KEY` | **Yes** | The password for `/admin`. Use a long random string. Anyone with this can approve bookings and change prices. |
| `WHATSAPP_ENABLED` | Yes | `true` in production. `false` disables sending (useful for testing). |
| `WHATSAPP_TOKEN` | Yes | Meta permanent System User access token. |
| `WHATSAPP_PHONE_NUMBER_ID` | Yes | Phone number ID from Meta → WhatsApp → API Setup. |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | Yes | Any secret string you choose. Must match what you enter in Meta (step 2). |
| `FRONTEND_URL` | Yes | `https://vickyfarmhouse.com` — used to build tracking links inside WhatsApp messages. **No trailing slash.** |
| `FARMHOUSE_NAME` | Yes | e.g. `Vicky Farmhouse` — appears in guest messages. |
| `FARMHOUSE_LOCATION_URL` | Yes | Google Maps link sent after a booking is approved. |
| `FARMHOUSE_CONTACT` | Yes | Contact number shown in guest messages. |
| `WHATSAPP_USE_TEMPLATES` | Optional | Defaults to `true`. Business-initiated messages must use approved templates. |
| `WHATSAPP_TEMPLATE_LANG` | Optional | Defaults to `en`. |
| `WHATSAPP_TEMPLATE_BOOKING_CREATED` | Optional | Defaults to `booking_received`. |
| `WHATSAPP_TEMPLATE_BOOKING_APPROVED` | Optional | Defaults to `booking_confirmed`. |
| `WHATSAPP_CREATED_TEMPLATE_HAS_LINK` | Optional | Leave unset/`false`. Only set to `true` **after** the `booking_received` template is re-approved with an 8th variable for the tracking link — otherwise every send fails on a parameter-count mismatch. |

The current values for all of these are in the old backend's `.env` file.

### MongoDB Atlas network access

Vercel functions do not have fixed IPs. In **Atlas → Network Access**, allow
`0.0.0.0/0` (and rely on the database user password), or use Atlas's Vercel
integration. If Atlas is IP-restricted to the old server, **the site cannot
reach the database.**

Atlas region should be close to the Vercel region (currently `bom1`, Mumbai),
otherwise every query pays a round-trip penalty.

---

## 2. WhatsApp webhook cutover

The webhook currently points at the old backend. Once this app is live:

**Meta App Dashboard → WhatsApp → Configuration → Edit**

- **Callback URL:** `https://vickyfarmhouse.com/api/whatsapp/webhook`
- **Verify token:** exactly the value of `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- Subscribe to the **`messages`** field

Meta calls the URL once to verify; it must return the challenge. If verification
fails, check that `WHATSAPP_WEBHOOK_VERIFY_TOKEN` in Vercel matches what you
typed in Meta.

> **Do this only after the deploy is live.** Between switching the URL and the
> deploy going out, incoming guest messages are not recorded anywhere.

Keep the old backend running until the new webhook is confirmed working, then
shut it down.

---

## 3. Admin access

- URL: `https://vickyfarmhouse.com/admin`
- Sign in with `ADMIN_KEY`

Security notes:

- The key is exchanged for a signed, `httpOnly` session cookie that lasts 8
  hours. The key itself is never stored in the browser.
- Repeated failed sign-ins from one IP are throttled.
- `/admin` and `/admin/login` are marked `noindex`, so they will not appear in
  Google.
- Anyone with `ADMIN_KEY` has full control. Treat it like a password: long,
  random, not shared over WhatsApp, and rotated if it ever leaks. Rotating it
  is just changing the variable in Vercel and redeploying — it signs everyone
  out.

---

## 4. What the admin controls on the public site

Prices set in **Admin → Settings** appear on the public pricing section and drive
every quoted booking fee. The public page re-reads them at most every 5 minutes,
so a price change shows up without a redeploy.

Shift timings set there are used for day/night bookings and in WhatsApp messages.

Facilities, gallery, terms and contact details are still hardcoded in the site
and are **not** editable from the admin.

---

## 5. Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Keep `WHATSAPP_ENABLED=false` locally so testing never messages real guests.

If you hit `querySrv ECONNREFUSED` when connecting to Atlas, that is a local DNS
limitation — the app already forces public DNS resolvers outside Vercel to work
around it.

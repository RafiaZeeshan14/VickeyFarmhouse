# Admin Dashboard — Staff Guide

A practical guide for whoever runs bookings day to day. No technical knowledge
needed.

Written in English because every button and label in the dashboard is in
English — so the words here match exactly what you see on screen.

---

## Signing in

Go to **vickyfarmhouse.com/admin** and enter the admin key.

You stay signed in for **8 hours**, then it asks again. Use **Sign out** in the
bottom-left when you're on a shared computer.

Anyone with the admin key can approve bookings and change prices. Don't send it
over WhatsApp, and tell your developer immediately if it leaks — changing it
takes two minutes.

---

## Overview

The first screen. What each number means:

| Card | Meaning |
|---|---|
| **Total bookings** | Every request ever made, all statuses |
| **Collected revenue** | Money actually received (what you entered as *Amount Paid*) |
| **Outstanding** | Billed but not yet received |
| **Upcoming stays** | Approved bookings with a future check-in |
| **Customers** | Unique WhatsApp numbers that have ever booked |
| **Unread messages** | Guest messages nobody has opened yet |

Below that: a bookings trend chart, a status breakdown, which booking type is
most popular, upcoming arrivals, and recent activity.

**Collected revenue only counts what you type in.** If you approve a booking
without filling *Amount Paid*, revenue stays at zero even though the guest paid.

---

## Bookings

The main working screen.

### Finding a booking

- The five cards at the top (Total / Pending / Approved / Rejected / Cancelled)
  are **clickable filters**
- Search by guest name, WhatsApp number, or booking ID (`FH-XXXXXX`)
- The two date boxes filter by **check-in** date
- **Clear** resets everything

### Approving

Click **Approve** on a pending booking. You'll be asked for:

- **Total Fee** — what the guest owes. Pre-filled with the system's calculated
  price; change it if you agreed something different
- **Amount Paid** — what you've actually received so far. Leave 0 if nothing yet
- **Notes** — internal only, the guest never sees this

The guest immediately gets a WhatsApp confirmation with the location and timings.

**Fill in the fee and paid amount.** These drive the revenue and outstanding
numbers on the Overview. Approving with blanks makes your reports wrong.

### Rejecting and cancelling

- **Reject** — for a pending request you can't accept
- **Cancel** — for a booking you already approved

Both let you add an optional **Reason**, which **is sent to the guest**. Keep it
polite and short.

You cannot reject an already-approved booking — cancel it instead.

### Editing

**Edit** changes any detail: name, number, dates, times, guest count, booking
type, fee, amount paid.

Editing does **not** message the guest. If you move someone's dates, tell them
yourself in Conversations.

### Deleting

**Delete** removes the record permanently. There is no undo and it disappears
from all reports.

Prefer **Cancel** — it keeps the history. Only delete genuine mistakes like test
entries or duplicates.

### Why a booking might refuse to approve

If you see *"Dates clash with an approved booking"*, someone else's booking took
that slot while this request was sitting pending. Two guests cannot hold the
same slot.

Remember how slots work:

- A **Full Day** booking blocks the whole date — no other booking that day
- A **Day Shift** and a **Night Shift** on the same date are fine together

---

## Customers

Every guest who has ever booked, grouped by WhatsApp number.

Shows how many times they've booked, how many were approved, and what they've
paid against what they were billed — useful for spotting repeat guests.

**View bookings** jumps to that guest's full booking history.

---

## Conversations

Guest WhatsApp messages, and where you reply.

The list refreshes automatically every 10 seconds; an open chat refreshes every
5. Unread counts show on the sidebar and the bell icon.

### The 24-hour rule — read this

WhatsApp only lets a business send **free-text** messages within **24 hours** of
the guest's last message.

- Guest messaged recently → your reply goes through normally
- Guest hasn't messaged in over 24 hours → **your reply will fail**

This is Meta's rule, not a bug in the dashboard. Automatic messages (booking
received, booking confirmed) use pre-approved templates and work at any time —
which is why those always arrive but a manual reply sometimes doesn't.

If a reply fails, use **Open WhatsApp** in the chat header to message from your
own phone instead.

---

## Settings

Where you set prices and shift timings.

### Prices

Six packages. Weekend means **Saturday and Sunday**; everything else is
non-weekend.

- Weekend / Non-Weekend — 24 Hrs
- Weekend / Non-Weekend — 12 Hrs (Day)
- Weekend — 12 Hrs, and Non-Weekend — 40 Person — 12 Hrs *(these two are the
  night-shift rates, despite the names)*

**These prices appear on the public website.** Change one and the pricing
section on vickyfarmhouse.com updates within about 5 minutes. No developer
needed.

They also decide what every new booking is quoted. Existing bookings keep the
price they were created with.

For a multi-night booking each night is priced separately — a Friday-to-Monday
stay mixes weekday and weekend rates.

### Shift schedule

The start and end times for day and night shifts. These show on the booking page
and in guest WhatsApp messages. Night shift ends the **next** morning.

Click **Save Settings** — a green confirmation appears.

---

## Common situations

**A guest says they never got a WhatsApp message.**
Check Conversations for their number. If nothing was sent, the message failed —
your developer can check the logs. Meanwhile send them their booking ID
manually; they can check status at vickyfarmhouse.com/track.

**A guest wants to change their dates.**
Edit the booking with the new dates, then message them in Conversations. Editing
sends nothing automatically.

**Two people want the same date.**
Whoever is approved first gets it. The second will show a clash when you try to
approve. Offer them the other shift if only one slot is taken.

**Prices on the website look wrong.**
Check Settings — the website shows exactly what's saved there. Give it 5 minutes
after saving.

**Someone paid a deposit only.**
Put the full amount in *Total Fee* and just the deposit in *Amount Paid*. The
difference shows under Outstanding.

**The dashboard signed me out.**
Sessions last 8 hours. Sign in again.

---

## What you cannot change here

Facilities, photo gallery, terms and conditions, contact details and opening
hours are all built into the website. Changing those needs a developer.

The dashboard controls **prices, shift timings and bookings** — nothing else on
the public site.

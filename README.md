# Cake Order Book v2 — setup in 5 minutes

## Files
- **cake-order-book-v2.html** — the website. Double-click to open in Chrome. Works offline; no internet needed except for Google Sheet sync.
- **Code.gs** — the bridge script for your Google Sheet (v2: supports JSONP, the same connection method the sentence bank used for years). Same code is also inside the site's 🔗 Connect Sheet tab (with a copy button).

## IMPORTANT: if you deployed the older Code.gs before
The new page needs the new script. In Apps Script: select all (Ctrl+A) → paste the new **Code.gs** → Ctrl+S → **Deploy → Manage deployments** → ✏️ → **New version** → **Deploy**. The web app URL stays the same.

## What v2 does
- 🧾 New Order → timestamped slip, copy to WhatsApp / download .txt (the "proof")
- 📖 Order Book → all orders, search by name/phone, filter by status
- 📦 Today's Pickups → auto-filtered by pickup date
- Summary bar → pending count, today's count, total ₹ still to collect
- Status buttons → Picked up ✅ / Cancelled ✖ on each order
- Data is saved on the computer (demo mode) until you connect the sheet

## Connect your Google Sheet — already done ✅
The correct web app address is **built into the page** (verified working end-to-end
2026-10-04: add → list → cancel). Just open the file and use it — no pasting, no Save,
no Test needed. The 🔗 Connect Sheet tab shows "(built-in — no setup needed)".

If you ever redeploy the script (new address), paste the new URL in the tab → Save.

## Test it
- Add a test order → check the new "Orders" sheet tab in your Google spreadsheet
- Mark it picked up → the Status column changes
- Open the `/exec` URL + `?action=list` in Chrome → you see your orders as text

## For the classroom (later)
This single file can go on GitHub Pages exactly like your sentence-bank sites
(free hosting, your manual's method) — that can be the students' deployment lesson.

# Bugs

Every bug found while building and deploying CausalFunnel: what went wrong, why, and how it was fixed.

| # | Bug | Area | Status |
|---|---|---|---|
| 1 | "View journey" shows 404 right after "New session" | Tracker | Fixed |
| 2 | "Buy now" empties the whole cart | Store | Fixed |
| 3 | "Added to cart ✓" never changes | Store | Fixed |
| 4 | Journey shows raw HTML tags and the wrong element | Tracker + dashboard | Fixed |
| 5 | Heatmap previews of cart, checkout and thank-you are empty | Store | Fixed |
| 6 | Sessions table looks out of order | Dashboard + API | Fixed |
| 7 | Small store issues (emoji, "1 items", red size hint, featured products) | Store | Fixed |
| 8 | Render deploy fails with `Missing script: "start"` | Deployment | Fixed |
| 9 | Hosted store can't reach the backend; session badge missing | Deployment | Fixed |
| 10 | "Open store" link broken on the hosted dashboard | Deployment | Fixed |
| 11 | "View journey" shows 404 for every new visitor | Tracker | Fixed |
| 12 | Heatmap dropdown lists `/checkout` and other pages twice | Dashboard | Fixed |
| 13 | Click labels show in capitals ("ADD TO CART") | Tracker | Open |

---

## 1. "View journey" shows 404 right after "New session"

**Problem:** clicking **New session** and then **View journey** showed *"Could not load this session
(Request failed (404))"*.

**Why:** the tracker doesn't send events one by one. It queues them and sends a batch every 2 seconds.
"New session" created a new session id and queued its first page view, but didn't send it. Clicking
"View journey" within those 2 seconds asked the server for a session it had never received.

**Fix:** "New session" sends its first page view immediately. (Later replaced by the general fix in
#11.)

---

## 2. "Buy now" empties the whole cart

**Problem:** with several items in the cart, buying one product with **Buy now** ordered everything in
the cart and left it empty.

**Why:** "Buy now" added the product to the cart and then opened checkout. Checkout always ordered
the whole cart and cleared it afterwards, so there was no way to buy just one item.

**Fix:** "Buy now" passes only that product and size to checkout and leaves the cart untouched.
Ordering from the cart page still orders the whole cart and then empties it.

---

## 3. "Added to cart ✓" never changes

**Problem:** after adding a size 8 shoe the page said "Added to cart ✓". Adding size 9 changed
nothing on screen, so it looked like the second add hadn't worked.

**Why:** the message was a flag that turned on after the first add and was never turned off. Later
adds did go into the cart, but the screen couldn't show it.

**Fix:** replaced the message with a toast that appears for 2 seconds on every add, e.g.
*"Running Shoes (Size 9) added to cart"*.

---

## 4. Journey shows raw HTML tags and the wrong element

**Problem:** the session timeline showed clicks as `<div> "Nike Air Max ₹4,999 Shoes Free…"`, which
exposes how the page is built and is hard to read.

**Why:** two things:
- The dashboard printed the stored HTML tag name.
- The tracker recorded the innermost element under the cursor. Clicking text inside a button or a
  product card recorded a `<span>` or `<div>`, and its text was the whole card squashed together.

**Fix:**
- The tracker now records the nearest button, link or field. It labels it with its `aria-label`, its
  first line of text containing a letter (this skips the product emoji), its placeholder or its alt
  text.
- The dashboard shows *Clicked "Add to cart"* and never shows tags.

---

## 5. Heatmap previews of cart, checkout and thank-you are empty

**Problem:** on the heatmap, the preview of `/cart`, `/checkout` and `/thank-you` showed an empty cart
or the home page instead of the real page, so the click dots didn't line up with anything.

**Why:** the preview loads the store inside an iframe, and that iframe has no cart and no placed order.
The store's guards then did their job: checkout with an empty cart redirects to the cart, and
thank-you without an order redirects home.

**Fix:** in preview mode (`?cf_preview=1`), the cart, checkout and thank-you pages show sample
content, so they render like a real visit.

---

## 6. Sessions table looks out of order

**Problem:** the **Started** column read 1:56, 1:44, 1:45, 1:42, which looked shuffled.

**Why:** the API sorted sessions by **last activity**, but the table showed **start time**. A session
that started earlier but was active later appeared above one that started later.

**Fix:** sessions are sorted by start time, newest first. Dates were also shortened to
`15 Oct, 1:45 am`.

---

## 7. Small store issues

| Problem | Why | Fix |
|---|---|---|
| Nav "Cart" showed a grey glyph on Windows; journeys showed *Clicked "🛒 ADD TO CART"* | Emoji in button text render differently per OS, and the tracker records them as part of the label | Plain-text buttons |
| "Price (1 items)" | The text always added "items" | "1 item" / "2 items" |
| Red "Please select a size" before the user did anything | The hint was always red when no size was picked | Grey hint at first; red only after Add to cart or Buy now without a size |
| Featured products were 3 shoes and a cap | "Featured" was just the first 4 products alphabetically | A fixed mix across categories |
| Size and quantity clicks showed as *Clicked "8"* and *Clicked "+"* | The buttons' visible text has no context | Added labels: "Size 8", "Increase quantity" |

---

## 8. Render deploy fails with `Missing script: "start"`

**Problem:** the Render deploy log ended with `npm error Missing script: "start"`.

**Why:** Render ran its default `npm start` in the repo root. The root `package.json` only has a
`dev` script; the server's `start` script is in `server/package.json`.

**Fix:** set Render's commands to `npm install --prefix server` (build) and
`npm start --prefix server` (start), with Root Directory left empty. Root Directory must stay
empty because the API also serves the `tracker/` folder, which sits outside `server/`.

---

## 9. Hosted store can't reach the backend; session badge missing

**Problem:** the hosted store couldn't load data from the API, and the session badge with
"View journey" never appeared.

**Why:** two mistakes together:
1. The first build used a placeholder API address (`causalfunnel-api.onrender.com`) that doesn't
   exist. The tracker script couldn't load from it, so the tracker never started and the badge,
   which only shows once the tracker is running, stayed hidden.
2. The variables were then renamed to `API_URL` and `DASHBOARD_URL`, without the `VITE_` prefix.
   Vite only reads variables that start with `VITE_`, so every new build failed with
   *"Failed to resolve %VITE_API_URL%"*, and Vercel kept serving the old broken build.

**Fix:** renamed them to `VITE_API_URL` and `VITE_DASHBOARD_URL` with the real addresses, then
redeployed. Vite bakes these values in at build time, so any change needs a redeploy.

---

## 10. "Open store" link broken on the hosted dashboard

**Problem:** the dashboard's "Open store" link didn't open the store.

**Why:** `VITE_STORE_URL` was set to `cstore-five.vercel.app` without `https://`. Browsers treat that
as a path on the dashboard's own site, not a separate website.

**Fix:** set it to `https://cstore-five.vercel.app` and redeployed.

---

## 11. "View journey" shows 404 for every new visitor

**Problem:** on the hosted site, opening the store in a new browser (Edge, Brave, Chrome) and
clicking "View journey" showed the 404 message again.

**Why:** the same batching delay as #1, but on a first visit. Fix #1 only covered the
"New session" button. A session also starts on a visitor's first visit or after 30 minutes idle, and
then the first page view still waited up to 2 seconds. Each browser has its own storage, so each one
counted as a new visitor. Tested: the session returned 404 for about 3 seconds, then 200.

**Fix:** the tracker sends page views immediately and only batches clicks. A session now exists on
the server from its first page view. Verified in Microsoft Edge with a brand-new visitor and with
"New session".

---

## 12. Heatmap dropdown lists `/checkout` and other pages twice

**Problem:** the heatmap's page list showed `/checkout`, `/thank-you`, `/products` and others twice.

**Why:** the local store (`http://localhost:5173`) and the hosted store
(`https://cstore-five.vercel.app`) save events into the same database. The tracker stores full
addresses, so `http://localhost:5173/checkout` and `https://cstore-five.vercel.app/checkout` are
different pages. The dropdown shows only the path, so both appeared as `/checkout`.

**Fix:** the dashboard lists only pages from its own store (`VITE_STORE_URL`). The hosted dashboard
shows hosted pages only; the local dashboard shows local pages only. The database is unchanged, and
local events are hidden, not deleted.

---

## 13. Click labels show in capitals (open)

**Problem:** journeys show *Clicked "ADD TO CART"*, *"PLACE ORDER"*, *"CONFIRM ORDER"*.

**Why:** the store's buttons are styled to display in capitals (`text-transform: uppercase`), and
the tracker records text the way the browser displays it.

**Possible fixes:**
- **Tracker:** read the button's original text instead of the displayed text. The store looks the
  same, but the product-card label logic needs a small adjustment.
- **Store:** remove the capitals styling from buttons.

Either way, clicks recorded before the fix keep their capital labels.

---

## Known limitation

**Old local sessions show blank heatmap previews on the hosted dashboard.** Their page addresses
point at `localhost`, which the hosted dashboard can't load. Since fix #12, those pages no longer
appear in the hosted heatmap dropdown.

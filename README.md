# CausalFunnel – User Analytics

A small full-stack analytics tool that tracks how visitors use an e-commerce site and shows their
behaviour in a dashboard.

It has three parts:

- **Tracker**: a plain JavaScript script that any website can include with one `<script>` tag. It
  records **page views** and **clicks** (with x/y position) and sends them to the API.
- **ShopDemo**: a demo store (home → products → product → cart → checkout → thank-you) with the
  tracker installed, used to generate real data.
- **Dashboard**: a React app that lists sessions, replays each visitor's journey step by step, and
  shows a click **heatmap** drawn on top of the real page.

```
 ShopDemo (5173)            API (5000)               Dashboard (5174)
 + tracker script  ──────▶  Express + MongoDB  ◀──────  React
   page views, clicks        stores events            sessions, journeys, heatmap
```

---

## Features

**Tracking**
- Anonymous `session_id` kept in `localStorage`; a new session starts after 30 minutes of inactivity.
- Page views on first load and on every client-side route change (works with single-page apps).
- Clicks with page coordinates, viewport width, page height and a short label of what was clicked.
- Page views are sent immediately; clicks are batched. Both use `navigator.sendBeacon`, so clicks that
  navigate away are not lost.

**Dashboard**
- **Overview**: totals (sessions, page views, clicks, average clicks per session, pages tracked) and
  recent sessions.
- **Sessions**: every session with its event counts, start time and duration, paginated.
- **Session journey**: the ordered list of events, grouped by page, e.g. `/products/leather-boots`
  → *Clicked "Size 8"* → *Clicked "Add to cart"*.
- **Heatmap**: pick a page and see clicks as dots or a grid, drawn over a live preview of that page.
  Can be filtered to a single session.

**Testing helper**: the store shows a small badge with your session id, a **New session** button, and
a **View journey** link that opens your session in the dashboard.

---

## Tech stack

| Part | Technology |
|---|---|
| Tracker | Vanilla JavaScript (ES modules), no dependencies |
| API | Node.js, Express 5, Mongoose |
| Database | MongoDB (local or Atlas) |
| Store and dashboard | React 19, React Router 7, Vite |
| Styling | Plain CSS per component, no UI library |
| Dev tooling | nodemon, concurrently, oxlint |

---

## Project structure

```
CausalFunnel/
├── tracker/      tracking script (served by the API at /tracker/index.js)
├── server/       Express API: routes/, controllers/, services/, models/, seed/
├── client/       ShopDemo store (tracked)
├── dashboard/    analytics dashboard (not tracked)
└── package.json  runs all three apps together
```

---

## Setup

**Requirements:** Node.js 20+, and MongoDB (local install or a free MongoDB Atlas cluster).

1. **Install dependencies**

   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   npm install --prefix dashboard
   ```

2. **Create the env files** from the examples

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   cp dashboard/.env.example dashboard/.env
   ```

   In `server/.env`, set `MONGODB_URI` to your database (the default points to a local MongoDB).

   | File | Variable | Default |
   |---|---|---|
   | `server/.env` | `PORT` | `5000` |
   | `server/.env` | `MONGODB_URI` | `mongodb://127.0.0.1:27017/causalfunnel` |
   | `client/.env` | `VITE_API_URL` | `http://localhost:5000` |
   | `client/.env` | `VITE_DASHBOARD_URL` | `http://localhost:5174` |
   | `dashboard/.env` | `VITE_API_URL` | `http://localhost:5000` |
   | `dashboard/.env` | `VITE_STORE_URL` | `http://localhost:5173` |

3. **Seed the products** (30 products: 10 each in clothing, accessories and footwear)

   ```bash
   npm run seed --prefix server
   ```

4. **Start everything**

   ```bash
   npm run dev
   ```

   | App | URL |
   |---|---|
   | ShopDemo store | http://localhost:5173 |
   | Dashboard | http://localhost:5174 |
   | API | http://localhost:5000 |

5. **Try it**: open the store, browse, add something to the cart and check out. Then click
   **View journey** in the bottom-right badge, or open the dashboard and pick your session. Open the
   **Heatmap** tab to see where you clicked.

---

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/events` | Receive one event or an array of events (max 500 per request) |
| `GET` | `/api/sessions?page=&limit=` | Sessions with event, page view and click counts |
| `GET` | `/api/sessions/:id/events` | All events of one session, in time order |
| `GET` | `/api/pages` | Tracked pages with page view and click counts |
| `GET` | `/api/heatmap?url=&session_id=` | Click positions for a page, optionally for one session |
| `GET` | `/api/stats` | Overall totals for the dashboard |
| `GET` | `/api/products`, `/api/products/:slug` | Product data for the demo store |
| `GET` | `/tracker/index.js` | The tracking script |

**Event shape**

```json
{
  "session_id": "a2edaa1a-47c5-4a06-a10d-f689ce50ebfe",
  "event_type": "click",
  "page_url": "http://localhost:5173/products/leather-boots",
  "timestamp": "2026-10-15T08:15:39.000Z",
  "x": 214, "y": 536, "x_percent": 34.2,
  "viewport_width": 1366, "page_height": 800,
  "target": { "tag": "button", "id": null, "text": "Add to cart" }
}
```

**Adding the tracker to any site**

```html
<script type="module" src="http://localhost:5000/tracker/index.js"
        data-endpoint="http://localhost:5000/api/events"></script>
```

---

## Assumptions

- **A session is an anonymous browsing session**, not a login. Most shoppers never sign in, so the
  tracker gives each browser a random id and ends the session after 30 minutes without activity,
  the common industry definition.
- **Only page views and clicks** are tracked, as the assignment asks. No scrolls, form input or
  keystrokes are recorded, so no personal data typed by visitors is collected.
- **The dashboard is open** (no login). It's an internal tool for this assignment and reviewers can
  open it straight away.
- **The store has a fixed 1200px-wide centred layout**, so a click's x/y position means the same thing
  on different screen sizes and the heatmap lines up with the page.
- **Payments are fake.** Checkout only collects an address and confirms the order; nothing is charged.
- **One website is tracked.** There is no `site_id` and no multi-tenant setup.

---

## Design decisions and trade-offs

**1. Vanilla JavaScript tracker**
The tracker is what a customer would paste into their own site, which could be Shopify, WordPress or
any framework. So it has no dependencies and doesn't rely on React.
*Trade-off:* the store and dashboard use React, the tracker doesn't. This is how analytics scripts
are normally shipped.

**2. Two separate React apps (store and dashboard)**
Only the store's `index.html` includes the tracker, so the dashboard can never track itself. The
store is a single-page app on purpose: the tracker has to catch client-side route changes, which is
harder than tracking full page loads.
*Trade-off:* two apps to run and deploy instead of one.

**3. One `events` collection; sessions computed with aggregation**
Every event is a document in one collection. Session lists, counts and journeys are computed with
MongoDB aggregation when requested. Indexes on `{ session_id, timestamp }` (journeys) and
`{ page_url, event_type }` (heatmap) keep the queries fast.
*Trade-off:* one source of truth with nothing to keep in sync, but aggregating on every request gets
slower with millions of events. The fix would be a `sessions` collection updated as events arrive.

**4. Page views sent immediately, clicks batched, all with `sendBeacon`**
A page view is sent the moment it happens, so a new session exists on the server straight away and
**View journey** never opens an empty session. Clicks are queued and sent every 2 seconds, and also
when the tab is hidden or closed. Everything is sent as `text/plain` JSON, which avoids a CORS
preflight request.
*Trade-off:* one request per page view, but far fewer requests for clicks. Clicks can reach the
server up to 2 seconds late.

**5. Heatmap drawn over a live preview of the page**
The dashboard loads the real store page in an iframe and draws the clicks on top. The tracker turns
itself off inside an iframe or when the URL has `?cf_preview=1`, so previews don't create fake
events. In preview mode the cart, checkout and thank-you pages show sample content, so they can be
previewed even with an empty cart.
*Trade-off:* exact for the fixed-width store, approximate for fully responsive sites.

**6. Readable click labels instead of HTML tags**
The tracker records the button, link or field that was clicked, not the small element inside it.
It labels it with its `aria-label`, its first line of text, its placeholder or its image alt text.
The dashboard shows *Clicked "Add to cart"* and never shows tags like `<div>`.
*Trade-off:* labels depend on how the page is written. A button with no text and no `aria-label` shows
as *Clicked on page*.

**7. Server-side validation, invalid events dropped**
The API checks every event (session id, type, URL, timestamp, and x/y for clicks), saves the valid
ones and reports how many it rejected. A batch is never refused because of one bad event.
*Trade-off:* a misbehaving client loses only its bad events, but nothing alerts anyone about them.

**8. No state library**
The store's only shared state is the cart, kept in React Context with `useReducer` and saved to
`localStorage`. Dashboard pages fetch their own data with a small `useFetch` hook.
*Trade-off:* no Redux or Zustand boilerplate. If the dashboard needed shared filters or cached server
data, TanStack Query or Zustand would be the next step.

**9. "Buy now" checks out only that item**
"Buy now" sends just that product and size to checkout and leaves the cart untouched. Ordering from
the cart page orders the whole cart and then empties it.

**10. Simple, consistent UI**
Plain CSS, no UI library, one look per app. Effort went into tracking accuracy and a readable
dashboard rather than visual effects.

---

## Limitations and next steps

- **No dashboard login.** An admin password or API key from an env variable is the easy next step.
- **The ingest endpoint is open.** Anyone can post events; a per-site key and rate limiting would fix
  this.
- **Sessions are per browser.** The same person on two devices counts as two sessions.
- **No real-time updates.** The dashboard shows new data when a page is reloaded.
- **No sample sessions are seeded.** The seed adds products only; open the store and click around to
  generate data.
- **Possible additions:** a funnel view (home → product → cart → checkout → purchase drop-off),
  entry and exit pages per session, and a "top clicked elements" list on the heatmap page.

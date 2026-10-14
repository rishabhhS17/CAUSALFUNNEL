import { Event } from "../models/Event.js";

const clickFields = { _id: 0, x: 1, y: 1, x_percent: 1, viewport_width: 1, page_height: 1 };

export async function findPages() {
  return Event.aggregate([
    {
      $group: {
        _id: "$page_url",
        page_views: { $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] } },
        clicks: { $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] } },
      },
    },
    { $sort: { clicks: -1, _id: 1 } },
    { $project: { _id: 0, page_url: "$_id", page_views: 1, clicks: 1 } },
  ]);
}

export async function findClicks(url, sessionId) {
  const filter = { page_url: url, event_type: "click" };
  if (sessionId) {
    filter.session_id = sessionId;
  }
  return Event.find(filter, clickFields).lean();
}

export async function countTotals() {
  const [total, pageViews, clicks, sessions, pages] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ event_type: "page_view" }),
    Event.countDocuments({ event_type: "click" }),
    Event.distinct("session_id"),
    Event.distinct("page_url"),
  ]);

  return {
    total_events: total,
    sessions: sessions.length,
    page_views: pageViews,
    clicks,
    pages: pages.length,
  };
}

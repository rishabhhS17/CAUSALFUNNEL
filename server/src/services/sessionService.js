import { Event } from "../models/Event.js";

const groupBySession = {
  $group: {
    _id: "$session_id",
    event_count: { $sum: 1 },
    page_views: { $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] } },
    clicks: { $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] } },
    pages: { $addToSet: "$page_url" },
    first_seen: { $min: "$timestamp" },
    last_seen: { $max: "$timestamp" },
  },
};

const sessionFields = {
  $project: {
    _id: 0,
    session_id: "$_id",
    event_count: 1,
    page_views: 1,
    clicks: 1,
    pages: { $size: "$pages" },
    first_seen: 1,
    last_seen: 1,
  },
};

function pageOf(page, limit) {
  return {
    $facet: {
      sessions: [{ $skip: (page - 1) * limit }, { $limit: limit }, sessionFields],
      total: [{ $count: "count" }],
    },
  };
}

export async function findSessions(page, limit) {
  const [result] = await Event.aggregate([
    groupBySession,
    { $sort: { last_seen: -1, _id: 1 } },
    pageOf(page, limit),
  ]);

  let total = 0;
  if (result.total.length > 0) {
    total = result.total[0].count;
  }
  return { sessions: result.sessions, total };
}

export async function findSessionEvents(id) {
  return Event.find({ session_id: id }, { _id: 0 }).sort({ timestamp: 1 });
}

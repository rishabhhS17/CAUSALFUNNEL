import { findPages, findClicks, countTotals } from "../services/analyticsService.js";

export async function listPages(req, res) {
  const pages = await findPages();
  res.json(pages);
}

export async function getHeatmap(req, res) {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "The url query parameter is required" });
  }

  const clicks = await findClicks(url, req.query.session_id);
  res.json({ page_url: url, count: clicks.length, clicks });
}

export async function getStats(req, res) {
  const stats = await countTotals();
  res.json(stats);
}

import "./HeatmapOverlay.css";

const FRAME_WIDTH = 1200;
const MIN_HEIGHT = 800;
const CELL = 40;

function toFramePoint(click) {
  const offset = Math.max(0, (click.viewport_width - FRAME_WIDTH) / 2);
  return { x: click.x - offset, y: click.y };
}

function frameHeight(clicks) {
  let height = MIN_HEIGHT;
  for (const click of clicks) {
    if (click.page_height > height) {
      height = click.page_height;
    }
  }
  return height;
}

function previewUrl(url) {
  const preview = new URL(url);
  preview.searchParams.set("cf_preview", "1");
  return preview.href;
}

function countCells(points) {
  const cells = new Map();
  for (const point of points) {
    const key = `${Math.floor(point.x / CELL)}:${Math.floor(point.y / CELL)}`;
    cells.set(key, (cells.get(key) || 0) + 1);
  }
  return cells;
}

function Grid({ points }) {
  const cells = countCells(points);
  const max = Math.max(1, ...cells.values());
  const list = [];
  for (const [key, count] of cells) {
    const [col, row] = key.split(":").map(Number);
    const style = { left: col * CELL, top: row * CELL, width: CELL, height: CELL, opacity: 0.15 + 0.45 * (count / max) };
    list.push(<div key={key} className="heat-cell" style={style} title={`${count} clicks`} />);
  }
  return list;
}

function Dots({ points }) {
  return points.map((point, i) => <div key={i} className="heat-dot" style={{ left: point.x, top: point.y }} />);
}

export default function HeatmapOverlay({ url, clicks, mode }) {
  const points = clicks.map(toFramePoint).filter((point) => point.x >= 0 && point.x <= FRAME_WIDTH);
  const height = frameHeight(clicks);

  return (
    <div className="heatmap-frame" style={{ width: FRAME_WIDTH, height }}>
      <iframe src={previewUrl(url)} title="Page preview" width={FRAME_WIDTH} height={height} scrolling="no" />
      <div className="heatmap-layer">{mode === "grid" ? <Grid points={points} /> : <Dots points={points} />}</div>
    </div>
  );
}

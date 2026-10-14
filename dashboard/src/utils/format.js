export function shortId(id) {
  return id.slice(0, 8);
}

export function formatTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDuration(start, end) {
  const seconds = Math.round((new Date(end) - new Date(start)) / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

export function plural(count, word) {
  if (count === 1) {
    return `${count} ${word}`;
  }
  return `${count} ${word}s`;
}

export function pagePath(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

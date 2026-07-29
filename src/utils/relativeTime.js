// turns a timestamp into something like "2h ago" or "5d ago"
// pulled into its own file since multiple cards and screens need this

export function getRelativeTime(publishedAt) {
  const now = new Date();
  const then = new Date(publishedAt);
  const diffMs = now - then;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
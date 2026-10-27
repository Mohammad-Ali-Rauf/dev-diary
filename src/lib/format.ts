const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO timestamp as its calendar day, e.g. "October 28, 2026". */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** The first `length` characters of a log's content, for list previews. */
export function excerpt(content: string, length = 160): string {
  const text = content.trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

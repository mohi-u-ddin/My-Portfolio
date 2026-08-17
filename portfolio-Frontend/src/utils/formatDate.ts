// Formats an ISO date string (or null for "present") into a short label
// like "Jan 2026". Locale-aware for the month name.
export function formatMonthYear(dateStr: string | null, presentLabel = "Present", locale = "en-US"): string {
  if (!dateStr) return presentLabel;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
}

export function formatDateRange(
  start: string,
  end: string | null,
  presentLabel = "Present",
  locale = "en-US"
): string {
  return `${formatMonthYear(start, presentLabel, locale)} — ${formatMonthYear(end, presentLabel, locale)}`;
}

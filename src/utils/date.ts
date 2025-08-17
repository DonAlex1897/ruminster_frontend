// Robust timestamp parsing and relative time formatting utilities

// Parse various timestamp inputs to a Date or return null if invalid.
export const parseTimestamp = (input: unknown): Date | null => {
  if (input == null) return null;
  if (input instanceof Date && !isNaN(input.getTime())) return input;

  const toDateFromNumber = (n: number): Date | null => {
    let ms = n;
    if (n < 1e12) {
      // seconds -> ms
      ms = n * 1000;
    } else if (n > 1e15 && n < 1e18) {
      // microseconds -> ms
      ms = Math.floor(n / 1000);
    } else if (n >= 1e18) {
      // nanoseconds -> ms
      ms = Math.floor(n / 1e6);
    }
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  };

  if (typeof input === 'number') {
    return toDateFromNumber(input);
  }

  if (typeof input === 'string') {
    let s = input.trim();
    if (!s) return null;
    if (/^\d+$/.test(s)) {
      const asNum = Number(s);
      return toDateFromNumber(asNum);
    }
    // Trim fractional seconds > 3 digits to milliseconds precision (e.g. .500916Z -> .500Z)
    // Handles timezone suffix Z or ±HH:MM/±HHMM/±HH
    s = s.replace(/(\.\d{3})\d+(?=(Z|[+-]\d{2}:?\d{2}|[+-]\d{2})?$)/, '$1');
    // Normalize common non-ISO format "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
    const normalized = s.includes('T') ? s : s.replace(' ', 'T');
    const d1 = new Date(normalized);
    if (!isNaN(d1.getTime())) return d1;
    const d2 = new Date(s);
    return isNaN(d2.getTime()) ? null : d2;
  }

  const d = new Date(input as any);
  return isNaN(d.getTime()) ? null : d;
};

// Format a timestamp-like input into a relative time string: Xm, Xh, Xd.
export const formatRelativeTime = (input: unknown): string => {
  const date = parseTimestamp(input);
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs <= 0) return '0m';
  const diffInMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }
  const diffInHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

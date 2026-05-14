// Canonical date format used throughout the resume/profile-data flows: MM-YYYY.
// The special string "Present" represents an ongoing role/program.
//
// Legacy data in the database may use many shapes:
//   "01/2023"           "2023-01"          "Jan 2023"     "January 2023"
//   "01/15/2023"        "2023-01-15"       "Jan-2023"     "2023"
//   "01/2023 to 12/2023"  "Jan 2023 – Present"  "2020-2024"
// The helpers below parse those into a canonical {start, end, current} object
// for the UI to consume, and serialize back to "MM-YYYY to MM-YYYY" (or
// "MM-YYYY to Present") so the existing AI services keep working without
// schema changes.

export interface DateRange {
  start: string;     // "MM-YYYY" or ""
  end: string;       // "MM-YYYY" or "" (ignored if current === true)
  current: boolean;  // true means "Present"
}

const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const MONTH_ABBR = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function pad2(n: number | string): string {
  const s = String(n);
  return s.length >= 2 ? s : `0${s}`;
}

function monthIndexFromString(s: string): number | null {
  const lower = s.toLowerCase().trim();
  let idx = MONTH_NAMES.findIndex(m => m === lower);
  if (idx === -1) idx = MONTH_ABBR.findIndex(m => m === lower.slice(0, 3));
  return idx >= 0 ? idx + 1 : null;
}

/** Parse a single side of a date range into "MM-YYYY" or "" if unrecognized. */
export function parseToMonthYear(input: string): string {
  if (!input) return '';
  const trimmed = String(input).trim();
  if (!trimmed) return '';

  // Already canonical
  if (/^\d{2}-\d{4}$/.test(trimmed)) return trimmed;

  // MM/YYYY or MM/DD/YYYY
  const slash = trimmed.match(/^(\d{1,2})[\/\-](?:(\d{1,2})[\/\-])?(\d{4})$/);
  if (slash) {
    const month = pad2(slash[1]);
    return `${month}-${slash[3]}`;
  }

  // YYYY-MM-DD or YYYY-MM
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (iso) {
    return `${pad2(iso[2])}-${iso[1]}`;
  }

  // "Jan 2023", "January 2023", "Jan, 2023"
  const wordMatch = trimmed.match(/^([A-Za-z]+)[\s,\-]+(\d{4})$/);
  if (wordMatch) {
    const m = monthIndexFromString(wordMatch[1]);
    if (m) return `${pad2(m)}-${wordMatch[2]}`;
  }

  // "2023 Jan" or "2023 January"
  const reverseMatch = trimmed.match(/^(\d{4})[\s,\-]+([A-Za-z]+)$/);
  if (reverseMatch) {
    const m = monthIndexFromString(reverseMatch[2]);
    if (m) return `${pad2(m)}-${reverseMatch[1]}`;
  }

  // Pure year: "2023" — month defaults to 01.
  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) return `01-${yearOnly[1]}`;

  return '';
}

const RANGE_SEPARATORS = /\s*(?:to|–|—|-|until)\s*/i;

/** Detect whether a raw date string represents an ongoing role. */
export function isPresentToken(s: string): boolean {
  return /\b(present|current|now|ongoing)\b/i.test(s || '');
}

/** Parse a free-form `dates` string into a structured DateRange. */
export function parseDateRange(raw: string): DateRange {
  if (!raw) return { start: '', end: '', current: false };
  const text = String(raw).trim();
  if (!text) return { start: '', end: '', current: false };

  // Split on "to", em-dash, en-dash, hyphen, or "until".
  // We must be careful not to split on the hyphen inside "MM-YYYY".
  // Strategy: protect "MM-YYYY" patterns first, then split.
  const protectedText = text.replace(/(\d{2})-(\d{4})/g, '$1__MY__$2');
  const parts = protectedText.split(RANGE_SEPARATORS).map(p =>
    p.replace(/(\d{2})__MY__(\d{4})/g, '$1-$2').trim()
  );

  const left = parts[0] || '';
  const right = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';

  const current = isPresentToken(right) || (parts.length < 2 && isPresentToken(left));

  return {
    start: parseToMonthYear(left.replace(/\b(present|current|now|ongoing)\b/gi, '').trim()),
    end: current ? '' : parseToMonthYear(right),
    current,
  };
}

/** Serialize a DateRange back into a single string the AI services already consume. */
export function serializeDateRange(range: DateRange): string {
  const start = (range.start || '').trim();
  const endPart = range.current ? 'Present' : (range.end || '').trim();
  if (start && endPart) return `${start} to ${endPart}`;
  if (start) return start;
  if (endPart) return endPart;
  return '';
}

/** Convenience: format any stored value as a human-friendly "MM-YYYY" or "Present". */
export function displayMonthYear(value: string): string {
  if (!value) return '';
  if (isPresentToken(value)) return 'Present';
  return parseToMonthYear(value) || value;
}

/** Build human label like "Jan 2023 – Present" for read-only previews. */
export function formatRangeForPreview(range: DateRange): string {
  const monthLabel = (mmYYYY: string): string => {
    const m = mmYYYY.match(/^(\d{2})-(\d{4})$/);
    if (!m) return mmYYYY;
    const idx = parseInt(m[1], 10) - 1;
    const abbr = MONTH_ABBR[idx] ? MONTH_ABBR[idx][0].toUpperCase() + MONTH_ABBR[idx].slice(1) : m[1];
    return `${abbr} ${m[2]}`;
  };
  const start = range.start ? monthLabel(range.start) : '';
  const end = range.current ? 'Present' : (range.end ? monthLabel(range.end) : '');
  if (start && end) return `${start} – ${end}`;
  return start || end || '';
}

export const MONTH_OPTIONS: { value: string; label: string }[] = [
  { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' },
  { value: '03', label: 'Mar' }, { value: '04', label: 'Apr' },
  { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' },
  { value: '09', label: 'Sep' }, { value: '10', label: 'Oct' },
  { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
];

export function yearOptions(span = 60): string[] {
  const now = new Date().getFullYear();
  // Allow a few years into the future for projected graduations.
  const out: string[] = [];
  for (let y = now + 5; y >= now - span; y--) out.push(String(y));
  return out;
}

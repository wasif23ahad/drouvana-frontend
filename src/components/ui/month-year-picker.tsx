"use client";

import React from 'react';
import { CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type DateRange,
  parseDateRange,
  serializeDateRange,
  MONTH_OPTIONS,
  yearOptions,
} from '@/lib/monthYear';

interface MonthYearPickerProps {
  /** Canonical MM-YYYY value, "" when empty. */
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: { month?: string; year?: string };
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Two-dropdown month/year picker. Stores its value as canonical "MM-YYYY".
 * Visual style matches the rest of the dashboard (rounded, bg-surface-2 fills).
 */
export function MonthYearPicker({
  value,
  onChange,
  disabled,
  placeholder,
  size = 'md',
  className,
}: MonthYearPickerProps) {
  const [month, year] = (() => {
    if (!value) return ['', ''];
    const m = value.match(/^(\d{2})-(\d{4})$/);
    if (m) return [m[1], m[2]];
    return ['', ''];
  })();

  const update = (nextMonth: string, nextYear: string) => {
    if (!nextMonth && !nextYear) {
      onChange('');
      return;
    }
    const safeMonth = nextMonth || '01';
    const safeYear = nextYear || String(new Date().getFullYear());
    onChange(`${safeMonth}-${safeYear}`);
  };

  const years = React.useMemo(() => yearOptions(), []);

  const h = size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm';

  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      <select
        value={month}
        onChange={e => update(e.target.value, year)}
        disabled={disabled}
        className={cn(
          'rounded-xl bg-surface-2 border border-[var(--color-border-subtle)] px-3 text-text-main',
          'focus:outline-none focus:border-primary/50 disabled:opacity-40 transition-colors',
          h,
        )}
      >
        <option value="">{placeholder?.month || 'Month'}</option>
        {MONTH_OPTIONS.map(m => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={e => update(month, e.target.value)}
        disabled={disabled}
        className={cn(
          'rounded-xl bg-surface-2 border border-[var(--color-border-subtle)] px-3 text-text-main',
          'focus:outline-none focus:border-primary/50 disabled:opacity-40 transition-colors',
          h,
        )}
      >
        <option value="">{placeholder?.year || 'Year'}</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}

interface MonthYearRangeProps {
  /** Free-form `dates` string already used by the master resume model. */
  value: string;
  onChange: (next: string) => void;
  /** When true, no "Present" toggle is rendered (e.g. for dated certifications). */
  hidePresent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  /** Optional labels shown above the start/end columns. */
  labels?: { start?: string; end?: string };
}

/**
 * A full From/To date range picker with a "Present" toggle.
 * Persists the result in the same string format the rest of the app already uses:
 *   "MM-YYYY to MM-YYYY"   or   "MM-YYYY to Present"
 */
export function MonthYearRange({
  value,
  onChange,
  hidePresent = false,
  size = 'md',
  className,
  labels,
}: MonthYearRangeProps) {
  const parsed: DateRange = React.useMemo(() => parseDateRange(value), [value]);

  const commit = (next: DateRange) => onChange(serializeDateRange(next));

  return (
    <div className={cn('space-y-2', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Start */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarClock className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted">
              {labels?.start || 'Start (MM-YYYY)'}
            </span>
          </div>
          <MonthYearPicker
            value={parsed.start}
            onChange={start => commit({ ...parsed, start })}
            size={size}
          />
        </div>

        {/* End */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <CalendarClock className="w-3 h-3 text-text-muted" />
              <span className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted">
                {labels?.end || 'End (MM-YYYY)'}
              </span>
            </div>
            {!hidePresent && (
              <button
                type="button"
                onClick={() => commit({ ...parsed, current: !parsed.current, end: '' })}
                className={cn(
                  'text-[10px] font-jetbrains uppercase tracking-wider px-2 py-0.5 rounded-md border transition-all',
                  parsed.current
                    ? 'bg-primary/15 text-primary border-primary/40 shadow-sm shadow-primary/20'
                    : 'text-text-muted border-[var(--color-border-subtle)] hover:text-text-main hover:border-primary/30',
                )}
                aria-pressed={parsed.current}
              >
                {parsed.current ? '✓ Present' : 'Present'}
              </button>
            )}
          </div>
          {parsed.current ? (
            <div
              role="status"
              className={cn(
                'rounded-xl border border-primary/30 bg-primary/10 text-primary font-bold flex items-center justify-center gap-2',
                size === 'sm' ? 'h-8 text-xs' : 'h-10 text-sm',
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Present
            </div>
          ) : (
            <MonthYearPicker
              value={parsed.end}
              onChange={end => commit({ ...parsed, end })}
              size={size}
            />
          )}
        </div>
      </div>
    </div>
  );
}

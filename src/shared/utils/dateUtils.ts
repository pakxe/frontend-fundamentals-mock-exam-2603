import { DateString } from 'shared/types/dateType';

export function isDateString(value: string): value is DateString {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function formatDate(date: Date): DateString {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid Date');
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  const formatted = `${y}-${m}-${d}`;

  if (!isDateString(formatted)) {
    throw new Error(`Unexpected invalid date string: ${formatted}`);
  }

  return formatted;
}

import numeral from 'numeral';
import { isBefore, isSameDay, isAfter, format, getDaysInMonth, getMonth } from 'date-fns';
import { formatToTimeZone } from 'date-fns-timezone';
import { WorthDate } from '@/composables/types';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM yyyy');
}

export function formatEndOfMonth(str?: string | null) {
  const date = new Date(str ?? '');
  const dateFormatted = formatToTimeZone(date, 'YYYY-MM-DD', {
    timeZone: 'UTC',
  });
  const days = getDaysInMonth(date);
  const end = `${dateFormatted.substring(0, 8)}${days}`;

  return end;
}

export function formatCurrency(number: number | string, full = false) {
  if (typeof number === 'string') number = parseFloat(number);
  if (full || Math.abs(number) < 10000) return numeral(number).format('$0,00');
  else return numeral(number).format('$0a');
}

export function isBetween(test: Date, start: Date, end: Date) {
  const beforeEnd = isBefore(test, end);
  const afterStart = isAfter(test, start);
  const sameDay = isSameDay(test, start) || isSameDay(test, end);
  return (beforeEnd && afterStart) || sameDay;
}

export function createDateList(input: WorthDate[]) {
  return input.map(({ date }) => formatEndOfMonth(date)) ?? [];
}

const TimeUnits = ['year', 'month', 'week', 'day', 'hour', 'minute'] as const;
type UnitOfTime = typeof TimeUnits[number];

export function diffX(date: Date, unit: UnitOfTime) {
  const now = new Date();
  let diff = 0;
  switch (unit) {
    case 'year':
      diff = differenceInYears(now, date);
      break;
    case 'month':
      diff = differenceInMonths(now, date);
      break;
    case 'week':
      diff = differenceInWeeks(now, date);
      break;
    case 'day':
      diff = differenceInDays(now, date);
      break;
    case 'hour':
      diff = differenceInHours(now, date);
      break;
    case 'minute':
      diff = differenceInMinutes(now, date);
      break;
  }
  return diff;
}

export function dateDifFormat(date: string) {
  let message: string | null = null;

  for (const range of TimeUnits) {
    const diff = diffX(new Date(date), range);
    if (diff > 0) {
      const ps = diff === 1 ? range : range + 's';
      message = `${diff} ${ps} ago`;
      break;
    }
  }

  if (!message) message = 'Just now';

  return message;
}

export function getDiffByMonth(netWorth: WorthDate[]) {
  const months: number[][] = Array.from(Array(12), () => []);

  for (const [, { date, worth, previous }] of netWorth.entries()) {
    const month = getMonth(new Date(date));
    const diff = worth - (previous?.worth ?? 0);

    months[month].push(diff);
  }

  // `months` is a 2d array with each higher order array referencing a month
  return months.map(month => Math.round(month.reduce((acc, cur) => acc + cur, 0) / month.length));
}

export function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

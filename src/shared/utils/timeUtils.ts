import { HalfHourTimeString, TimelineMinute, TimeString } from 'shared/types/timeType';

export function isTimeString(value: string): value is TimeString {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;

  const [hour, minute] = value.split(':').map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

export function isHalfHourTimeString(value: string): value is HalfHourTimeString {
  if (!isTimeString(value)) return false;

  const [, minute] = value.split(':');
  return minute === '00' || minute === '30';
}

export function assertTimeString(value: string): asserts value is TimeString {
  if (!isTimeString(value)) {
    throw new Error(`Invalid time string: ${value}`);
  }
}

export function assertHalfHourTimeString(value: string): asserts value is HalfHourTimeString {
  if (!isHalfHourTimeString(value)) {
    throw new Error(`Invalid half-hour time string: ${value}`);
  }
}

export function parseTimeString(value: string): TimeString | null {
  return isTimeString(value) ? value : null;
}

export function parseHalfHourTimeString(value: string): HalfHourTimeString | null {
  return isHalfHourTimeString(value) ? value : null;
}

function toHourString(hour: number): string {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error(`Invalid hour: ${hour}`);
  }

  return String(hour).padStart(2, '0');
}

export function makeTime(hour: number, minute: string): TimeString {
  const formatted = `${toHourString(hour)}:${minute}`;
  assertTimeString(formatted);
  return formatted;
}

export function makeHalfHourTime(hour: number, minute: TimelineMinute): HalfHourTimeString {
  const formatted = `${toHourString(hour)}:${minute}`;
  assertHalfHourTimeString(formatted);
  return formatted;
}

export function timeToMinutes(time: TimeString, startHour: number): number {
  const [h, m] = time.split(':').map(Number);
  return (h - startHour) * 60 + m;
}

export function genTimeline(startHour: number, endHour: number) {
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour)) {
    throw new Error('startHour and endHour must be integers');
  }

  if (startHour < 0 || endHour > 23 || startHour > endHour) {
    throw new Error('Invalid hour range');
  }

  const timeSlots: HalfHourTimeString[] = [];

  for (let h = startHour; h <= endHour; h++) {
    timeSlots.push(makeHalfHourTime(h, '00'));

    if (h < endHour) {
      timeSlots.push(makeHalfHourTime(h, '30'));
    }
  }

  const hourLabels = timeSlots.filter((t): t is HalfHourTimeString => t.endsWith(':00'));
  const totalMinutes = (endHour - startHour) * 60;

  return {
    timeSlots,
    hourLabels,
    timelineStart: startHour,
    timelineEnd: endHour,
    totalMinutes,
  };
}

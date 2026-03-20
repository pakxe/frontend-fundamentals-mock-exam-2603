import type { DateString } from 'shared/types/dateType';

export const reservationKeys = {
  all: () => ['reservation'] as const,

  rooms: () => [...reservationKeys.all, 'rooms'] as const,

  timelines: () => [...reservationKeys.all, 'timeline'] as const,
  timeline: (date: DateString) => [...reservationKeys.timelines(), { date }] as const,

  mine: () => [...reservationKeys.all, 'mine'] as const,
};

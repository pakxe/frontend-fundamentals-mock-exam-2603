import type { DateString } from 'shared/types/dateType';

export const reservationKeys = {
  all: (date: DateString) => ['reservation', date] as const,

  rooms: () => ['reservation', 'rooms'] as const,

  timelines: (date: DateString) => [...reservationKeys.all(date), 'timeline'] as const,
  timeline: (date: DateString) => [...reservationKeys.timelines(date)] as const,

  mine: () => ['reservation', 'mine'] as const,
};

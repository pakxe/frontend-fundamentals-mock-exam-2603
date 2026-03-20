import { reservationKeys } from './reservationQueryKeys';
import { queryOptions } from '@tanstack/react-query';
import { getRooms, getReservations, getMyReservations } from 'pages/remotes';
import type { DateString } from 'shared/types/dateType';

export const reservationQueries = {
  all: (date: DateString) =>
    queryOptions({
      queryKey: reservationKeys.all(),
      queryFn: () => getReservations(date),
    }),

  rooms: () =>
    queryOptions({
      queryKey: reservationKeys.rooms(),
      queryFn: getRooms,
    }),

  timeline: (date: DateString) =>
    queryOptions({
      queryKey: reservationKeys.timeline(date),
      queryFn: () => getReservations(date),
    }),

  mine: () =>
    queryOptions({
      queryKey: reservationKeys.mine(),
      queryFn: getMyReservations,
    }),
};

import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { reservationQueries } from 'shared/api/reservationQueries';
import { BookingConditions } from 'shared/components/BookingConditionSection';

type Props = BookingConditions;

export function useAvailableRooms({ date, startTime, endTime, attendees, floor, equipment }: Props) {
  const { data: rooms = [] } = useQuery(reservationQueries.rooms());
  const { data: reservations = [] } = useQuery(reservationQueries.all(date));

  const validationError = useMemo(() => {
    if (!startTime || !endTime) return null;
    if (endTime <= startTime) return '종료 시간은 시작 시간보다 늦어야 합니다.';
    if (attendees < 1) return '참석 인원은 1명 이상이어야 합니다.';
    return null;
  }, [startTime, endTime, attendees]);

  const isFilterComplete = !!(startTime && endTime && !validationError);

  const floors = useMemo(() => {
    return [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
  }, [rooms]);

  const availableRooms = useMemo(() => {
    if (!isFilterComplete) return [];

    return rooms
      .filter(room => {
        if (room.capacity < attendees) return false;
        if (!equipment.every(eq => room.equipment.includes(eq))) return false;
        if (floor !== null && room.floor !== floor) return false;

        const hasConflict = reservations.some(
          r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
        );

        return !hasConflict;
      })
      .sort((a, b) => {
        if (a.floor !== b.floor) return a.floor - b.floor;
        return a.name.localeCompare(b.name);
      });
  }, [isFilterComplete, rooms, reservations, attendees, equipment, floor, date, startTime, endTime]);

  return {
    availableRooms,
    floors,
    validationError,
    isFilterComplete,
  };
}

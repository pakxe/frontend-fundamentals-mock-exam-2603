import { http } from 'pages/http';
import { DateString } from 'shared/types/dateType';
import { TimeString } from 'shared/types/timeType';
import { isDateString } from 'shared/utils/dateUtils';
import { isTimeString } from 'shared/utils/timeUtils';

type RoomDto = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
};

type ReservationDto = {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

export type Room = RoomDto;

export type Reservation = {
  id: string;
  roomId: string;
  date: DateString;
  start: TimeString;
  end: TimeString;
  attendees: number;
  equipment: string[];
};

export type CreateReservationInput = {
  roomId: string;
  date: DateString;
  start: TimeString;
  end: TimeString;
  attendees: number;
  equipment: string[];
};

function toReservation(dto: ReservationDto): Reservation {
  if (!isDateString(dto.date)) {
    throw new Error(`Invalid reservation date: ${dto.date}`);
  }

  if (!isTimeString(dto.start)) {
    throw new Error(`Invalid reservation start time: ${dto.start}`);
  }

  if (!isTimeString(dto.end)) {
    throw new Error(`Invalid reservation end time: ${dto.end}`);
  }

  return {
    ...dto,
    date: dto.date,
    start: dto.start,
    end: dto.end,
  };
}

function toCreateReservationRequestDto(data: CreateReservationInput) {
  return {
    roomId: data.roomId,
    date: data.date,
    start: data.start,
    end: data.end,
    attendees: data.attendees,
    equipment: data.equipment,
  };
}

export function getRooms() {
  return http.get<RoomDto[]>('/api/rooms');
}

export async function getReservations(date: DateString) {
  const response = await http.get<ReservationDto[]>(`/api/reservations?date=${date}`);
  return response.map(toReservation);
}

export async function createReservation(data: CreateReservationInput) {
  return http.post<
    ReturnType<typeof toCreateReservationRequestDto>,
    { ok: boolean; reservation?: unknown; code?: string; message?: string }
  >('/api/reservations', toCreateReservationRequestDto(data));
}

export async function getMyReservations() {
  const response = await http.get<ReservationDto[]>('/api/my-reservations');
  return response.map(toReservation);
}

export function cancelReservation(id: string) {
  return http.delete<{ ok: boolean }>(`/api/reservations/${id}`);
}

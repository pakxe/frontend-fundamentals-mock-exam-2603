import { DateString } from 'shared/types/dateType';
import { TimeString } from 'shared/types/timeType';

export type Room = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
};

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

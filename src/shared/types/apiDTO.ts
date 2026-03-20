export type ReservationDto = {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

export type RoomDto = {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
};

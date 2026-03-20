import { Room } from 'shared/types/reservation';

export function getRoomName(rooms: Room[], roomId: string): string {
  return rooms.find(room => room.id === roomId)?.name ?? roomId;
}

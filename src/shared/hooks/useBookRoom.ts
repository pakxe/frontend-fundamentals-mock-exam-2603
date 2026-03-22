import { BookingConditions } from 'shared/components/BookingConditionSection';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation, CreateReservationInput } from 'pages/remotes';
import { useState } from 'react';
import { reservationKeys } from 'shared/api/reservationQueryKeys';
import axios from 'axios';

type Props = {
  onSuccess?: () => void;
};

export function useBookRoom({ onSuccess }: Props) {
  const queryClient = useQueryClient();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useMutation((data: CreateReservationInput) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.mine() });
      queryClient.invalidateQueries({ queryKey: reservationKeys.all(variables.date) });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      // TODO
      setErrorMessage(String(err));
      setSelectedRoomId(null);
    },
  });

  const bookRoom = async ({ conditions, roomId }: { conditions: BookingConditions; roomId: string | null }) => {
    const { date, startTime, endTime, attendees, equipment } = conditions;

    if (!startTime || !endTime) {
      setErrorMessage('예약 정보를 모두 입력해주세요.');
      return;
    }

    if (!roomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    try {
      setErrorMessage(null);
      const result = await createMutation.mutateAsync({
        roomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        return;
      }
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return {
    bookRoom,
    errorMessage,
    selectedRoomId,
    selectRoomId: setSelectedRoomId,
    ...createMutation,
  };
}

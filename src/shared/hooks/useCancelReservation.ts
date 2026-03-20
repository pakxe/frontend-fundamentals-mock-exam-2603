import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';
import { reservationKeys } from 'shared/api/reservationQueryKeys';

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [reservationKeys.mine()], // mine이 all도 갖고있으니까 mine만 호출함.. 근데 둘 다 명시적으로 쓰는게 인지부하가 적을지도
      });
    },
  });
}

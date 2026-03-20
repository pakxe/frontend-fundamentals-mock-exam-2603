import { css } from '@emotion/react';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';
import { formatDate } from 'shared/utils/dateUtils';
import { SelectDate } from 'shared/components/SelectDate';
import { DateString } from 'shared/types/dateType';
import { ReservationTimelineSection } from 'shared/components/ReservationTimelineSection';
import { MessageBanner } from 'shared/components/MessageBanner';
import { MyReservationSection } from 'shared/components/MyReservationSection';
import { useTempMessage } from 'shared/hooks/useTempMessage';
import { Loading } from 'shared/components/Loading';

function getInitialMessage(locationState: { message?: string } | null): Message | null {
  return locationState?.message ? { type: 'success', text: locationState.message } : null;
}

type Message = {
  type: 'success' | 'error';
  text: string;
};

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date, setDate] = useState<DateString>(formatDate(new Date()));

  const { setMessage, message } = useTempMessage();

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      <SelectDate value={date} onChangeDate={setDate} />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <Suspense fallback={<Loading />}>
        <ReservationTimelineSection date={date} />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <MessageBanner message={message} />

      <Suspense fallback={<Loading />}>
        <MyReservationSection setMessage={setMessage} />
      </Suspense>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>

      <Spacing size={24} />
    </div>
  );
}

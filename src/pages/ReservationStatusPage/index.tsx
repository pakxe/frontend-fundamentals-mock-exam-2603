import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'shared/utils/dateUtils';
import { SelectDate } from 'shared/components/SelectDate';
import { DateString } from 'shared/types/dateType';
import { ReservationTimeline } from 'shared/components/ReservationTimelineSection';
import { Loading } from 'shared/components/Loading';
import { RectSpacing } from 'shared/components/RectSpacing';
import { ErrorBoundary } from 'react-error-boundary';
import { MessageBanner } from 'shared/components/MessageBanner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCancelReservation } from 'shared/hooks/useCancelReservation';
import { useTempMessage } from 'shared/hooks/useTempMessage';
import { reservationQueries } from 'shared/api/reservationQueries';
import { Flex } from 'shared/components/Flex';
import { getRoomName } from 'shared/utils/getRoomName';
import { Else, If, Then } from 'shared/components/If';
import { Suspense } from '@suspensive/react';
import { EQUIPMENTS } from 'shared/constants/equipment';
import { formatLabels } from 'shared/utils/formatLabels';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

// 각각 suspense를 걸면 로딩이 여러개 뜨므로 ux에 좋지 않아보임..
export const ReservationStatusPage = Suspense.with({ fallback: <Loading /> }, () => {
  const navigate = useNavigate();

  const [date, setDate] = useState<DateString>(formatDate(new Date()));

  const { data: rooms } = useSuspenseQuery(reservationQueries.rooms());
  const { data: reservations } = useSuspenseQuery(reservationQueries.mine());

  const cancelMutation = useCancelReservation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

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

      <RectSpacing as="section" x={24}>
        <Text as="label" className="w-full" typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
          <Spacing size={16} />
          <SelectDate value={date} onChangeDate={setDate} />
        </Text>
      </RectSpacing>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <RectSpacing as="section" x={24}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>

        <Spacing size={16} />

        <ErrorBoundary fallback="예약 현황을 불러올 수 없습니다.">
          <Suspense fallback={<Loading />}>
            <ReservationTimeline date={date} />
          </Suspense>
        </ErrorBoundary>
      </RectSpacing>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <RectSpacing as="section" x={24}>
        <MessageBanner message={message} />

        <Flex align="baseline" gap={6}>
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            내 예약
          </Text>

          {reservations.length > 0 && (
            <Text typography="t7" fontWeight="medium" color={colors.grey500}>
              {reservations.length}건
            </Text>
          )}
        </Flex>

        <Spacing size={16} />

        <If when={reservations.length !== 0}>
          <Then>
            <Flex direction="column" gap={10}>
              {reservations.map(reservation => (
                <div
                  key={reservation.id}
                  css={css`
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: ${colors.grey50};
                    border: 1px solid ${colors.grey200};
                  `}
                >
                  <ListRow
                    contents={
                      <ListRow.Text2Rows
                        top={getRoomName(rooms, reservation.roomId)}
                        topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                        bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${
                          reservation.attendees
                        }명 · ${formatLabels(reservation.equipment, EQUIPMENTS, '장비 없음')}`}
                        bottomProps={{ typography: 't7', color: colors.grey600 }}
                      />
                    }
                    right={
                      <ListRow.Button
                        type="danger"
                        onClick={e => {
                          e.stopPropagation();

                          if (window.confirm('정말 취소하시겠습니까?')) {
                            handleCancel(reservation.id);
                          }
                        }}
                      >
                        취소
                      </ListRow.Button>
                    }
                  />
                </div>
              ))}
            </Flex>
          </Then>

          <Else>
            <div
              css={css`
                padding: 40px 0;
                text-align: center;
                background: ${colors.grey50};
                border-radius: 14px;
              `}
            >
              <Text typography="t6" color={colors.grey500}>
                예약 내역이 없습니다.
              </Text>
            </div>
          </Else>
        </If>
      </RectSpacing>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      <RectSpacing x={24}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </RectSpacing>

      <Spacing size={24} />
    </div>
  );
});

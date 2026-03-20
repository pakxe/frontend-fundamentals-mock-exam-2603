import { css } from '@emotion/react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { reservationQueries } from 'shared/api/reservationQueries';
import { useCancelReservation } from 'shared/hooks/useCancelReservation';
import { Message } from 'shared/hooks/useTempMessage';
import { getRoomName } from 'shared/utils/getRoomName';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

function formatEquipmentLabels(equipment: string[]) {
  return equipment.map(item => EQUIPMENT_LABELS[item] ?? item).join(', ');
}

type Props = {
  setMessage: (message: Message) => void;
};

export function MyReservationSection({ setMessage }: Props) {
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

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {reservations.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {reservations.length}건
          </Text>
        )}
      </div>

      <Spacing size={16} />

      {reservations.length === 0 ? (
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
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
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
                    }명 · ${formatEquipmentLabels(reservation.equipment) || '장비 없음'}`}
                    bottomProps={{ typography: 't7', color: colors.grey600 }}
                  />
                }
                right={
                  <Button
                    type="danger"
                    style="weak"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();

                      if (window.confirm('정말 취소하시겠습니까?')) {
                        handleCancel(reservation.id);
                      }
                    }}
                  >
                    취소
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

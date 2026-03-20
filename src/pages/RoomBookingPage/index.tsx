import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { AvailableRoomSection } from 'shared/components/AvailableRoomSection';
import { BookingConditionSection } from 'shared/components/BookingConditionSection';

import { useBookingQueryParams } from 'shared/hooks/useBookingQueryParams';
import { useAvailableRooms } from 'shared/hooks/useAvailableRooms';
import { useBookRoom } from 'shared/hooks/useBookRoom';
import { MessageBanner } from 'shared/components/MessageBanner';

export function RoomBookingPage() {
  const navigate = useNavigate();

  const { conditions, updateCondition } = useBookingQueryParams();
  const { availableRooms, floors, validationError, isFilterComplete } = useAvailableRooms({ ...conditions });

  const { errorMessage, selectedRoomId, bookRoom, selectRoomId, isLoading } = useBookRoom({
    onSuccess: () => {
      navigate('/', { state: { message: '예약이 완료되었습니다!' } });
    },
  });

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      {/* 뒤로가기 및 헤더 */}
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding: 0 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && (
        <MessageBanner
          message={{
            type: 'error',
            text: errorMessage,
          }}
        />
      )}

      <Spacing size={24} />

      <BookingConditionSection
        conditions={conditions}
        onChange={updateCondition}
        floors={floors}
        validationError={validationError}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <>
          <AvailableRoomSection rooms={availableRooms} selectedRoomId={selectedRoomId} onSelectRoom={selectRoomId} />
          <Spacing size={16} />

          <div
            css={css`
              padding: 0 24px;
            `}
          >
            <Button
              display="full"
              onClick={() => bookRoom({ conditions, roomId: selectedRoomId })}
              disabled={isLoading}
            >
              {isLoading ? '예약 중...' : '확정'}
            </Button>
          </div>
        </>
      )}

      <Spacing size={24} />
    </div>
  );
}

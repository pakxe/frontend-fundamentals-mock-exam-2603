import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { AvailableRoomSection } from 'shared/components/AvailableRoomSection';

import { useBookingQueryParams } from 'shared/hooks/useBookingQueryParams';
import { useAvailableRooms } from 'shared/hooks/useAvailableRooms';
import { useBookRoom } from 'shared/hooks/useBookRoom';
import { MessageBanner } from 'shared/components/MessageBanner';
import { RectSpacing } from 'shared/components/RectSpacing';
import { SelectDate } from 'shared/components/SelectDate';
import { Grid } from 'shared/components/Grid';
import { Flex } from 'shared/components/Flex';
import { genTimeline, isTimeString } from 'shared/utils/timeUtils';
import { SelectNumber } from 'shared/components/SelectNumber';
import { MultiSelect } from 'shared/components/MultiSelect';
import { Chip } from 'shared/components/Chip';
import { EQUIPMENTS } from 'shared/constants/equipment';
import { RESERVATION } from 'shared/constants/reservation';

const { timeSlots } = genTimeline(RESERVATION.START, RESERVATION.END);

export function RoomBookingPage() {
  const navigate = useNavigate();

  const { conditions, updateCondition } = useBookingQueryParams();
  const { availableRooms, floors, validationError, isFilterComplete } = useAvailableRooms({ ...conditions });

  const { errorMessage, selectedRoomId, bookRoom, selectRoomId, isLoading } = useBookRoom({
    onSuccess: () => {
      navigate('/', { state: { message: '예약이 완료되었습니다!' } });
    },
  });

  const { date, startTime, endTime, attendees, floor, equipment } = conditions;

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <RectSpacing top={12} x={24}>
        <button
          aria-label="뒤로가기"
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
      </RectSpacing>

      <Spacing size={24} />

      <Top.Top03
        css={css`
          padding: 0 24px;
        `}
      >
        예약하기
      </Top.Top03>

      <RectSpacing x={24}>
        {errorMessage && (
          <MessageBanner
            message={{
              type: 'error',
              text: errorMessage,
            }}
          />
        )}
        <Spacing size={24} />

        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>

        <Spacing size={16} />

        <Text as="label" className="w-full" typography="t7" fontWeight="medium" color={colors.grey600}>
          날짜
          <Spacing size={6} />
          <SelectDate value={date} onChangeDate={newDate => updateCondition('date', newDate)} />
        </Text>

        <Spacing size={14} />

        <Grid gap={12} columns={2}>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" htmlFor="start-time" typography="t7" fontWeight="medium" color={colors.grey600}>
              시작 시간
            </Text>

            <Select
              id="start-time"
              value={startTime}
              onChange={e => {
                const val = e.target.value;
                updateCondition('startTime', isTimeString(val) ? val : '');
              }}
            >
              <option value="">선택</option>
              {timeSlots.slice(0, -1).map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" htmlFor="end-time" typography="t7" fontWeight="medium" color={colors.grey600}>
              종료 시간
            </Text>
            <Select
              id="end-time"
              value={endTime}
              onChange={e => {
                const val = e.target.value;
                updateCondition('endTime', isTimeString(val) ? val : '');
              }}
            >
              <option value="">선택</option>
              {timeSlots.slice(1).map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Flex>
        </Grid>

        <Spacing size={14} />

        <Flex gap={12}>
          <Flex direction="column" gap={6} flex={1}>
            <Text as="label" htmlFor="attendees" typography="t7" fontWeight="medium" color={colors.grey600}>
              참석 인원
            </Text>
            <SelectNumber
              id="attendees"
              min={1}
              max={50}
              value={attendees}
              onChange={e => updateCondition('attendees', Math.max(1, Number(e.target.value)))}
            />
          </Flex>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 6px;
              flex: 1;
            `}
          >
            <Text as="label" htmlFor="floor" typography="t7" fontWeight="medium" color={colors.grey600}>
              선호 층
            </Text>
            <Select
              id="floor"
              value={floor ?? ''}
              onChange={e => {
                const val = e.target.value;
                updateCondition('floor', val === '' ? null : Number(val));
              }}
            >
              <option value="">전체</option>
              {floors.map(f => (
                <option key={f} value={f}>
                  {f}층
                </option>
              ))}
            </Select>
          </div>
        </Flex>
        <Spacing size={14} />

        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          필요 장비
        </Text>
        <Spacing size={8} />
        <Flex gap={8} wrap="wrap">
          <MultiSelect options={EQUIPMENTS} value={equipment} onChange={v => updateCondition('equipment', v)}>
            {({ option, isSelected, onClick }) => (
              <Chip key={option.value} isSelected={isSelected} onClick={onClick}>
                {option.label}
              </Chip>
            )}
          </MultiSelect>
        </Flex>

        <Spacing size={8} />
        <MessageBanner
          message={
            validationError
              ? {
                  type: 'error',
                  text: validationError,
                }
              : null
          }
          variant="raw"
        />
      </RectSpacing>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {isFilterComplete && (
        <>
          <AvailableRoomSection rooms={availableRooms} selectedRoomId={selectedRoomId} onSelectRoom={selectRoomId} />
          <Spacing size={16} />

          <RectSpacing x={24}>
            <Button
              display="full"
              onClick={() => bookRoom({ conditions, roomId: selectedRoomId })}
              disabled={isLoading}
            >
              {isLoading ? '예약 중...' : '확정'}
            </Button>
          </RectSpacing>
        </>
      )}

      <Spacing size={24} />
    </div>
  );
}

import { css } from '@emotion/react';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { DateString } from 'shared/types/dateType';
import { TimeString } from 'shared/types/timeType';
import { isTimeString, genTimeline } from 'shared/utils/timeUtils';
import { SelectDate } from 'shared/components/SelectDate';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};
const ALL_EQUIPMENT = ['tv', 'whiteboard', 'video', 'speaker'];

const { timeSlots } = genTimeline(9, 20);

export interface BookingConditions {
  date: DateString;
  startTime: TimeString | '';
  endTime: TimeString | '';
  attendees: number;
  floor: number | null;
  equipment: string[];
}

interface ConditionProps {
  conditions: BookingConditions;
  onChange: <K extends keyof BookingConditions>(key: K, value: BookingConditions[K]) => void;
  floors: number[];
  validationError: string | null;
}

export function BookingConditionSection({ conditions, onChange, floors, validationError }: ConditionProps) {
  const { date, startTime, endTime, attendees, floor, equipment } = conditions;

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      {/* ✨ SelectDate 컴포넌트 그대로 장착 */}
      <div
        css={css`
          margin: 0 -24px;
        `}
      >
        {' '}
        {/* SelectDate 내부의 padding 24px와 겹치지 않게 음수 마진을 살짝 줬습니다 */}
        <SelectDate value={date} onChangeDate={newDate => onChange('date', newDate)} />
      </div>

      <Spacing size={14} />

      {/* 시간 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" htmlFor="start-time" typography="t7" fontWeight="medium" color={colors.grey600}>
            시작 시간
          </Text>
          <Select
            id="start-time"
            value={startTime}
            onChange={e => {
              const val = e.target.value;
              onChange('startTime', isTimeString(val) ? val : '');
            }}
          >
            <option value="">선택</option>
            {timeSlots.slice(0, -1).map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" htmlFor="end-time" typography="t7" fontWeight="medium" color={colors.grey600}>
            종료 시간
          </Text>
          <Select
            id="end-time"
            value={endTime}
            onChange={e => {
              const val = e.target.value;
              onChange('endTime', isTimeString(val) ? val : '');
            }}
          >
            <option value="">선택</option>
            {timeSlots.slice(1).map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Spacing size={14} />

      {/* 참석 인원 & 선호 층 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
          `}
        >
          <Text as="label" htmlFor="attendees" typography="t7" fontWeight="medium" color={colors.grey600}>
            참석 인원
          </Text>
          <input
            id="attendees"
            type="number"
            min={1}
            value={attendees}
            onChange={e => onChange('attendees', Math.max(1, Number(e.target.value)))}
            css={css`
              box-sizing: border-box;
              font-size: 16px;
              font-weight: 500;
              height: 48px;
              background-color: ${colors.grey50};
              border-radius: 12px;
              color: ${colors.grey800};
              width: 100%;
              border: 1px solid ${colors.grey200};
              padding: 0 16px;
              outline: none;
            `}
          />
        </div>
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
              onChange('floor', val === '' ? null : Number(val));
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
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <div>
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          필요 장비
        </Text>
        <Spacing size={8} />
        <div
          css={css`
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          `}
        >
          {ALL_EQUIPMENT.map(eq => {
            const selected = equipment.includes(eq);
            return (
              <button
                key={eq}
                type="button"
                aria-label={EQUIPMENT_LABELS[eq]}
                onClick={() => {
                  const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  onChange('equipment', next);
                }}
                css={css`
                  padding: 8px 16px;
                  border-radius: 20px;
                  border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                  background: ${selected ? colors.blue50 : colors.grey50};
                  color: ${selected ? colors.blue600 : colors.grey700};
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                `}
              >
                {EQUIPMENT_LABELS[eq]}
              </button>
            );
          })}
        </div>
      </div>

      {validationError && (
        <>
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
            role="alert"
          >
            {validationError}
          </span>
        </>
      )}
    </div>
  );
}

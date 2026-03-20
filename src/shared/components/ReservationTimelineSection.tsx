import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { Room, Reservation } from 'shared/types/reservation';
import { TimeString } from 'shared/types/timeType';
import { genTimeline, timeToMinutes } from 'shared/utils/timeUtils';
import { RESERVATION } from 'shared/constants/reservation';
import { DateString } from 'shared/types/dateType';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { reservationQueries } from 'shared/api/reservationQueries';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

const timeline = genTimeline(RESERVATION.START, RESERVATION.END);

function formatEquipmentLabels(equipment: string[]) {
  return equipment.map(item => EQUIPMENT_LABELS[item] ?? item).join(', ');
}

function getReservationBarStyle(start: TimeString, end: TimeString) {
  const left = (timeToMinutes(start, RESERVATION.START) / timeline.totalMinutes) * 100;
  const width =
    ((timeToMinutes(end, RESERVATION.START) - timeToMinutes(start, RESERVATION.START)) / timeline.totalMinutes) * 100;

  return { left, width };
}

type Props = {
  date: DateString;
};

export function ReservationTimelineSection({ date }: Props) {
  const { data: rooms } = useSuspenseQuery(reservationQueries.rooms());
  const { data: reservations } = useSuspenseQuery(reservationQueries.all(date));

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const reservationsByRoomId = useMemo(() => {
    return reservations.reduce<Record<string, Reservation[]>>((acc, reservation) => {
      if (!acc[reservation.roomId]) {
        acc[reservation.roomId] = [];
      }

      acc[reservation.roomId].push(reservation);
      return acc;
    }, {});
  }, [reservations]);

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 현황
      </Text>

      <Spacing size={16} />

      <div
        css={css`
          background: ${colors.grey50};
          border-radius: 14px;
          padding: 16px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: flex-end;
            margin-bottom: 8px;
          `}
        >
          <div
            css={css`
              width: 80px;
              flex-shrink: 0;
              padding-right: 8px;
            `}
          />
          <div
            css={css`
              flex: 1;
              position: relative;
              height: 18px;
            `}
          >
            {timeline.hourLabels.map(time => {
              const left = (timeToMinutes(time, RESERVATION.START) / timeline.totalMinutes) * 100;

              return (
                <Text
                  key={time}
                  typography="t7"
                  fontWeight="regular"
                  color={colors.grey400}
                  css={css`
                    position: absolute;
                    left: ${left}%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    letter-spacing: -0.3px;
                  `}
                >
                  {time.slice(0, 2)}
                </Text>
              );
            })}
          </div>
        </div>

        {rooms.map((room, index) => {
          const roomReservations = reservationsByRoomId[room.id] ?? [];

          return (
            <div
              key={room.id}
              css={css`
                display: flex;
                align-items: center;
                height: 32px;
                ${index > 0 ? 'margin-top: 4px;' : ''}
              `}
            >
              <div
                css={css`
                  width: 80px;
                  flex-shrink: 0;
                  padding-right: 8px;
                `}
              >
                <Text
                  typography="t7"
                  fontWeight="medium"
                  color={colors.grey700}
                  ellipsisAfterLines={1}
                  css={css`
                    font-size: 12px;
                  `}
                >
                  {room.name}
                </Text>
              </div>

              <div
                css={css`
                  flex: 1;
                  height: 24px;
                  background: ${colors.white};
                  border-radius: 6px;
                  position: relative;
                  overflow: visible;
                `}
              >
                {roomReservations.map(reservation => {
                  const { left, width } = getReservationBarStyle(reservation.start, reservation.end);
                  const isActive = activeReservation === reservation.id;

                  return (
                    <div
                      key={reservation.id}
                      css={css`
                        position: absolute;
                        left: ${left}%;
                        width: ${width}%;
                        height: 100%;
                      `}
                    >
                      <div
                        role="button"
                        aria-label={`${room.name} ${reservation.start}-${reservation.end} 예약 상세`}
                        onClick={() => setActiveReservation(isActive ? null : reservation.id)}
                        css={css`
                          width: 100%;
                          height: 100%;
                          background: ${colors.blue400};
                          border-radius: 4px;
                          opacity: ${isActive ? 1 : 0.75};
                          cursor: pointer;
                          transition: opacity 0.15s;

                          &:hover {
                            opacity: 1;
                          }
                        `}
                      />

                      {isActive && (
                        <div
                          role="tooltip"
                          css={css`
                            position: absolute;
                            top: 100%;
                            left: 50%;
                            transform: translateX(-50%);
                            margin-top: 6px;
                            background: ${colors.grey900};
                            color: ${colors.white};
                            padding: 8px 12px;
                            border-radius: 8px;
                            font-size: 12px;
                            white-space: nowrap;
                            z-index: 10;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                            line-height: 1.6;
                          `}
                        >
                          <div>
                            {reservation.start} ~ {reservation.end}
                          </div>
                          <div>{reservation.attendees}명</div>
                          {reservation.equipment.length > 0 && (
                            <div>{formatEquipmentLabels(reservation.equipment)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

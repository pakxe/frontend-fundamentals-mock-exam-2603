import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, createReservation } from 'pages/remotes';
import axios from 'axios';
import { AvailableRoomSection } from 'shared/components/AvailableRoomSection';
import { BookingConditionSection, BookingConditions } from 'shared/components/BookingConditionSection';

import { RoomDto, ReservationDto } from 'shared/types/apiDTO';
import { CreateReservationInput } from 'shared/types/reservation';
import { formatDate, isDateString } from 'shared/utils/dateUtils';
import { isTimeString } from 'shared/utils/timeUtils';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL에서 값을 읽고 타입 가드를 통해 검증 및 초기화
  const rawDate = searchParams.get('date') || '';
  const rawStart = searchParams.get('startTime') || '';
  const rawEnd = searchParams.get('endTime') || '';

  const [conditions, setConditions] = useState<BookingConditions>({
    date: isDateString(rawDate) ? rawDate : formatDate(new Date()),
    startTime: isTimeString(rawStart) ? rawStart : '',
    endTime: isTimeString(rawEnd) ? rawEnd : '',
    attendees: Number(searchParams.get('attendees')) || 1,
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
    equipment: searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : [],
  });

  const { date, startTime, endTime, attendees, preferredFloor, equipment } = conditions;

  const handleConditionChange = <K extends keyof BookingConditions>(key: K, value: BookingConditions[K]) => {
    setConditions(prev => ({ ...prev, [key]: value }));
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const { data: rooms = [] } = useQuery<RoomDto[]>(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery<ReservationDto[]>(['reservations', date], () => getReservations(date), {
    enabled: !!date,
  });

  const createMutation = useMutation((data: CreateReservationInput) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(['reservations', variables.date]);
      queryClient.invalidateQueries(['myReservations']);
    },
  });

  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);

  const availableRooms = isFilterComplete
    ? rooms
        .filter(room => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;

          const hasConflict = reservations.some(
            r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
          );
          if (hasConflict) return false;
          return true;
        })
        .sort((a, b) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId || !startTime || !endTime) {
      setErrorMessage('예약 정보를 모두 입력해주세요.');
      return;
    }

    try {
      // CreateReservationInput 타입에 정확히 일치함 (startTime, endTime은 이미 TimeString이 보장됨)
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
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

      {/* 에러 메시지 배너 */}
      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      {/* 1. 예약 조건 입력 섹션 */}
      <BookingConditionSection
        conditions={conditions}
        onChange={handleConditionChange}
        floors={floors}
        validationError={validationError}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 2. 예약 가능 회의실 섹션 */}
      {isFilterComplete && (
        <>
          <AvailableRoomSection
            rooms={availableRooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
          />
          <Spacing size={16} />

          <div
            css={css`
              padding: 0 24px;
            `}
          >
            <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
              {createMutation.isLoading ? '예약 중...' : '확정'}
            </Button>
          </div>
        </>
      )}

      <Spacing size={24} />
    </div>
  );
}

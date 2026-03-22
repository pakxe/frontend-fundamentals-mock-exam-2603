import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingConditions } from 'shared/components/BookingConditionSection';
import { formatDate, isDateString } from 'shared/utils/dateUtils';
import { isTimeString } from 'shared/utils/timeUtils';

export function useBookingQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const conditions = useMemo<BookingConditions>(() => {
    const rawDate = searchParams.get('date') || '';
    const rawStart = searchParams.get('startTime') || '';
    const rawEnd = searchParams.get('endTime') || '';

    const equipmentParam = searchParams.get('equipment');
    const parsedEquipment = equipmentParam ? equipmentParam.split(',').filter(Boolean) : [];

    return {
      date: isDateString(rawDate) ? rawDate : formatDate(new Date()),
      startTime: isTimeString(rawStart) ? rawStart : '',
      endTime: isTimeString(rawEnd) ? rawEnd : '',
      attendees: Number(searchParams.get('attendees')) || 1,
      floor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
      equipment: parsedEquipment,
    };
  }, [searchParams]);

  const updateCondition = <K extends keyof BookingConditions>(key: K, value: BookingConditions[K]) => {
    setSearchParams(
      prevParams => {
        const newParams = new URLSearchParams(prevParams);

        // 값이 비어있거나 초기값인 경우 URL을 깔끔하게 유지하기 위해 파라미터 삭제
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(',')); // 배열은 콤마(,)로 연결
        } else {
          newParams.set(key, String(value));
        }

        return newParams;
      },
      { replace: true }
    ); // history 스택에 불필요하게 쌓이지 않도록 replace
  };

  return { conditions, updateCondition };
}

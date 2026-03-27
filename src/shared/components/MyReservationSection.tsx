import { css } from '@emotion/react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { reservationQueries } from 'shared/api/reservationQueries';
import { Flex } from 'shared/components/Flex';
import { MessageBanner } from 'shared/components/MessageBanner';
import { RectSpacing } from 'shared/components/RectSpacing';
import { useCancelReservation } from 'shared/hooks/useCancelReservation';
import { Message, useTempMessage } from 'shared/hooks/useTempMessage';
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

type Props = {};

export function MyReservationSection({}: Props) {
  return <></>;
}

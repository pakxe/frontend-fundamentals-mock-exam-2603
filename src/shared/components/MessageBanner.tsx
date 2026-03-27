import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type Message = {
  type: 'success' | 'error';
  text: string;
};

type Props = {
  message: Message | null;
  variant?: 'box' | 'raw';
};

export function MessageBanner({ message, variant = 'box' }: Props) {
  if (!message) return null;

  const isRaw = variant === 'raw';

  return (
    <div
      css={
        !isRaw &&
        css`
          padding: 10px 14px;
          border-radius: 10px;
          background: ${message.type === 'success' ? colors.blue50 : colors.red50};
          display: flex;
          align-items: center;
          gap: 8px;
        `
      }
    >
      <Text typography="t7" fontWeight="medium" color={message.type === 'success' ? colors.blue600 : colors.red500}>
        {message.text}
      </Text>
    </div>
  );
}

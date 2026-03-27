import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';
import { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<'button'> & {
  isSelected?: boolean;
};

export function Chip({ isSelected, children, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-pressed={isSelected}
      {...rest}
      css={css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
        background: ${isSelected ? colors.blue50 : colors.grey50};
        color: ${isSelected ? colors.blue600 : colors.grey700};
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        cursor: pointer;

        &:focus-visible {
          outline: 2px solid ${colors.blue500};
          outline-offset: 2px;
        }
      `}
    >
      {children}
    </button>
  );
}

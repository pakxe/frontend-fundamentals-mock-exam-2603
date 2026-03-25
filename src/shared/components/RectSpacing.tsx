import { css } from '@emotion/react';
import { Spacing } from '_tosslib/components';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  x?: number;
  y?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function RectSpacing({ children, x, y, top, right, bottom, left }: Props) {
  const resolvedTop = top ?? y ?? 0;
  const resolvedBottom = bottom ?? y ?? 0;
  const resolvedLeft = left ?? x ?? 0;
  const resolvedRight = right ?? x ?? 0;

  return (
    <div
      css={css`
        padding-left: ${resolvedLeft}px;
        padding-right: ${resolvedRight}px;
      `}
    >
      <Spacing size={resolvedTop} />

      {children}

      <Spacing size={resolvedBottom} />
    </div>
  );
}

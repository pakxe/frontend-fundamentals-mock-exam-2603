import { css } from '@emotion/react';
import { Spacing } from '_tosslib/components';
import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';

interface BaseProps {
  children: ReactNode;
  x?: number;
  y?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type RectSpacingProps<T extends ElementType> = BaseProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof BaseProps | 'as'>;

export function RectSpacing<T extends ElementType = 'div'>({
  as,
  children,
  x,
  y,
  top,
  right,
  bottom,
  left,
  ...rest
}: RectSpacingProps<T>) {
  const Component = as || 'div';

  const resolvedTop = top ?? y ?? 0;
  const resolvedBottom = bottom ?? y ?? 0;
  const resolvedLeft = left ?? x ?? 0;
  const resolvedRight = right ?? x ?? 0;

  return (
    <Component
      css={css`
        padding-left: ${resolvedLeft}px;
        padding-right: ${resolvedRight}px;
      `}
      {...rest}
    >
      <Spacing size={resolvedTop} />

      {children}

      <Spacing size={resolvedBottom} />
    </Component>
  );
}

import { css } from '@emotion/react';
import { ReactNode, HTMLAttributes } from 'react';

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number | string;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flex?: number | string;
}

export function Flex({ children, direction = 'row', align, justify, gap, wrap, flex, ...props }: FlexProps) {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: ${direction};
        ${align && `align-items: ${align};`}
        ${justify && `justify-content: ${justify};`}
        ${wrap && `flex-wrap: ${wrap};`}
        ${flex !== undefined && `flex: ${flex};`}
        ${gap !== undefined && `gap: ${typeof gap === 'number' ? `${gap}px` : gap};`}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

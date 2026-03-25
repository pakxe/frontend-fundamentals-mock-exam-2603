import { css } from '@emotion/react';
import { ReactNode, HTMLAttributes } from 'react';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: number | string;
  rows?: number | string;
  gap?: number | string;
  columnGap?: number | string;
  rowGap?: number | string;
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'stretch';
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
}

const formatGap = (gap?: number | string) => {
  if (gap === undefined) return undefined;
  return typeof gap === 'number' ? `${gap}px` : gap;
};

const formatTemplate = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `repeat(${value}, 1fr)` : value;
};

export function Grid({
  children,
  columns,
  rows,
  gap,
  columnGap,
  rowGap,
  align,
  justify,
  autoFlow,
  ...props
}: GridProps) {
  return (
    <div
      css={css`
        display: grid;
        ${columns !== undefined && `grid-template-columns: ${formatTemplate(columns)};`}
        ${rows !== undefined && `grid-template-rows: ${formatTemplate(rows)};`}
        ${gap !== undefined && `gap: ${formatGap(gap)};`}
        ${columnGap !== undefined && `column-gap: ${formatGap(columnGap)};`}
        ${rowGap !== undefined && `row-gap: ${formatGap(rowGap)};`}
        ${align && `align-items: ${align};`}
        ${justify && `justify-items: ${justify};`}
        ${autoFlow && `grid-auto-flow: ${autoFlow};`}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

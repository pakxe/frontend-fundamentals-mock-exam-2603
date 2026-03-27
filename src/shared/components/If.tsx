import React, { ReactNode, Children, ReactElement } from 'react';

type RenderAction = ReactNode | (() => ReactNode);

type SubComponentProps = { children: RenderAction };

export const Then = ({ children }: SubComponentProps) => <>{children}</>;
export const Else = ({ children }: SubComponentProps) => <>{children}</>;

type Props = {
  when: boolean;
  children: ReactNode;
};

export function If({ when, children }: Props) {
  const childrenArray = Children.toArray(children) as ReactElement[];

  const targetChild = childrenArray.find(child => (when ? child.type === Then : child.type === Else));

  if (!targetChild) return null;

  const renderContent = targetChild.props.children;

  return <>{typeof renderContent === 'function' ? renderContent() : renderContent}</>;
}

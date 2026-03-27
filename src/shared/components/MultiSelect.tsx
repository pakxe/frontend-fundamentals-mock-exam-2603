import { ReactNode, ReactElement } from 'react';

export type MultiSelectOption<T extends string> = {
  value: T;
  label: ReactNode;
};

export type MultiSelectItemProps<T extends string> = {
  option: MultiSelectOption<T>;
  isSelected: boolean;
  onClick: () => void;
};

type Props<T extends string> = {
  options: ReadonlyArray<MultiSelectOption<T>>;
  value: ReadonlyArray<T>;
  onChange: (next: T[]) => void;
  children: (props: MultiSelectItemProps<T>) => ReactElement;
};

/**
 * clone을 쓰면 보기엔 편하지만 ts가 의미없게 되기 때문에..
 * 사용성은 떨어지지만 이렇게 했음.
 */

export function MultiSelect<T extends string>({ options, value, onChange, children }: Props<T>) {
  const handleToggle = (target: T) => {
    const nextSet = new Set(value);

    if (nextSet.has(target)) {
      nextSet.delete(target);
    } else {
      nextSet.add(target);
    }

    const next = options.map(option => option.value).filter(optionValue => nextSet.has(optionValue));

    onChange(next);
  };

  return (
    <>
      {options.map(option => {
        const isSelected = value.includes(option.value);

        return children({
          option,
          isSelected,
          onClick: () => handleToggle(option.value),
        });
      })}
    </>
  );
}

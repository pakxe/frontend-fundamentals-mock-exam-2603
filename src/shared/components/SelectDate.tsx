import { css } from '@emotion/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { colors } from '_tosslib/constants/colors';
import { DateString } from 'shared/types/dateType';
import { formatDate, isDateString } from 'shared/utils/dateUtils';

type Props = {
  value: DateString;
  onChangeDate: (newDate: DateString) => void;
};

export function SelectDate({ value, onChangeDate }: Props) {
  const [inputValue, setInputValue] = useState<string>(value);
  const minDate = formatDate(new Date());

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value;
    setInputValue(nextValue);

    if (!isDateString(nextValue)) {
      return;
    }

    onChangeDate(nextValue);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
      `}
    >
      <input
        type="date"
        value={inputValue}
        min={minDate}
        onChange={handleInputChange}
        aria-label="날짜"
        css={css`
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          padding: 0 16px;
          border: 1px solid ${colors.grey200};
          border-radius: 12px;
          outline: none;
          background-color: ${colors.grey50};
          color: ${colors.grey800};
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          transition: border-color 0.15s;

          &:focus {
            border-color: ${colors.blue500};
          }
        `}
      />
    </div>
  );
}

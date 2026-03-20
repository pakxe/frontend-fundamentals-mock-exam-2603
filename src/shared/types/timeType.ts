export type TimelineMinute = '00' | '30';

export type TimeString = string & { readonly __brand: 'TimeString' };
export type HalfHourTimeString = TimeString & {
  readonly __halfHourBrand: 'HalfHourTimeString';
};

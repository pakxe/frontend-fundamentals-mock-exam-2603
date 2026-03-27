export interface LabelOption<T> {
  label: string;
  value: T;
}

export function formatLabels<T>(
  keys: T[],
  options: readonly LabelOption<T>[],
  fallback: string = '알 수 없음'
): string {
  if (!keys || keys.length === 0) {
    return '';
  }

  return keys
    .map(key => {
      const found = options.find(option => option.value === key);
      return found ? found.label : fallback;
    })
    .filter(Boolean)
    .join(', ');
}

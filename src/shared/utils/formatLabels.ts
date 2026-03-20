export function formatLabels<T extends string | number | symbol>(keys: T[], labelMap: Record<T, string>): string {
  if (!keys || keys.length === 0) {
    return '';
  }

  return keys
    .map(key => labelMap[key] ?? key)
    .filter(label => !!label)
    .join(', ');
}

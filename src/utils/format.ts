export function fmt(n: number | undefined | null): string {
  return Number(n || 0).toLocaleString('ko-KR');
}

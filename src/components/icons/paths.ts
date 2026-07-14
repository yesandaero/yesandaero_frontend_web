/** 라인 아이콘 세트 (이모지 미사용). 각 값은 24x24 뷰박스 기준 SVG path 마크업. */
export const ICON_PATHS: Record<string, string> = {
  logoMark:
    '<path d="M4 10.5h16"/><path d="M4 10.5c0 4.7 3.6 8 8 8s8-3.3 8-8"/><path d="M9 5.2c.6-.6.6-1.4 0-2M15 5.2c.6-.6.6-1.4 0-2"/>',
  dashboard: '<path d="M5 20v-7"/><path d="M12 20V6"/><path d="M19 20v-4"/><path d="M3.5 20h17"/>',
  store:
    '<path d="M4.5 9.5 5.5 5h13l1 4.5"/><path d="M4.5 9.5V19a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V9.5"/><path d="M9.5 20v-5.5h5V20"/><path d="M4.5 9.5h15"/>',
  menu:
    '<path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none"/>',
  tag: '<path d="M12.5 3.5H18a1.5 1.5 0 0 1 1.5 1.5v5.5L11 19 3.5 11.5 12.5 3.5Z"/><circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none"/>',
  logout:
    '<path d="M9.5 4.5h-3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3"/><path d="M15.5 8.5 19.5 12l-4 3.5"/><path d="M19 12H9.5"/>',
  edit: '<path d="M4.5 19.5 5.3 16 15.8 5.5l2.7 2.7L8 18.7l-3.5.8Z"/><path d="M14 7.3l2.7 2.7"/>',
  trash:
    '<path d="M4.5 7h15"/><path d="M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7"/><path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7"/><path d="M10.3 11v6M13.7 11v6"/>',
  check: '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3 10.7 14.8 15.8 9.5"/>',
  plus: '<path d="M12 5.5v13"/><path d="M5.5 12h13"/>',
  partnership:
    '<path d="M8 16a4 4 0 0 1 0-5.7l2-2a4 4 0 0 1 5.7 5.7"/><path d="M16 8a4 4 0 0 1 0 5.7l-2 2a4 4 0 0 1-5.7-5.7"/><path d="M9.5 14.5 14.5 9.5"/>',
  statistics: '<path d="M12 3.5v8.5h8.5"/><path d="M20.3 13.5A8.5 8.5 0 1 1 12 3.5"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3M20 14v3h-3M14 20h6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
};

export type IconName = keyof typeof ICON_PATHS;

import type { TabKey } from '../types';
import type { StoreCategory } from '../api/types';
import type { IconName } from '../components/icons/paths';

/** 가게 카테고리 옵션 (API 명세서 StoreCategory enum과 1:1 매칭) */
export const STORE_CATEGORIES: { value: StoreCategory; label: string }[] = [
  { value: 'KOREAN', label: '한식' },
  { value: 'CHINESE', label: '중식' },
  { value: 'JAPANESE', label: '일식' },
  { value: 'WESTERN', label: '양식' },
  { value: 'SNACK', label: '분식' },
  { value: 'CAFE', label: '카페·디저트' },
];

export function categoryLabel(value: StoreCategory): string {
  return STORE_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** 사이드바 내비게이션 항목 */
export const NAV: { key: TabKey; label: string; iconName: IconName }[] = [
  { key: 'store', label: '가게 정보', iconName: 'store' },
  { key: 'menu', label: '메뉴 관리', iconName: 'menu' },
  { key: 'coupon', label: '쿠폰 관리', iconName: 'tag' },
  { key: 'partnership', label: '제휴 관리', iconName: 'partnership' },
  { key: 'statistics', label: '통계', iconName: 'statistics' },
];

/** 탭별 상단 제목/설명 */
export const TAB_META: Record<TabKey, { title: string; sub: string }> = {
  store: { title: '가게 정보', sub: '가게 이름, 주소, 연락처를 관리해요' },
    dashboard: { title: '대시보드', sub: '오늘 팔리는 메뉴와 가격을 한눈에 확인하세요' },
  menu: { title: '메뉴 관리', sub: '메뉴와 가격, 품절 여부를 관리해요' },
  coupon: { title: '쿠폰 관리', sub: '쿠폰 템플릿을 만들고 발급해요' },
  partnership: { title: '제휴 관리', sub: '다른 가게와의 제휴를 관리해요' },
  statistics: { title: '통계', sub: '쿠폰 발급·사용 현황을 확인해요' },
};

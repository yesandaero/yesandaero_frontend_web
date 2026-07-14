import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import * as storeApi from '../api/store';
import * as couponsApi from '../api/coupons';
import * as partnershipsApi from '../api/partnerships';
import * as statisticsApi from '../api/statistics';
import { ApiError, clearTokens, getAccessToken, setTokens } from '../api/client';
import type {
  CouponTemplate,
  CreateCouponTemplateRequest,
  IssueCouponResponse,
  Partnership,
  RegisterStoreRequest,
  StoreStatistics,
  UpdateStoreRequest,
} from '../api/types';
import type { AuthMode, ConfirmDeleteTarget, MenuItem, StoreInfo } from '../types';
import { AppContext, type StoreStatus } from './context';

const initialMenu: MenuItem[] = [
  { id: 1, name: '순대국밥', price: 9000, desc: '사골국물에 순대와 내장을 듬뿍', soldOut: false },
  { id: 2, name: '돼지국밥', price: 9000, desc: '진하게 우려낸 사골 육수', soldOut: false },
  { id: 3, name: '수육(小)', price: 18000, desc: '두 사람이 먹기 좋은 양', soldOut: true },
  { id: 4, name: '계란찜', price: 4000, desc: '뚝배기 계란찜', soldOut: false },
];

function errMsg(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => !!getAccessToken());
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('idle');

  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [nextMenuId, setNextMenuId] = useState(5);

  const [couponTemplates, setCouponTemplates] = useState<CouponTemplate[]>([]);
  const [couponTemplatesLoading, setCouponTemplatesLoading] = useState(false);
  const [issuedCoupon, setIssuedCoupon] = useState<IssueCouponResponse | null>(null);

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [partnershipsLoading, setPartnershipsLoading] = useState(false);

  const [statistics, setStatistics] = useState<StoreStatistics | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteTarget | null>(null);

  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);
  function showToast(msg: string) {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 2200);
  }

  async function refreshStore() {
    setStoreStatus('loading');
    try {
      const detail = await storeApi.getMyStore();
      setStore(detail);
      setStoreStatus('ready');
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setStore(null);
        setStoreStatus('needs-store');
      } else {
        setStoreStatus('error');
        showToast(errMsg(e, '가게 정보를 불러오지 못했어요'));
      }
    }
  }

  useEffect(() => {
    if (getAccessToken()) {
      refreshStore();
    }
    // 최초 마운트 시 세션 복원만 수행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    setAuthLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      setAuthed(true);
      showToast('로그인 완료! 오늘도 화이팅이에요');
      await refreshStore();
    } catch (e) {
      showToast(errMsg(e, '로그인에 실패했어요'));
    } finally {
      setAuthLoading(false);
    }
  }

  async function signup(payload: { username: string; email: string; password: string }) {
    setAuthLoading(true);
    try {
      await authApi.signup({ ...payload, role: 'OWNER' });
      const res = await authApi.login({ email: payload.email, password: payload.password });
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      setAuthed(true);
      showToast('사장님 계정이 만들어졌어요. 가게 정보를 등록해볼까요?');
      await refreshStore();
    } catch (e) {
      showToast(errMsg(e, '회원가입에 실패했어요'));
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    authApi.logout().catch(() => {});
    clearTokens();
    setAuthed(false);
    setAuthMode('login');
    setStore(null);
    setStoreStatus('idle');
    setCouponTemplates([]);
    setPartnerships([]);
    setStatistics(null);
  }

  async function registerStore(payload: RegisterStoreRequest) {
    try {
      await storeApi.registerStore(payload);
      showToast('가게가 등록됐어요');
      await refreshStore();
    } catch (e) {
      showToast(errMsg(e, '가게 등록에 실패했어요'));
    }
  }

  async function saveStore(partial: UpdateStoreRequest) {
    if (!store) return;
    try {
      const updated = await storeApi.updateStore(store.storeId, partial);
      setStore(updated);
      showToast('가게 정보가 저장됐어요');
    } catch (e) {
      showToast(errMsg(e, '가게 정보 저장에 실패했어요'));
    }
  }

  function addMenu(item: Omit<MenuItem, 'id' | 'soldOut'>) {
    setMenu((list) => [...list, { ...item, id: nextMenuId, soldOut: false }]);
    setNextMenuId((n) => n + 1);
    showToast('메뉴를 추가했어요');
  }
  function updateMenu(id: number, item: Omit<MenuItem, 'id' | 'soldOut'>) {
    setMenu((list) => list.map((m) => (m.id === id ? { ...m, ...item } : m)));
    showToast('메뉴를 수정했어요');
  }
  function toggleSoldOut(id: number) {
    setMenu((list) => list.map((m) => (m.id === id ? { ...m, soldOut: !m.soldOut } : m)));
  }
  function requestDeleteMenu(id: number) {
    const m = menu.find((x) => x.id === id);
    if (!m) return;
    setConfirmDelete({ type: 'menu', id, label: m.name });
  }

  async function loadCouponTemplates() {
    setCouponTemplatesLoading(true);
    try {
      const res = await couponsApi.listIssuableTemplates();
      setCouponTemplates(res.templates);
    } catch (e) {
      showToast(errMsg(e, '쿠폰 템플릿을 불러오지 못했어요'));
    } finally {
      setCouponTemplatesLoading(false);
    }
  }
  async function addCouponTemplate(payload: CreateCouponTemplateRequest) {
    try {
      await couponsApi.createTemplate(payload);
      showToast('쿠폰 템플릿을 등록했어요');
      await loadCouponTemplates();
    } catch (e) {
      showToast(errMsg(e, '쿠폰 템플릿 등록에 실패했어요'));
    }
  }
  async function issueCoupon(templateId: number) {
    try {
      const res = await couponsApi.issueCoupon({ templateId });
      setIssuedCoupon(res);
      showToast('쿠폰을 발급했어요');
    } catch (e) {
      showToast(errMsg(e, '쿠폰 발급에 실패했어요'));
    }
  }
  function clearIssuedCoupon() {
    setIssuedCoupon(null);
  }
  function requestDeleteCouponTemplate(templateId: number) {
    const t = couponTemplates.find((x) => x.templateId === templateId);
    if (!t) return;
    setConfirmDelete({ type: 'coupon-template', id: templateId, label: t.name });
  }

  async function loadPartnerships() {
    setPartnershipsLoading(true);
    try {
      const res = await partnershipsApi.listPartnerships();
      setPartnerships(res.partnerships);
    } catch (e) {
      showToast(errMsg(e, '제휴 목록을 불러오지 못했어요'));
    } finally {
      setPartnershipsLoading(false);
    }
  }
  async function requestPartnership(receiverStoreId: number) {
    try {
      await partnershipsApi.requestPartnership({ receiverStoreId });
      showToast('제휴를 요청했어요');
      await loadPartnerships();
    } catch (e) {
      showToast(errMsg(e, '제휴 요청에 실패했어요'));
    }
  }
  async function acceptPartnership(id: number) {
    try {
      await partnershipsApi.acceptPartnership(id);
      showToast('제휴를 수락했어요');
      await loadPartnerships();
    } catch (e) {
      showToast(errMsg(e, '제휴 수락에 실패했어요'));
    }
  }
  async function rejectPartnership(id: number) {
    try {
      await partnershipsApi.rejectPartnership(id);
      showToast('제휴를 거절했어요');
      await loadPartnerships();
    } catch (e) {
      showToast(errMsg(e, '제휴 거절에 실패했어요'));
    }
  }
  function requestTerminatePartnership(id: number) {
    const p = partnerships.find((x) => x.partnershipId === id);
    if (!p) return;
    setConfirmDelete({ type: 'partnership', id, label: p.partnerStore.name });
  }

  async function loadStatistics(from: string, to: string) {
    if (!store) return;
    setStatisticsLoading(true);
    try {
      const res = await statisticsApi.getStoreStatistics(store.storeId, from, to);
      setStatistics(res);
    } catch (e) {
      showToast(errMsg(e, '통계를 불러오지 못했어요'));
    } finally {
      setStatisticsLoading(false);
    }
  }

  function cancelDelete() {
    setConfirmDelete(null);
  }
  async function confirmDeleteNow() {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    setConfirmDelete(null);

    if (type === 'menu') {
      setMenu((list) => list.filter((m) => m.id !== id));
      showToast('메뉴를 삭제했어요');
      return;
    }
    if (type === 'partnership') {
      try {
        await partnershipsApi.terminatePartnership(id);
        showToast('제휴를 해지했어요');
        await loadPartnerships();
      } catch (e) {
        showToast(errMsg(e, '제휴 해지에 실패했어요'));
      }
      return;
    }
    try {
      await couponsApi.deactivateTemplate(id);
      setCouponTemplates((list) => list.filter((t) => t.templateId !== id));
      showToast('쿠폰 템플릿을 삭제했어요');
    } catch (e) {
      showToast(errMsg(e, '쿠폰 템플릿 삭제에 실패했어요'));
    }
  }

  return (
    <AppContext.Provider
      value={{
        authed,
        authLoading,
        authMode,
        setAuthMode,
        login,
        signup,
        logout,
        store,
        storeStatus,
        registerStore,
        saveStore,
        menu,
        addMenu,
        updateMenu,
        toggleSoldOut,
        requestDeleteMenu,
        couponTemplates,
        couponTemplatesLoading,
        loadCouponTemplates,
        addCouponTemplate,
        issuedCoupon,
        issueCoupon,
        clearIssuedCoupon,
        requestDeleteCouponTemplate,
        partnerships,
        partnershipsLoading,
        loadPartnerships,
        requestPartnership,
        acceptPartnership,
        rejectPartnership,
        requestTerminatePartnership,
        statistics,
        statisticsLoading,
        loadStatistics,
        confirmDelete,
        cancelDelete,
        confirmDeleteNow,
        toastMsg,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

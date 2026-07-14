import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import * as storeApi from '../api/store';
import * as couponsApi from '../api/coupons';
import * as partnershipsApi from '../api/partnerships';
import * as statisticsApi from '../api/statistics';
import { ApiError, AUTH_EXPIRED_EVENT, clearTokens, getAccessToken, setTokens } from '../api/client';
import type {
  CouponTemplate,
  CreateCouponTemplateRequest,
  IssueCouponResponse,
  Partnership,
  RegisterStoreRequest,
  StoreStatistics,
  UpdateStoreRequest,
} from '../api/types';
import type { ConfirmDeleteTarget, MenuItem, StoreInfo } from '../types';
import { AppContext, type StoreStatus } from './context';

function errMsg(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

const CURRENT_EMAIL_KEY = 'bap_current_email';
const STORE_IDS_KEY = 'bap_store_ids_by_email';

function readStoreIds(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORE_IDS_KEY) || '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function rememberStoreId(email: string, storeId: number) {
  localStorage.setItem(STORE_IDS_KEY, JSON.stringify({ ...readStoreIds(), [email]: storeId }));
}

function storeIdFromToken(token: string | null): number | undefined {
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const value = payload.storeId ?? payload.store_id ?? payload.store?.storeId;
    const storeId = Number(value);
    return Number.isInteger(storeId) && storeId > 0 ? storeId : undefined;
  } catch {
    return undefined;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => !!getAccessToken());
  const [authLoading, setAuthLoading] = useState(false);

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('idle');

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  const [couponTemplates, setCouponTemplates] = useState<CouponTemplate[]>([]);
  const [couponTemplatesLoading, setCouponTemplatesLoading] = useState(false);
  const [issuedCoupon, setIssuedCoupon] = useState<IssueCouponResponse | null>(null);

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [partnershipsLoading, setPartnershipsLoading] = useState(false);
  const [partnershipRequestLoading, setPartnershipRequestLoading] = useState(false);

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

  async function refreshStore(knownStoreId?: number) {
    setStoreStatus('loading');
    try {
      const currentEmail = localStorage.getItem(CURRENT_EMAIL_KEY) || '';
      const cachedStoreId = currentEmail ? readStoreIds()[currentEmail] : undefined;
      const storeId = knownStoreId ?? cachedStoreId ?? storeIdFromToken(getAccessToken());
      const detail = storeId ? await storeApi.getStoreDetail(storeId) : await storeApi.getMyStore();
      if (currentEmail) rememberStoreId(currentEmail, detail.storeId);
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

  // 토큰 만료/무효(401 + 재발급 실패)로 세션이 끝나면 로그인 화면으로 보낸다.
  useEffect(() => {
    function onAuthExpired() {
      resetSession();
      showToast('로그인이 만료됐어요. 다시 로그인해주세요');
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    setAuthLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      localStorage.setItem(CURRENT_EMAIL_KEY, email);
      setAuthed(true);
      showToast('로그인 완료! 오늘도 화이팅이에요');
      await refreshStore(res.storeId ?? res.store?.storeId ?? storeIdFromToken(res.accessToken));
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
      localStorage.setItem(CURRENT_EMAIL_KEY, payload.email);
      setAuthed(true);
      showToast('사장님 계정이 만들어졌어요. 가게 정보를 등록해볼까요?');
      await refreshStore(res.storeId ?? res.store?.storeId ?? storeIdFromToken(res.accessToken));
    } catch (e) {
      showToast(errMsg(e, '회원가입에 실패했어요'));
    } finally {
      setAuthLoading(false);
    }
  }

  /** 로그인 상태와 관련 데이터를 모두 비운다 (수동 로그아웃 / 세션 만료 공용) */
  function resetSession() {
    clearTokens();
    setAuthed(false);
    setStore(null);
    setStoreStatus('idle');
    setCouponTemplates([]);
    setPartnerships([]);
    setStatistics(null);
    setMenu([]);
  }

  function logout() {
    authApi.logout().catch(() => {});
    resetSession();
  }

  async function registerStore(payload: RegisterStoreRequest) {
    try {
      const result = await storeApi.registerStore(payload);
      const currentEmail = localStorage.getItem(CURRENT_EMAIL_KEY);
      if (currentEmail) rememberStoreId(currentEmail, result.storeId);
      showToast('가게가 등록됐어요');
      await refreshStore(result.storeId);
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

  async function loadMenu() {
    if (!store) return;
    setMenuLoading(true);
    try {
      const detail = await storeApi.getStoreDetail(store.storeId);
      setMenu(detail.menus ?? []);
    } catch (e) {
      showToast(errMsg(e, '메뉴를 불러오지 못했어요'));
    } finally {
      setMenuLoading(false);
    }
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
  async function issueCoupon(templateId: number, targetStoreId: number) {
    try {
      const res = await couponsApi.issueCoupon({ templateId, targetStoreId });
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
  async function requestPartnershipByStoreName(storeName: string): Promise<boolean> {
    setPartnershipRequestLoading(true);
    try {
      const normalizedName = storeName.trim().toLocaleLowerCase();
      const res = await storeApi.searchStores(storeName.trim());
      const target = (res.content ?? []).find((candidate) => candidate.name.trim().toLocaleLowerCase() === normalizedName);
      if (!target) return false;
      await partnershipsApi.requestPartnership({ receiverStoreId: target.storeId });
      showToast('제휴 요청을 보냈어요');
      await loadPartnerships();
      return true;
    } catch (e) {
      showToast(errMsg(e, '제휴 요청에 실패했어요'));
      return false;
    } finally {
      setPartnershipRequestLoading(false);
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
        login,
        signup,
        logout,
        store,
        storeStatus,
        registerStore,
        saveStore,
        menu,
        menuLoading,
        loadMenu,
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
        requestPartnershipByStoreName,
        partnershipRequestLoading,
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

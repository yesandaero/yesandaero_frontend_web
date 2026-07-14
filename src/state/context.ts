import { createContext, useContext } from 'react';
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

export type StoreStatus = 'idle' | 'loading' | 'needs-store' | 'ready' | 'error';

export interface AppContextValue {
  authed: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;

  store: StoreInfo | null;
  storeStatus: StoreStatus;
  registerStore: (payload: RegisterStoreRequest) => Promise<void>;
  saveStore: (partial: UpdateStoreRequest) => Promise<void>;

  menu: MenuItem[];
  menuLoading: boolean;
  loadMenu: () => Promise<void>;

  couponTemplates: CouponTemplate[];
  couponTemplatesLoading: boolean;
  loadCouponTemplates: () => Promise<void>;
  addCouponTemplate: (payload: CreateCouponTemplateRequest) => Promise<void>;
  issuedCoupon: IssueCouponResponse | null;
  issueCoupon: (templateId: number, targetStoreId: number) => Promise<void>;
  clearIssuedCoupon: () => void;
  requestDeleteCouponTemplate: (templateId: number) => void;

  partnerships: Partnership[];
  partnershipsLoading: boolean;
  loadPartnerships: () => Promise<void>;
  requestPartnership: (receiverStoreId: number) => Promise<void>;
  requestPartnershipByStoreName: (storeName: string) => Promise<boolean>;
  partnershipRequestLoading: boolean;
  acceptPartnership: (id: number) => Promise<void>;
  rejectPartnership: (id: number) => Promise<void>;
  requestTerminatePartnership: (id: number) => void;

  statistics: StoreStatistics | null;
  statisticsLoading: boolean;
  loadStatistics: (from: string, to: string) => Promise<void>;

  confirmDelete: ConfirmDeleteTarget | null;
  cancelDelete: () => void;
  confirmDeleteNow: () => void;

  toastMsg: string;
  showToast: (msg: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}

import { useEffect, type ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { useApp } from './state/context';
import { AuthPage } from './pages/AuthPage';
import { StoreOnboardingPage } from './pages/StoreOnboardingPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StorePage } from './pages/StorePage';
import { MenuPage } from './pages/MenuPage';
import { CouponPage } from './pages/CouponPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { categoryLabel, HOME_PATH, ROUTES } from './data/constants';

function FullScreenMessage({ children }: { children: ReactNode }) {
  return <div className="empty-state" style={{ padding: '80px 20px' }}>{children}</div>;
}

/**
 * 로그인이 필요한 영역.
 * - 미로그인 → /login으로 튕김 (원래 가려던 곳을 state.from에 담아 로그인 후 복귀)
 * - 로그인했지만 가게 미등록 → /onboarding으로 보냄
 */
function ProtectedRoute() {
  const { authed, storeStatus, logout } = useApp();
  const location = useLocation();

  if (!authed) return <Navigate to={ROUTES.login} replace state={{ from: location }} />;

  if (storeStatus === 'idle' || storeStatus === 'loading') {
    return <FullScreenMessage>불러오는 중이에요...</FullScreenMessage>;
  }
  if (storeStatus === 'needs-store') return <Navigate to={ROUTES.onboarding} replace />;
  if (storeStatus === 'error') {
    return (
      <FullScreenMessage>
        가게 정보를 불러오지 못했어요. 새로고침해주세요.
        <div style={{ marginTop: 16 }}>
          <button className="btn btn-outline btn-sm" onClick={logout}>로그인 화면으로</button>
        </div>
      </FullScreenMessage>
    );
  }
  return <Outlet />;
}

/** 로그인/회원가입 전용. 이미 로그인했으면 앱 안으로(원래 가려던 곳이 있으면 그곳으로) 보냄 */
function PublicOnlyRoute() {
  const { authed } = useApp();
  const location = useLocation();

  if (authed) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
    const target = from && from !== ROUTES.login && from !== ROUTES.signup ? from : HOME_PATH;
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
}

/** 로그인은 했으나 가게가 없을 때만 접근 가능한 온보딩 */
function OnboardingRoute() {
  const { authed, storeStatus } = useApp();
  if (!authed) return <Navigate to={ROUTES.login} replace />;
  if (storeStatus === 'idle' || storeStatus === 'loading') {
    return <FullScreenMessage>불러오는 중이에요...</FullScreenMessage>;
  }
  if (storeStatus === 'ready') return <Navigate to={HOME_PATH} replace />;
  return <StoreOnboardingPage />;
}

/** 사이드바 + 상단바가 있는 앱 레이아웃 */
function Shell() {
  const { store, confirmDelete, cancelDelete, confirmDeleteNow, toastMsg, logout } = useApp();

  if (!store) return null;

  return (
    <>
      <div className="app-shell">
        <Sidebar storeName={store.name} storeCategory={categoryLabel(store.category)} onLogout={logout} />
        <div className="main">
          <TopBar />
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
      <Toast message={toastMsg} />
      <ConfirmModal target={confirmDelete} onCancel={cancelDelete} onConfirm={confirmDeleteNow} />
    </>
  );
}

function StoreRoute() {
  const { store, saveStore } = useApp();
  if (!store) return null;
  return <StorePage store={store} onSave={saveStore} />;
}

function MenuRoute() {
  const { menu, menuLoading, loadMenu } = useApp();
  useEffect(() => {
    loadMenu();
    // 메뉴 페이지 진입 시 한 번만 조회한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <MenuPage menu={menu} loading={menuLoading} onReload={loadMenu} />;
}

/** 로그인/회원가입 화면에서도 토스트는 보여야 한다 */
function AuthLayout() {
  const { toastMsg } = useApp();
  return (
    <>
      <Outlet />
      <Toast message={toastMsg} />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* 비로그인 전용 */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicOnlyRoute />}>
          <Route path={ROUTES.login} element={<AuthPage mode="login" />} />
          <Route path={ROUTES.signup} element={<AuthPage mode="signup" />} />
        </Route>
        <Route path={ROUTES.onboarding} element={<OnboardingRoute />} />
      </Route>

      {/* 로그인 필요 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path={ROUTES.store} element={<StoreRoute />} />
          <Route path={ROUTES.menu} element={<MenuRoute />} />
          <Route path={ROUTES.coupon} element={<CouponPage />} />
          <Route path={ROUTES.partnership} element={<PartnershipPage />} />
          <Route path={ROUTES.statistics} element={<StatisticsPage />} />
        </Route>
      </Route>

      {/* 그 외 주소는 홈으로 (로그인 안 했으면 ProtectedRoute가 다시 /login으로 보냄) */}
      <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
    </Routes>
  );
}

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;

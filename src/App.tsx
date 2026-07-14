import { useState } from 'react';
import { AppProvider } from './state/AppContext';
import { useApp } from './state/context';
import { AuthPage } from './pages/AuthPage';
import { StoreOnboardingPage } from './pages/StoreOnboardingPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/DashboardPage';
import { StorePage } from './pages/StorePage';
import { MenuPage } from './pages/MenuPage';
import { CouponPage } from './pages/CouponPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { Toast } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { categoryLabel } from './data/constants';
import type { TabKey } from './types';

function Shell() {
  const {
    store,
    saveStore,
    menu,
    addMenu,
    updateMenu,
    toggleSoldOut,
    requestDeleteMenu,
    confirmDelete,
    cancelDelete,
    confirmDeleteNow,
    toastMsg,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabKey>('store');

  if (!store) return null;

  return (
    <>
      <div className="app-shell">
        <Sidebar
          storeName={store.name}
          storeCategory={categoryLabel(store.category)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        />
        <div className="main">
          <TopBar tab={activeTab} />
          <div className="content">
            {activeTab === 'store' && <StorePage store={store} onSave={saveStore} />}
            {activeTab === 'menu' && (
              <MenuPage menu={menu} onAdd={addMenu} onUpdate={updateMenu} onDelete={requestDeleteMenu} onToggleSoldOut={toggleSoldOut} />
            )}
            {activeTab === 'coupon' && <CouponPage />}
            {activeTab === 'partnership' && <PartnershipPage />}
            {activeTab === 'statistics' && <StatisticsPage />}
          </div>
        </div>
      </div>
      <Toast message={toastMsg} />
      <ConfirmModal target={confirmDelete} onCancel={cancelDelete} onConfirm={confirmDeleteNow} />
    </>
  );
}

function Root() {
  const { authed, storeStatus } = useApp();

  if (!authed) return <AuthPage />;
  if (storeStatus === 'loading' || storeStatus === 'idle') {
    return <div className="empty-state" style={{ padding: '80px 20px' }}>불러오는 중이에요...</div>;
  }
  if (storeStatus === 'needs-store') return <StoreOnboardingPage />;
  if (storeStatus === 'error') {
    return <div className="empty-state" style={{ padding: '80px 20px' }}>가게 정보를 불러오지 못했어요. 새로고침해주세요.</div>;
  }
  return <Shell />;
}

const App = () => (
  <AppProvider>
    <Root />
  </AppProvider>
);

export default App;

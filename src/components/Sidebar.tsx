import { Icon } from './icons/Icon';
import { NAV } from '../data/constants';
import type { TabKey } from '../types';

export function Sidebar({
  storeName,
  storeCategory,
  activeTab,
  onTabChange,
  onLogout,
}: {
  storeName: string;
  storeCategory: string;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onLogout: () => void;
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-store">
        <div className="name">{storeName}</div>
        <div className="cat">{storeCategory}</div>
      </div>
      <div className="sidebar-nav">
        {NAV.map((n) => (
          <button
            key={n.key}
            className={`nav-item ${activeTab === n.key ? 'active' : ''}`}
            onClick={() => onTabChange(n.key)}
          >
            <span className="ic"><Icon name={n.iconName} size={19} /></span>
            {n.label}
          </button>
        ))}
      </div>
      <div className="sidebar-foot">
        <button className="logout-btn" onClick={onLogout}>
          <span className="ic"><Icon name="logout" size={18} /></span>
          로그아웃
        </button>
      </div>
    </div>
  );
}

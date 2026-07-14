import { TAB_META } from '../data/constants';
import { USE_MOCK } from '../api/client';
import type { TabKey } from '../types';

export function TopBar({ tab }: { tab: TabKey }) {
  const meta = TAB_META[tab];
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
  return (
    <div className="topbar">
      <div>
        <h1>{meta.title}</h1>
        <div className="sub">{meta.sub}</div>
      </div>
      <div className="topbar-right">
        <span className="date-pill">{today}</span>
      </div>
    </div>
  );
}

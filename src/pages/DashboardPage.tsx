import { Icon } from '../components/icons/Icon';
import { fmt } from '../utils/format';
import { useApp } from '../state/context';
import type { MenuItem } from '../types';

function BoardRow({ item }: { item: MenuItem }) {
  return (
    <div className={`board-row ${item.soldOut ? 'is-soldout' : ''}`}>
      <div className="board-name">
        <span className="name">{item.name}</span>
        {item.soldOut && <span className="badge">품절</span>}
      </div>
      <div className="board-price">
        <span className="final">{fmt(item.price)}원</span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { menu, couponTemplates } = useApp();
  const soldOutCount = menu.filter((m) => m.soldOut).length;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-box"><div className="num">{menu.length}</div><div className="lbl">등록 메뉴</div></div>
        <div className="stat-box"><div className="num">{soldOutCount}</div><div className="lbl">품절 메뉴</div></div>
        <div className="stat-box"><div className="num">{couponTemplates.length}</div><div className="lbl">발급 가능 쿠폰</div></div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <h2>오늘의 메뉴판</h2>
            <div className="hint">등록된 메뉴와 가격을 한눈에 확인하세요</div>
          </div>
        </div>
        {menu.length ? (
          menu.map((m) => <BoardRow key={m.id} item={m} />)
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="menu" size={27} /></div>
            등록된 메뉴가 없어요.<br />'메뉴 관리'에서 메뉴를 추가해보세요.
          </div>
        )}
      </div>
    </>
  );
}

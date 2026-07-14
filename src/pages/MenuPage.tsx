import { Icon } from '../components/icons/Icon';
import { fmt } from '../utils/format';
import type { MenuItem } from '../types';

export function MenuPage({
  menu,
  loading,
  onReload,
}: {
  menu: MenuItem[];
  loading: boolean;
  onReload: () => void;
}) {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>메뉴 목록</h2>
          <div className="hint">가게 상세 API에 등록된 메뉴를 표시합니다</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onReload} disabled={loading}>
          {loading ? '불러오는 중...' : '다시 불러오기'}
        </button>
      </div>

      {loading && !menu.length ? (
        <div className="empty-state">메뉴를 불러오는 중이에요...</div>
      ) : menu.length ? (
        menu.map((item) => (
          <div className="menu-row" key={item.menuId}>
            <div className="info">
              <div className="name-line">
                <span className="name">{item.name}</span>
              </div>
              {item.description && <div className="desc">{item.description}</div>}
            </div>
            <div className="price">
              {item.discountedPrice < item.price ? (
                <>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through', marginRight: 8 }}>{fmt(item.price)}원</span>
                  {fmt(item.discountedPrice)}원
                </>
              ) : (
                <>{fmt(item.price)}원</>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="menu" size={27} /></div>
          등록된 메뉴가 없어요.
        </div>
      )}
    </div>
  );
}

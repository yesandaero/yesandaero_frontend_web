import { useEffect, useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { fmt } from '../utils/format';
import { useApp } from '../state/context';

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function StatisticsPage() {
  const { statistics, statisticsLoading, loadStatistics } = useApp();

  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const [from, setFrom] = useState(toIsoDate(monthStart));
  const [to, setTo] = useState(toIsoDate(today));

  useEffect(() => {
    loadStatistics(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div>
            <h2>조회 기간</h2>
            <div className="hint">발급·사용 통계를 확인할 기간을 선택하세요</div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>시작일</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="field">
            <label>종료일</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary btn-sm" onClick={() => loadStatistics(from, to)}>조회</button>
        </div>
      </div>

      {statisticsLoading ? (
        <div className="card"><div className="empty-state">불러오는 중이에요...</div></div>
      ) : statistics ? (
        <>
          <div className="stat-grid" style={{marginTop: '14px'}}>
            <div className="stat-box"><div className="num">{fmt(statistics.issued.total)}</div><div className="lbl">발급된 쿠폰</div></div>
            <div className="stat-box"><div className="num">{fmt(statistics.issued.registered)}</div><div className="lbl">등록된 쿠폰</div></div>
            <div className="stat-box"><div className="num">{fmt(statistics.issued.used)}</div><div className="lbl">사용된 쿠폰</div></div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h2>우리 가게에서 사용된 쿠폰</h2>
                <div className="hint">어느 제휴 가게가 손님을 보내줬는지 확인해요 · 총 {fmt(statistics.redeemedAtMyStore.total)}건</div>
              </div>
            </div>
            {statistics.redeemedAtMyStore.byIssuerStore.length ? (
              statistics.redeemedAtMyStore.byIssuerStore.map((s) => (
                <div className="board-row" key={s.storeId}>
                  <div className="board-name"><span className="name">{s.name}</span></div>
                  <div className="board-price"><span className="final">{fmt(s.count)}건</span></div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Icon name="statistics" size={27} /></div>
                해당 기간에 사용된 제휴 쿠폰이 없어요.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card">
          <div className="empty-state">조회 버튼을 눌러 통계를 확인해보세요.</div>
        </div>
      )}
    </>
  );
}

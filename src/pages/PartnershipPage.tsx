import { useEffect, useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { Field } from '../components/Field';
import { categoryLabel } from '../data/constants';
import { useApp } from '../state/context';
import * as v from '../utils/validation';
import type { Partnership, PartnershipStatus } from '../api/types';

function statusMeta(status: PartnershipStatus): { label: string; badgeClass: string } {
  switch (status) {
    case 'PENDING':
      return { label: '대기중', badgeClass: 'badge-sale' };
    case 'ACCEPTED':
      return { label: '제휴중', badgeClass: 'badge-success' };
    case 'REJECTED':
      return { label: '거절됨', badgeClass: 'badge-muted' };
    case 'TERMINATED':
      return { label: '해지됨', badgeClass: 'badge-muted' };
  }
}

function PartnershipRow({ p }: { p: Partnership }) {
  const { acceptPartnership, rejectPartnership, requestTerminatePartnership } = useApp();
  const meta = statusMeta(p.status);
  const isReceivedPending = p.status === 'PENDING' && p.direction === 'RECEIVED';

  return (
    <div className="board-row">
      <div className="board-name">
        <span className="name">{p.partnerStore.name}</span>
        <span className={meta.badgeClass}>{meta.label}</span>
        <span className="empty-inline">{categoryLabel(p.partnerStore.category)}</span>
        <span className="empty-inline">{p.direction === 'SENT' ? '내가 요청' : '요청 받음'}</span>
      </div>
      <div className="promo-right">
        {isReceivedPending && (
          <>
            <button className="btn btn-outline btn-sm" onClick={() => rejectPartnership(p.partnershipId)}>거절</button>
            <button className="btn btn-primary btn-sm" onClick={() => acceptPartnership(p.partnershipId)}>수락</button>
          </>
        )}
        {p.status === 'ACCEPTED' && (
          <button className="btn btn-outline btn-sm" onClick={() => requestTerminatePartnership(p.partnershipId)}>해지</button>
        )}
      </div>
    </div>
  );
}

export function PartnershipPage() {
  const { partnerships, partnershipsLoading, loadPartnerships, requestPartnership } = useApp();
  const [adding, setAdding] = useState(false);
  const [receiverStoreId, setReceiverStoreId] = useState('');
  const [idError, setIdError] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadPartnerships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submitRequest() {
    const err = v.positiveInteger(receiverStoreId, '상대 가게 ID');
    setIdError(err);
    if (err) return;
    requestPartnership(Number(receiverStoreId));
    setReceiverStoreId('');
    setAdding(false);
  }

  const received = partnerships.filter((p) => p.status === 'PENDING' && p.direction === 'RECEIVED');
  const sent = partnerships.filter((p) => p.status === 'PENDING' && p.direction === 'SENT');
  const active = partnerships.filter((p) => p.status === 'ACCEPTED');
  const history = partnerships.filter((p) => p.status === 'REJECTED' || p.status === 'TERMINATED');

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>제휴 관리</h2>
          <div className="hint">상부상조할 가게와 제휴를 맺고 쿠폰 템플릿을 공유해요</div>
        </div>
        {!adding && (
          <button className="btn btn-primary btn-sm btn-icon" onClick={() => setAdding(true)}>
            <Icon name="plus" size={15} />제휴 요청
          </button>
        )}
      </div>

      {adding && (
        <div className="inline-form">
          <div className="field-row">
            <Field label="상대 가게 ID" error={idError} hint={idError ? undefined : '가게 검색 기능은 추후 연동 예정이라 지금은 가게 ID로 요청해요.'}>
              <input type="number" min={1} placeholder="12" value={receiverStoreId} onChange={(e) => { setReceiverStoreId(e.target.value); setIdError(undefined); }} />
            </Field>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>취소</button>
            <button className="btn btn-primary btn-sm" onClick={submitRequest}>요청 보내기</button>
          </div>
        </div>
      )}

      {partnershipsLoading ? (
        <div className="empty-state">불러오는 중이에요...</div>
      ) : partnerships.length ? (
        <>
          {received.length > 0 && (
            <>
              <div className="card-head" style={{ marginBottom: 6 }}><h2 style={{ fontSize: 14 }}>받은 요청</h2></div>
              {received.map((p) => <PartnershipRow key={p.partnershipId} p={p} />)}
            </>
          )}
          {sent.length > 0 && (
            <>
              <div className="card-head" style={{ marginBottom: 6 }}><h2 style={{ fontSize: 14 }}>보낸 요청</h2></div>
              {sent.map((p) => <PartnershipRow key={p.partnershipId} p={p} />)}
            </>
          )}
          {active.length > 0 && (
            <>
              <div className="card-head" style={{ marginBottom: 6 }}><h2 style={{ fontSize: 14 }}>활성 제휴</h2></div>
              {active.map((p) => <PartnershipRow key={p.partnershipId} p={p} />)}
            </>
          )}
          {history.length > 0 && (
            <>
              <div className="card-head" style={{ marginBottom: 6 }}><h2 style={{ fontSize: 14, marginTop:'12px' }}>지난 이력</h2></div>
              {history.map((p) => <PartnershipRow key={p.partnershipId} p={p} />)}
            </>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="partnership" size={27} /></div>
          아직 제휴가 없어요.<br />위의 '제휴 요청' 버튼으로 다른 가게에 제휴를 요청해보세요.
        </div>
      )}
    </div>
  );
}

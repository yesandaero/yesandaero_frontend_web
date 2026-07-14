import { useEffect, useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { fmt } from '../utils/format';
import { useApp } from '../state/context';
import type { DiscountType } from '../api/types';

function IssuedCouponCard({ onClose }: { onClose: () => void }) {
  const { issuedCoupon } = useApp();
  const [remaining, setRemaining] = useState(issuedCoupon?.expiresIn ?? 0);

  useEffect(() => {
    setRemaining(issuedCoupon?.expiresIn ?? 0);
    if (!issuedCoupon) return;
    const timer = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [issuedCoupon]);

  if (!issuedCoupon) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
          <Icon name="qr" size={22} />
        </div>
        <div className="modal-title">쿠폰이 발급됐어요</div>
        <div className="modal-desc">아래 코드를 고객에게 QR로 보여주세요. 제휴 가게에서 사용할 수 있어요.</div>
        <div className="inline-form mono" style={{ wordBreak: 'break-all', textAlign: 'left', fontSize: '13px' }}>
          {issuedCoupon.qrPayload}
        </div>
        <div className="modal-desc mono">{remaining > 0 ? `${remaining}초 후 만료` : '만료됨'}</div>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>확인</button>
        </div>
      </div>
    </div>
  );
}

export function CouponPage() {
  const {
    couponTemplates,
    couponTemplatesLoading,
    loadCouponTemplates,
    addCouponTemplate,
    issueCoupon,
    issuedCoupon,
    clearIssuedCoupon,
    requestDeleteCouponTemplate,
  } = useApp();

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('AMOUNT');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [validDays, setValidDays] = useState('14');

  useEffect(() => {
    loadCouponTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setName('');
    setDiscountType('AMOUNT');
    setDiscountValue('');
    setMinOrderAmount('');
    setValidDays('14');
    setAdding(true);
  }

  function saveNew() {
    const value = Number(discountValue) || 0;
    const minOrder = Number(minOrderAmount) || 0;
    const days = Number(validDays) || 0;
    if (!name.trim() || value <= 0 || days <= 0) return;
    addCouponTemplate({ name: name.trim(), discountType, discountValue: value, minOrderAmount: minOrder, validDays: days });
    setAdding(false);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>쿠폰 템플릿</h2>
          <div className="hint">제휴를 맺으면 상대 가게의 템플릿도 보이고, 발급도 할 수 있어요. 삭제는 내 템플릿만 가능해요.</div>
        </div>
        {!adding && (
          <button className="btn btn-primary btn-sm btn-icon" onClick={startAdd}>
            <Icon name="plus" size={15} />템플릿 등록
          </button>
        )}
      </div>

      {adding && (
        <div className="inline-form">
          <div className="field-row3">
            <div className="field">
              <label>템플릿 이름</label>
              <input type="text" placeholder="예: 아메리카노 1000원 할인" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>할인 유형</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as DiscountType)}>
                <option value="AMOUNT">정액 할인 (원)</option>
                <option value="RATE">정률 할인 (%, 1~100)</option>
              </select>
            </div>
            <div className="field">
              <label>할인 값</label>
              <input type="number" min={0} step={1} value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>최소 주문 금액 (원)</label>
              <input type="number" min={0} step={500} value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} />
            </div>
            <div className="field">
              <label>유효 기간 (일)</label>
              <input type="number" min={1} step={1} value={validDays} onChange={(e) => setValidDays(e.target.value)} />
            </div>
          </div>
          <div className="empty-inline">등록하면 결제 손님에게 발급할 수 있고, 쿠폰은 제휴(수락된) 가게에서 사용돼요.</div>
          <div className="form-actions">
            <button className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>취소</button>
            <button className="btn btn-primary btn-sm" onClick={saveNew}>등록</button>
          </div>
        </div>
      )}

      {couponTemplatesLoading ? (
        <div className="empty-state">불러오는 중이에요...</div>
      ) : couponTemplates.length ? (
        couponTemplates.map((t) => (
          <div className="promo-card" key={t.templateId}>
            <div>
              <div className="tag">
                {t.discountType === 'RATE' ? `${t.discountValue}% 할인` : `${fmt(t.discountValue)}원 할인`}
                {t.isMine ? ' · 내 템플릿' : ' · 제휴 가게 템플릿'}
              </div>
              <div className="label"><Icon name="tag" size={16} />{t.name}</div>
              <div className="scope">{t.store.name} · 최소주문 {fmt(t.minOrderAmount)}원 · {t.validDays}일 유효</div>
            </div>
            <div className="promo-right">
              <button className="btn btn-primary btn-sm" onClick={() => issueCoupon(t.templateId)}>발급</button>
              {t.isMine && (
                <button className="icon-btn" title="삭제" onClick={() => requestDeleteCouponTemplate(t.templateId)}>
                  <Icon name="trash" size={16} />
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="tag" size={27} /></div>
          등록된 쿠폰 템플릿이 없어요.<br />위의 '템플릿 등록' 버튼으로 첫 템플릿을 만들어보세요.
        </div>
      )}

      {issuedCoupon && <IssuedCouponCard onClose={clearIssuedCoupon} />}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '../components/icons/Icon';
import { Field } from '../components/Field';
import { fmt } from '../utils/format';
import { useApp } from '../state/context';
import * as v from '../utils/validation';
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
        <div className="modal-desc">아래 QR을 고객이 스캔하면 쿠폰이 등록돼요. 제휴 가게에서 사용할 수 있어요.</div>
        <div className="qr-box">
          <QRCodeSVG
            value={issuedCoupon.qrPayload}
            size={200}
            level="M"
            marginSize={2}
            bgColor="#FFFFFF"
            fgColor="#212529"
          />
        </div>
        <div className="qr-payload mono">{issuedCoupon.qrPayload}</div>
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
    partnerships,
    partnershipsLoading,
    loadPartnerships,
    showToast,
  } = useApp();

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('AMOUNT');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [validDays, setValidDays] = useState('14');
  const [targetStoreId, setTargetStoreId] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const clearErr = (key: string) => setErrors((e) => ({ ...e, [key]: undefined }));

  useEffect(() => {
    loadCouponTemplates();
    loadPartnerships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptedPartners = partnerships.filter((partnership) => partnership.status === 'ACCEPTED');

  useEffect(() => {
    if (!targetStoreId && acceptedPartners.length) {
      setTargetStoreId(String(acceptedPartners[0].partnerStore.storeId));
    }
  }, [acceptedPartners, targetStoreId]);

  function issue(templateId: number) {
    if (!targetStoreId) {
      showToast('쿠폰 사용처로 지정할 제휴 가게를 선택해주세요');
      return;
    }
    issueCoupon(templateId, Number(targetStoreId));
  }

  function startAdd() {
    setName('');
    setDiscountType('AMOUNT');
    setDiscountValue('');
    setMinOrderAmount('');
    setValidDays('14');
    setErrors({});
    setAdding(true);
  }

  function saveNew() {
    const next = {
      name: v.required(name, '템플릿 이름'),
      discountValue:
        discountType === 'RATE'
          ? v.numberInRange(discountValue, '할인율', 1, 100)
          : v.positiveNumber(discountValue, '할인 금액'),
      minOrderAmount: v.nonNegativeNumber(minOrderAmount, '최소 주문 금액'),
      validDays: v.positiveInteger(validDays, '유효 기간'),
    };
    setErrors(next);
    if (v.hasErrors(next)) return;
    addCouponTemplate({
      name: name.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      validDays: Number(validDays),
    });
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

      <div className="inline-form" style={{ marginBottom: 18 }}>
        <Field label="쿠폰 사용처 (수락된 제휴 가게)">
          <select value={targetStoreId} onChange={(e) => setTargetStoreId(e.target.value)} disabled={partnershipsLoading}>
            <option value="">{partnershipsLoading ? '제휴 가게를 불러오는 중...' : '사용처를 선택해주세요'}</option>
            {acceptedPartners.map((partnership) => (
              <option key={partnership.partnershipId} value={partnership.partnerStore.storeId}>
                {partnership.partnerStore.name}
              </option>
            ))}
          </select>
        </Field>
        {!partnershipsLoading && !acceptedPartners.length && (
          <div className="empty-inline">쿠폰을 발급하려면 먼저 수락된 제휴 가게가 필요해요.</div>
        )}
      </div>

      {adding && (
        <div className="inline-form">
          <div className="field-row3">
            <Field label="템플릿 이름" error={errors.name}>
              <input type="text" placeholder="예: 아메리카노 1000원 할인" value={name} onChange={(e) => { setName(e.target.value); clearErr('name'); }} />
            </Field>
            <Field label="할인 유형">
              <select value={discountType} onChange={(e) => { setDiscountType(e.target.value as DiscountType); clearErr('discountValue'); }}>
                <option value="AMOUNT">정액 할인 (원)</option>
                <option value="RATE">정률 할인 (%, 1~100)</option>
              </select>
            </Field>
            <Field label={discountType === 'RATE' ? '할인율 (%)' : '할인 금액 (원)'} error={errors.discountValue}>
              <input type="number" min={0} step={1} value={discountValue} onChange={(e) => { setDiscountValue(e.target.value); clearErr('discountValue'); }} />
            </Field>
          </div>
          <div className="field-row">
            <Field label="최소 주문 금액 (원)" error={errors.minOrderAmount}>
              <input type="number" min={0} step={500} value={minOrderAmount} onChange={(e) => { setMinOrderAmount(e.target.value); clearErr('minOrderAmount'); }} />
            </Field>
            <Field label="유효 기간 (일)" error={errors.validDays}>
              <input type="number" min={1} step={1} value={validDays} onChange={(e) => { setValidDays(e.target.value); clearErr('validDays'); }} />
            </Field>
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
              <div className="scope">
                {t.store?.name ?? t.storeName ?? '가게 정보 없음'} · 최소주문 {fmt(t.minOrderAmount)}원 · {t.validDays}일 유효
              </div>
            </div>
            <div className="promo-right">
              <button
                className="btn btn-primary btn-sm"
                disabled={!t.isMine || !targetStoreId}
                title={!t.isMine ? '본인 가게의 템플릿만 발급할 수 있어요' : undefined}
                onClick={() => issue(t.templateId)}
              >
                발급
              </button>
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

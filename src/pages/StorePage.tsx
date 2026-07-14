import { useState } from 'react';
import { STORE_CATEGORIES } from '../data/constants';
import type { StoreInfo } from '../types';
import type { StoreCategory, UpdateStoreRequest } from '../api/types';

export function StorePage({ store, onSave }: { store: StoreInfo; onSave: (partial: UpdateStoreRequest) => void }) {
  const [draft, setDraft] = useState({
    name: store.name,
    category: store.category,
    address: store.address,
    phone: store.phone,
    avgPrice: String(store.avgPrice),
    description: store.description,
  });

  function field<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>기본 정보</h2>
          <div className="hint">고객에게 그대로 노출되는 정보예요</div>
        </div>
      </div>
      <div className="field">
        <label>가게 이름</label>
        <input type="text" value={draft.name} onChange={(e) => field('name', e.target.value)} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>카테고리</label>
          <select value={draft.category} onChange={(e) => field('category', e.target.value as StoreCategory)}>
            {STORE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>전화번호</label>
          <input type="text" placeholder="042-000-0000" value={draft.phone} onChange={(e) => field('phone', e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>주소</label>
        <input type="text" value={draft.address} onChange={(e) => field('address', e.target.value)} />
      </div>
      <div className="field">
        <label>1인 평균 가격 (원)</label>
        <input type="number" min={0} step={100} value={draft.avgPrice} onChange={(e) => field('avgPrice', e.target.value)} />
      </div>
      <div className="field">
        <label>가게 소개</label>
        <textarea value={draft.description} onChange={(e) => field('description', e.target.value)} />
      </div>
      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={() =>
            onSave({
              name: draft.name.trim() || store.name,
              category: draft.category,
              address: draft.address.trim(),
              phone: draft.phone.trim(),
              avgPrice: Number(draft.avgPrice) || 0,
              description: draft.description.trim(),
            })
          }
        >
          가게 정보 저장
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { STORE_CATEGORIES } from '../data/constants';
import { useApp } from '../state/context';
import type { StoreCategory } from '../api/types';

export function StoreOnboardingPage() {
  const { registerStore, logout } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreCategory>('KOREAN');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [phone, setPhone] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function submit() {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const price = Number(avgPrice);
    if (!name.trim() || !address.trim() || !phone.trim() || !avgPrice || !latitude || !longitude) {
      setError('필수 항목을 모두 입력해주세요');
      return;
    }
    setError('');
    registerStore({
      name: name.trim(),
      category,
      address: address.trim(),
      latitude: lat,
      longitude: lng,
      phone: phone.trim(),
      avgPrice: price,
      description: description.trim(),
    });
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="mark"><Icon name="store" size={26} /></div>
          <div className="t1">가게 등록</div>
          <div className="t2">손님을 맞이할 가게 정보를 입력해주세요</div>
        </div>

        {error && <div className="auth-note" style={{ color: 'var(--danger)' }}>{error}</div>}

        <div className="field">
          <label>가게 이름</label>
          <input type="text" placeholder="예: 이모네 국밥" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label>카테고리</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as StoreCategory)}>
              {STORE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>전화번호</label>
            <input type="text" placeholder="042-000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>주소</label>
          <input type="text" placeholder="대전시 유성구 ..." value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label>위도</label>
            <input type="number" placeholder="36.3624" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div className="field">
            <label>경도</label>
            <input type="number" placeholder="127.3568" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>1인 평균 가격 (원)</label>
          <input type="number" placeholder="9000" min={0} step={100} value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} />
        </div>
        <div className="field">
          <label>가게 소개 <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(선택)</span></label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={submit}>가게 등록하고 시작하기</button>
        <div className="auth-foot"><span onClick={logout}>다른 계정으로 로그인</span></div>
      </div>
    </div>
  );
}

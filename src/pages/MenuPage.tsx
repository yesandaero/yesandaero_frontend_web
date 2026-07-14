import { useState } from 'react';
import { Icon } from '../components/icons/Icon';
import { fmt } from '../utils/format';
import type { MenuItem } from '../types';

interface MenuDraft {
  name: string;
  price: string;
  desc: string;
}
const emptyDraft: MenuDraft = { name: '', price: '', desc: '' };

export function MenuPage({
  menu,
  onAdd,
  onUpdate,
  onDelete,
  onToggleSoldOut,
}: {
  menu: MenuItem[];
  onAdd: (item: { name: string; price: number; desc: string }) => void;
  onUpdate: (id: number, item: { name: string; price: number; desc: string }) => void;
  onDelete: (id: number) => void;
  onToggleSoldOut: (id: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<MenuDraft>(emptyDraft);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<MenuDraft>(emptyDraft);

  function startAdd() {
    setEditingId(null);
    setNewDraft(emptyDraft);
    setAdding(true);
  }
  function saveNew() {
    const name = newDraft.name.trim();
    const price = Number(newDraft.price) || 0;
    if (!name || price <= 0) return;
    onAdd({ name, price, desc: newDraft.desc.trim() });
    setAdding(false);
  }

  function startEdit(m: MenuItem) {
    setAdding(false);
    setEditingId(m.id);
    setEditDraft({ name: m.name, price: String(m.price), desc: m.desc });
  }
  function saveEdit(id: number) {
    const name = editDraft.name.trim();
    const price = Number(editDraft.price) || 0;
    if (!name || price <= 0) return;
    onUpdate(id, { name, price, desc: editDraft.desc.trim() });
    setEditingId(null);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>메뉴 목록</h2>
          <div className="hint">가격과 품절 여부를 바로 바꿀 수 있어요</div>
        </div>
        {!adding && (
          <button className="btn btn-primary btn-sm btn-icon" onClick={startAdd}>
            <Icon name="plus" size={15} />메뉴 추가
          </button>
        )}
      </div>

      {adding && (
        <div className="inline-form">
          <div className="field-row3">
            <div className="field">
              <label>메뉴명</label>
              <input type="text" autoFocus placeholder="예: 순대국밥" value={newDraft.name} onChange={(e) => setNewDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="field">
              <label>가격 (원)</label>
              <input type="number" placeholder="9000" min={0} step={100} value={newDraft.price} onChange={(e) => setNewDraft((d) => ({ ...d, price: e.target.value }))} />
            </div>
            <div className="field">
              <label>설명 (선택)</label>
              <input type="text" placeholder="한 줄 설명" value={newDraft.desc} onChange={(e) => setNewDraft((d) => ({ ...d, desc: e.target.value }))} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-outline btn-sm" onClick={() => setAdding(false)}>취소</button>
            <button className="btn btn-primary btn-sm" onClick={saveNew}>저장</button>
          </div>
        </div>
      )}

      {menu.length ? (
        menu.map((m) =>
          m.id === editingId ? (
            <div className="inline-form" key={m.id}>
              <div className="field-row3">
                <div className="field">
                  <label>메뉴명</label>
                  <input type="text" value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>가격 (원)</label>
                  <input type="number" min={0} step={100} value={editDraft.price} onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))} />
                </div>
                <div className="field">
                  <label>설명 (선택)</label>
                  <input type="text" value={editDraft.desc} onChange={(e) => setEditDraft((d) => ({ ...d, desc: e.target.value }))} />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>취소</button>
                <button className="btn btn-primary btn-sm" onClick={() => saveEdit(m.id)}>저장</button>
              </div>
            </div>
          ) : (
            <div className="menu-row" key={m.id}>
              <div className="info">
                <div className="name-line">
                  <span className="name">{m.name}</span>
                  {m.soldOut && <span className="badge">품절</span>}
                </div>
                {m.desc && <div className="desc">{m.desc}</div>}
              </div>
              <div className="price">{fmt(m.price)}원</div>
              <div className="soldout-label">품절</div>
              <label className="switch danger">
                <input type="checkbox" checked={m.soldOut} onChange={() => onToggleSoldOut(m.id)} />
                <span className="slider"></span>
              </label>
              <div className="actions">
                <button className="icon-btn" title="수정" onClick={() => startEdit(m)}><Icon name="edit" size={16} /></button>
                <button className="icon-btn" title="삭제" onClick={() => onDelete(m.id)}><Icon name="trash" size={16} /></button>
              </div>
            </div>
          ),
        )
      ) : (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="menu" size={27} /></div>
          등록된 메뉴가 없어요.<br />위의 '메뉴 추가' 버튼으로 첫 메뉴를 등록해보세요.
        </div>
      )}
    </div>
  );
}

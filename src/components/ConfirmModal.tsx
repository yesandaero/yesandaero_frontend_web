import { Icon } from './icons/Icon';
import type { ConfirmDeleteTarget } from '../types';

const VERB: Record<ConfirmDeleteTarget['type'], { action: string; desc: string; icon: 'trash' | 'partnership' }> = {
  menu: { action: '삭제', desc: '삭제하면 되돌릴 수 없어요.', icon: 'trash' },
  partnership: { action: '해지', desc: '해지 후에도 이미 발급된 쿠폰은 유효기간까지 사용할 수 있어요.', icon: 'partnership' },
  'coupon-template': { action: '삭제', desc: '삭제하면 더 이상 발급할 수 없어요. 이미 발급된 쿠폰은 유효기간까지 그대로 사용할 수 있어요.', icon: 'trash' },
};

export function ConfirmModal({
  target,
  onCancel,
  onConfirm,
}: {
  target: ConfirmDeleteTarget | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!target) return null;
  const meta = VERB[target.type];
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <Icon name={meta.icon} size={23} />
        </div>
        <div className="modal-title">'{target.label}' {meta.action}할까요?</div>
        <div className="modal-desc">{meta.desc}</div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>취소</button>
          <button className="btn btn-danger" onClick={onConfirm}>{meta.action}</button>
        </div>
      </div>
    </div>
  );
}

import { Icon } from './icons/Icon';

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="toast">
      <Icon name="check" size={18} />
      <span>{message}</span>
    </div>
  );
}

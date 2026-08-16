import { classNames } from '@/shared/utils';

import type { Toast, ToastTone } from '../types';

import styles from './ToastItem.module.scss';

const MARK_BY_TONE: Record<ToastTone, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: '•',
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div className={classNames(styles.toast, styles[toast.tone])}>
      <span className={styles.mark} aria-hidden="true">
        {MARK_BY_TONE[toast.tone]}
      </span>

      <p className={styles.message}>{toast.message}</p>

      <button
        type="button"
        className={styles.close}
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
}

import { ToastItem } from '../ToastItem';
import type { Toast } from '../types';

import styles from './ToastViewport.module.scss';

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className={styles.viewport} role="region" aria-label="Notificações">
      <div aria-live="polite" aria-atomic="false" className={styles.stack}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  );
}

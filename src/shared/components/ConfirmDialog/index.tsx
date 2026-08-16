import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/shared/components/Button';
import { classNames } from '@/shared/utils';

import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll';

import styles from './ConfirmDialog.module.scss';

export type ConfirmDialogTone = 'neutral' | 'destructive';

const EYEBROW_BY_TONE: Record<ConfirmDialogTone, string> = {
  neutral: 'Confirmação',
  destructive: 'Atenção!',
};

interface ConfirmDialogProps {
  title: string;
  description: string;
  eyebrow?: string;
  tone?: ConfirmDialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  eyebrow,
  tone = 'destructive',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useLockBodyScroll();

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return createPortal(
    <div className={styles.scrim} onMouseDown={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={styles.dialog}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className={classNames(styles.eyebrow, styles[tone])}>{eyebrow ?? EYEBROW_BY_TONE[tone]}</p>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
        <p className={styles.description} id={descriptionId}>
          {description}
        </p>

        <div className={styles.actions}>
          <Button variant="ghost" onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={tone === 'destructive' ? 'danger' : 'solid'}
            onClick={onConfirm}
            isLoading={isConfirming}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

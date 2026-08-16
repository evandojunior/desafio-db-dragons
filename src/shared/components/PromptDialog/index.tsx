import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { z } from 'zod';

import { Button } from '@/shared/components/Button';
import { TextAreaField } from '@/shared/components/TextAreaField';

import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll';

import styles from './PromptDialog.module.scss';

interface PromptDialogProps {
  title?: string;
  label: string;
  eyebrow: string;
  placeholder?: string;
  hint?: string;
  initialValue?: string;
  confirmLabel?: string;
  maxLength: number;
  requiredMessage: string;
  isSubmitting?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  title,
  label,
  eyebrow,
  placeholder,
  hint,
  initialValue = '',
  confirmLabel = 'Salvar',
  maxLength,
  requiredMessage,
  isSubmitting = false,
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const titleId = useId();
  const eyebrowId = useId();
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  const schema = z.object({
    value: z
      .string()
      .trim()
      .min(1, requiredMessage)
      .max(maxLength, `Use no máximo ${maxLength} caracteres.`),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{ value: string }>({
    resolver: zodResolver(schema),
    defaultValues: { value: initialValue },
  });

  const { ref: registerRef, ...field } = register('value');
  const currentValue = useWatch({ control, name: 'value', defaultValue: initialValue });

  useLockBodyScroll();

  useEffect(() => {
    fieldRef.current?.focus();
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
        aria-labelledby={title ? titleId : eyebrowId}
        className={styles.dialog}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className={styles.eyebrow} id={eyebrowId}>
          {eyebrow}
        </p>

        {title && (
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
        )}

        <form
          className={styles.form}
          onSubmit={handleSubmit(({ value }) => onConfirm(value.trim()))}
          noValidate
        >
          <TextAreaField
            {...field}
            ref={(node) => {
              registerRef(node);
              fieldRef.current = node;
            }}
            label={label}
            hideLabel
            placeholder={placeholder}
            maxLength={maxLength}
            counter={`${currentValue?.length ?? 0}/${maxLength}`}
            hint={hint}
            error={errors.value?.message}
          />

          <div className={styles.actions}>
            <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {confirmLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

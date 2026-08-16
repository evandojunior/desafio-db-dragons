import { useId, type Ref, type TextareaHTMLAttributes } from 'react';

import { classNames } from '@/shared/utils';

import styles from './TextAreaField.module.scss';

interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  counter?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextAreaField({
  label,
  error,
  hint,
  hideLabel = false,
  counter,
  className,
  ...rest
}: TextAreaFieldProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const describedBy = classNames(hint && hintId, error && errorId) || undefined;

  return (
    <div className={classNames(styles.field, className)}>
      <label className={classNames(styles.label, hideLabel && styles.hiddenLabel)} htmlFor={fieldId}>
        {label}
      </label>

      <textarea
        {...rest}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={classNames(styles.input, error && styles.inputInvalid)}
      />

      <div className={styles.footer}>
        <div className={styles.messages}>
          {hint && !error && (
            <p className={styles.hint} id={hintId}>
              {hint}
            </p>
          )}

          {error && (
            <p className={styles.error} id={errorId} role="alert">
              {error}
            </p>
          )}
        </div>

        {counter && <p className={styles.counter}>{counter}</p>}
      </div>
    </div>
  );
}

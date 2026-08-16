import { useId, type InputHTMLAttributes, type Ref } from 'react';

import { classNames } from '@/shared/utils';

import styles from './TextField.module.scss';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  counter?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({
  label,
  error,
  hint,
  isRequired = false,
  counter,
  className,
  ...rest
}: TextFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const describedBy = classNames(hint && hintId, error && errorId) || undefined;

  return (
    <div className={classNames(styles.field, className)}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        {isRequired && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </div>

      <input
        {...rest}
        id={inputId}
        required={isRequired || undefined}
        aria-required={isRequired || undefined}
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

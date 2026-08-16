import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';

import { classNames } from '@/shared/utils';

import styles from './Button.module.scss';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
  children: ReactNode;
}

export function Button({
  variant = 'solid',
  isLoading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={classNames(
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
    >
      {isLoading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
    </button>
  );
}

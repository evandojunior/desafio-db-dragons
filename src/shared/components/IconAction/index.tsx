import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { classNames } from '@/shared/utils';

import styles from './IconAction.module.scss';

export type IconActionTone = 'info' | 'ember' | 'danger';

interface BaseProps {
  label: string;
  tone: IconActionTone;
  children: ReactNode;
}

interface IconActionLinkProps extends BaseProps {
  to: string;
}

interface IconActionButtonProps extends BaseProps {
  onClick: () => void;
  disabled?: boolean;
}

export function IconActionLink({ label, tone, to, children }: IconActionLinkProps) {
  return (
    <Link className={classNames(styles.action, styles[tone])} to={to} title={label} aria-label={label}>
      {children}
    </Link>
  );
}

export function IconActionButton({
  label,
  tone,
  onClick,
  disabled,
  children,
}: IconActionButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.action, styles[tone])}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}

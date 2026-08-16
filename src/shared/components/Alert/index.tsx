import type { ReactNode } from 'react';

import { classNames } from '@/shared/utils';

import styles from './Alert.module.scss';

export type AlertTone = 'warning' | 'danger' | 'info';

const LABEL_BY_TONE: Record<AlertTone, string> = {
  warning: 'Atenção',
  danger: 'Erro',
  info: 'Aviso',
};

interface AlertProps {
  tone: AlertTone;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Alert({ tone, title, description, action }: AlertProps) {
  return (
    <div className={classNames(styles.alert, styles[tone])} role="alert">
      <p className={styles.label}>{LABEL_BY_TONE[tone]}</p>

      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

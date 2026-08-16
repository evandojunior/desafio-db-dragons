import type { ReactNode } from 'react';

import { classNames } from '@/shared/utils';

import styles from './StateMessage.module.scss';

export type StateMessageTone = 'neutral' | 'danger';

interface StateMessageProps {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: StateMessageTone;
  action?: ReactNode;
}

export function StateMessage({
  eyebrow,
  title,
  description,
  tone = 'neutral',
  action,
}: StateMessageProps) {
  return (
    <div className={classNames(styles.state, styles[tone])} role="status">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

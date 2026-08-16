import type { ReactNode } from 'react';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  meta?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, meta, actions }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.heading}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}

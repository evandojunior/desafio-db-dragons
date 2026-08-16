import styles from './LoadingIndicator.module.scss';

interface LoadingIndicatorProps {
  label?: string;
}

export function LoadingIndicator({ label = 'Carregando…' }: LoadingIndicatorProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.bars} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

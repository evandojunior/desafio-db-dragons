import { classNames } from '@/shared/utils';

import type { SortField, SortState } from '../sorting';

import styles from './SortableColumn.module.scss';

const INDICATOR_BY_DIRECTION = { asc: '↑', desc: '↓' } as const;

interface SortableColumnProps {
  field: SortField;
  label: string;
  sort: SortState;
  onToggle: (field: SortField) => void;
  className?: string;
}

export function SortableColumn({ field, label, sort, onToggle, className }: SortableColumnProps) {
  const isActive = sort.field === field;
  const ariaSort = isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <th scope="col" aria-sort={ariaSort} className={classNames(styles.header, className)}>
      <button
        type="button"
        className={classNames(styles.trigger, isActive && styles.active)}
        onClick={() => onToggle(field)}
      >
        {label}
        <span className={styles.indicator} aria-hidden="true">
          {isActive ? INDICATOR_BY_DIRECTION[sort.direction] : '↕'}
        </span>
      </button>
    </th>
  );
}

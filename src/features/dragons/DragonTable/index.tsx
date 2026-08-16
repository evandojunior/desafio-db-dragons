import type { Dragon } from '@/shared/types';

import { DragonTableRow } from '../DragonTableRow';
import { SortableColumn } from '../SortableColumn';
import type { SortField, SortState } from '../sorting';

import styles from './DragonTable.module.scss';

interface DragonTableProps {
  dragons: Dragon[];
  sort: SortState;
  onToggleSort: (field: SortField) => void;
  onRemove: (dragon: Dragon) => void;
}

export function DragonTable({ dragons, sort, onToggleSort, onRemove }: DragonTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <caption className={styles.caption}>Dragões registrados</caption>

        <thead className={styles.head}>
          <tr>
            <SortableColumn
              field="registration"
              label="Nº"
              sort={sort}
              onToggle={onToggleSort}
              className={styles.position}
            />
            <SortableColumn field="name" label="Nome" sort={sort} onToggle={onToggleSort} />
            <SortableColumn field="type" label="Tipo" sort={sort} onToggle={onToggleSort} />
            <SortableColumn
              field="createdAt"
              label="Criado em"
              sort={sort}
              onToggle={onToggleSort}
            />
            <th scope="col" className={styles.actions}>
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {dragons.map((dragon, index) => (
            <DragonTableRow
              key={dragon.id}
              dragon={dragon}
              position={index + 1}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

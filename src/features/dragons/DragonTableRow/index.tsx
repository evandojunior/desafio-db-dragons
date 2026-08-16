import { memo } from 'react';
import { Link } from 'react-router-dom';

import { IconActionButton, IconActionLink } from '@/shared/components/IconAction';
import { EyeIcon } from '@/shared/components/icons/EyeIcon';
import { PencilIcon } from '@/shared/components/icons/PencilIcon';
import { TrashIcon } from '@/shared/components/icons/TrashIcon';
import type { Dragon } from '@/shared/types';
import { formatDate, toDateTimeAttribute } from '@/shared/utils';

import styles from './DragonTableRow.module.scss';

interface DragonTableRowProps {
  dragon: Dragon;
  position: number;
  onRemove: (dragon: Dragon) => void;
}

function DragonTableRowComponent({ dragon, position, onRemove }: DragonTableRowProps) {
  return (
    <tr className={styles.row}>
      <td className={styles.position}>{String(position).padStart(2, '0')}</td>

      <td className={styles.nameCell} data-label="Nome">
        <Link className={styles.name} to={`/dragons/${dragon.id}`}>
          {dragon.name || 'Sem nome'}
        </Link>
      </td>

      <td className={styles.typeCell} data-label="Tipo">
        <span className={styles.type}>{dragon.type || 'Indefinido'}</span>
      </td>

      <td className={styles.dateCell} data-label="Criado em">
        <time className={styles.date} dateTime={toDateTimeAttribute(dragon.createdAt)}>
          {formatDate(dragon.createdAt)}
        </time>
      </td>

      <td className={styles.actionsCell}>
        <div className={styles.actions}>
          <IconActionLink tone="info" to={`/dragons/${dragon.id}`} label={`Visualizar ${dragon.name}`}>
            <EyeIcon />
          </IconActionLink>

          <IconActionLink
            tone="ember"
            to={`/dragons/${dragon.id}/edit`}
            label={`Editar ${dragon.name}`}
          >
            <PencilIcon />
          </IconActionLink>

          <IconActionButton
            tone="danger"
            onClick={() => onRemove(dragon)}
            label={`Remover ${dragon.name}`}
          >
            <TrashIcon />
          </IconActionButton>
        </div>
      </td>
    </tr>
  );
}

export const DragonTableRow = memo(DragonTableRowComponent);

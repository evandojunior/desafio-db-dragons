import { Button } from '@/shared/components/Button';
import { IconActionButton } from '@/shared/components/IconAction';
import { PencilIcon } from '@/shared/components/icons/PencilIcon';
import { PlusIcon } from '@/shared/components/icons/PlusIcon';
import { TrashIcon } from '@/shared/components/icons/TrashIcon';

import styles from './DragonHistories.module.scss';

interface DragonHistoriesProps {
  histories: string[];
  isSaving: boolean;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export function DragonHistories({
  histories,
  isSaving,
  onAdd,
  onEdit,
  onRemove,
}: DragonHistoriesProps) {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Histórias
          {histories.length > 0 && <span className={styles.count}>{histories.length}</span>}
        </h2>

        <Button variant="outline" onClick={onAdd} disabled={isSaving}>
          <PlusIcon />
          Adicionar
        </Button>
      </header>

      {histories.length === 0 ? (
        <p className={styles.empty}>
          Nenhuma história registrada para este dragão. Use o botão acima para escrever a primeira.
        </p>
      ) : (
        <ol className={styles.list} aria-label="Histórias do dragão">
          {histories.map((history, index) => (
            <li key={`${index}-${history}`} className={styles.item}>
              <span className={styles.position} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>

              <p className={styles.text}>{history}</p>

              <div className={styles.actions}>
                <IconActionButton
                  tone="ember"
                  onClick={() => onEdit(index)}
                  disabled={isSaving}
                  label={`Editar história ${index + 1}`}
                >
                  <PencilIcon />
                </IconActionButton>

                <IconActionButton
                  tone="danger"
                  onClick={() => onRemove(index)}
                  disabled={isSaving}
                  label={`Remover história ${index + 1}`}
                >
                  <TrashIcon />
                </IconActionButton>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

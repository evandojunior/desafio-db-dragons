import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { PageHeader } from '@/shared/components/PageHeader';
import { PromptDialog } from '@/shared/components/PromptDialog';
import { StateMessage } from '@/shared/components/StateMessage';
import { useToast } from '@/shared/components/Toast/useToast';
import { PencilIcon } from '@/shared/components/icons/PencilIcon';
import { TrashIcon } from '@/shared/components/icons/TrashIcon';
import { isNotFound, toErrorMessage } from '@/shared/services/httpError';
import { formatDateTime, toDateTimeAttribute } from '@/shared/utils';

import { DragonHistories } from '../DragonHistories';
import { useDeleteDragon, useDragonQuery, useUpdateDragon } from '../queries';
import { MAX_HISTORY_LENGTH } from '../schemas';

import styles from './DragonDetailPage.module.scss';

type ActiveDialog =
  | { mode: 'create-history' }
  | { mode: 'edit-history'; index: number }
  | { mode: 'remove-history'; index: number }
  | { mode: 'remove-dragon' };

export function DragonDetailPage() {
  const { id = '' } = useParams();
  const { data: dragon, isPending, isError, error } = useDragonQuery(id);
  const updateDragon = useUpdateDragon(id);
  const deleteDragon = useDeleteDragon();
  const navigate = useNavigate();
  const toast = useToast();
  const [dialog, setDialog] = useState<ActiveDialog | null>(null);

  async function saveHistories(histories: string[], successMessage: string) {
    try {
      await updateDragon.mutateAsync({ histories });
      toast.success(successMessage);
    } catch (saveError) {
      toast.error(toErrorMessage(saveError, 'Não foi possível salvar a história.'));
    } finally {
      setDialog(null);
    }
  }

  async function removeDragon(name: string) {
    try {
      await deleteDragon.mutateAsync(id);
      toast.success(`${name} saiu do catálogo.`);
      navigate('/dragons', { replace: true });
    } catch (removalError) {
      toast.error(toErrorMessage(removalError, 'Não foi possível remover o dragão.'));
      setDialog(null);
    }
  }

  if (isPending) {
    return <LoadingIndicator label="Abrindo registro…" />;
  }

  if (isError) {
    return (
      <StateMessage
        tone="danger"
        eyebrow={isNotFound(error) ? 'Registro ausente' : 'Falha na consulta'}
        title={isNotFound(error) ? 'Dragão não encontrado' : 'Não foi possível abrir o registro'}
        description={toErrorMessage(error, 'Tente novamente em instantes.')}
        action={<Button onClick={() => navigate('/dragons')}>Voltar ao catálogo</Button>}
      />
    );
  }

  const editingIndex = dialog?.mode === 'edit-history' ? dialog.index : null;
  const removingIndex = dialog?.mode === 'remove-history' ? dialog.index : null;

  return (
    <>
      <Link className={styles.back} to="/dragons">
        <span aria-hidden="true">←</span> Voltar ao catálogo
      </Link>

      <PageHeader
        title="Ficha de registro"
        actions={
          <>
            <Link className={styles.action} to={`/dragons/${dragon.id}/edit`}>
              <PencilIcon />
              Editar
            </Link>
            <button
              type="button"
              className={styles.destructiveAction}
              onClick={() => setDialog({ mode: 'remove-dragon' })}
            >
              <TrashIcon />
              Remover
            </button>
          </>
        }
      />

      <dl className={styles.sheet}>
        <div className={styles.entry}>
          <dt className={styles.term}>Registro</dt>
          <dd className={styles.identifier}>{dragon.id}</dd>
        </div>

        <div className={styles.entry}>
          <dt className={styles.term}>Nome</dt>
          <dd className={styles.value}>{dragon.name || 'Sem nome'}</dd>
        </div>

        <div className={styles.entry}>
          <dt className={styles.term}>Tipo</dt>
          <dd className={styles.value}>{dragon.type || 'Indefinido'}</dd>
        </div>

        <div className={styles.entry}>
          <dt className={styles.term}>Data de criação</dt>
          <dd className={styles.value}>
            <time dateTime={toDateTimeAttribute(dragon.createdAt)}>
              {formatDateTime(dragon.createdAt)}
            </time>
          </dd>
        </div>
      </dl>

      <DragonHistories
        histories={dragon.histories}
        isSaving={updateDragon.isPending}
        onAdd={() => setDialog({ mode: 'create-history' })}
        onEdit={(index) => setDialog({ mode: 'edit-history', index })}
        onRemove={(index) => setDialog({ mode: 'remove-history', index })}
      />

      {dialog?.mode === 'create-history' && (
        <PromptDialog
          eyebrow="Nova história"
          label="História"
          placeholder="Escreva a história do dragão"
          maxLength={MAX_HISTORY_LENGTH}
          requiredMessage="Escreva a história antes de salvar."
          confirmLabel="Adicionar"
          isSubmitting={updateDragon.isPending}
          onConfirm={(value) => saveHistories([...dragon.histories, value], 'História adicionada.')}
          onCancel={() => setDialog(null)}
        />
      )}

      {editingIndex !== null && (
        <PromptDialog
          eyebrow={`Editar história ${String(editingIndex + 1).padStart(2, '0')}`}
          label="História"
          placeholder="Escreva a história do dragão"
          initialValue={dragon.histories[editingIndex]}
          maxLength={MAX_HISTORY_LENGTH}
          requiredMessage="A história não pode ficar vazia."
          isSubmitting={updateDragon.isPending}
          onConfirm={(value) =>
            saveHistories(
              dragon.histories.map((entry, index) => (index === editingIndex ? value : entry)),
              'História atualizada.',
            )
          }
          onCancel={() => setDialog(null)}
        />
      )}

      {removingIndex !== null && (
        <ConfirmDialog
          title="Remover esta história?"
          description="Você tem certeza que deseja remover essa história? Essa ação não pode ser desfeita."
          confirmLabel="Remover"
          isConfirming={updateDragon.isPending}
          onConfirm={() =>
            saveHistories(
              dragon.histories.filter((_, index) => index !== removingIndex),
              'História removida.',
            )
          }
          onCancel={() => setDialog(null)}
        />
      )}

      {dialog?.mode === 'remove-dragon' && (
        <ConfirmDialog
          title="Remover este dragão?"
          description="Você tem certeza que deseja remover esse dragão? Essa ação não pode ser desfeita."
          confirmLabel="Remover"
          isConfirming={deleteDragon.isPending}
          onConfirm={() => removeDragon(dragon.name)}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateMessage } from '@/shared/components/StateMessage';
import { useToast } from '@/shared/components/Toast/useToast';
import { isNotFound, toErrorMessage } from '@/shared/services/httpError';

import { DragonForm } from '../DragonForm';
import { useDragonQuery, useUpdateDragon } from '../queries';
import type { DragonFormValues } from '../schemas';

export function EditDragonPage() {
  const { id = '' } = useParams();
  const { data: dragon, isPending, isError, error } = useDragonQuery(id);
  const updateDragon = useUpdateDragon(id);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [pendingValues, setPendingValues] = useState<DragonFormValues | null>(null);

  function goBackToOrigin() {
    if (location.key === 'default') {
      navigate('/dragons');
      return;
    }

    navigate(-1);
  }

  async function confirmUpdate() {
    if (!pendingValues) {
      return;
    }

    try {
      await updateDragon.mutateAsync(pendingValues);
      toast.success('Registro atualizado.');
      navigate(`/dragons/${id}`);
    } catch (updateError) {
      toast.error(toErrorMessage(updateError, 'Não foi possível salvar as alterações.'));
    } finally {
      setPendingValues(null);
    }
  }

  if (isPending) {
    return <LoadingIndicator label="Carregando registro…" />;
  }

  if (isError) {
    return (
      <StateMessage
        tone="danger"
        eyebrow={isNotFound(error) ? 'Registro ausente' : 'Falha na consulta'}
        title={isNotFound(error) ? 'Dragão não encontrado' : 'Não foi possível abrir o registro'}
        description={toErrorMessage(error, 'Tente novamente em instantes.')}
        action={<Button onClick={() => navigate('/dragons')}>Voltar ao índice</Button>}
      />
    );
  }

  return (
    <>
      <PageHeader eyebrow="Edição" title={dragon.name} meta={`Registro ${dragon.id}`} />

      <DragonForm
        initialValues={{ name: dragon.name, type: dragon.type }}
        submitLabel="Salvar alterações"
        requireChanges
        submitError={
          updateDragon.isError
            ? toErrorMessage(updateDragon.error, 'A API não respondeu.')
            : undefined
        }
        onSubmit={async (values) => setPendingValues(values)}
        onCancel={goBackToOrigin}
      />

      {pendingValues && (
        <ConfirmDialog
          tone="neutral"
          eyebrow="Atenção!"
          title="Salvar alterações?"
          description="Você tem certeza que deseja editar esse registro?"
          confirmLabel="Salvar"
          isConfirming={updateDragon.isPending}
          onConfirm={confirmUpdate}
          onCancel={() => setPendingValues(null)}
        />
      )}
    </>
  );
}

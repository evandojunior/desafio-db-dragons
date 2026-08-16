import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/shared/components/PageHeader';
import { useToast } from '@/shared/components/Toast/useToast';
import { toErrorMessage } from '@/shared/services/httpError';

import { DragonForm } from '../DragonForm';
import { useCreateDragon } from '../queries';
import type { DragonFormValues } from '../schemas';

export function NewDragonPage() {
  const createDragon = useCreateDragon();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(values: DragonFormValues) {
    try {
      const dragon = await createDragon.mutateAsync(values);
      toast.success(`${dragon.name} entrou para o índice.`);
      navigate('/dragons');
    } catch (error) {
      toast.error(toErrorMessage(error, 'Não foi possível registrar o dragão.'));
    }
  }

  return (
    <>
      <PageHeader
        title="Registrar dragão"
      />

      <DragonForm
        submitLabel="Registrar"
        submitError={
          createDragon.isError
            ? toErrorMessage(createDragon.error, 'A API não respondeu.')
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dragons')}
      />
    </>
  );
}

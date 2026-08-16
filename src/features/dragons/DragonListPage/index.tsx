import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';
import { PageHeader } from '@/shared/components/PageHeader';
import { StateMessage } from '@/shared/components/StateMessage';
import { useToast } from '@/shared/components/Toast/useToast';
import { toErrorMessage } from '@/shared/services/httpError';
import type { Dragon } from '@/shared/types';
import { formatDateTime } from '@/shared/utils';

import { DragonTable } from '../DragonTable';
import { DragonToolbar } from '../DragonToolbar';
import { useDeleteDragon, useDragonListQuery } from '../queries';
import { useDragonCatalog } from '../useDragonCatalog';

import styles from './DragonListPage.module.scss';

function buildResultLabel(visible: number, total: number): string {
  if (visible === total) {
    return total === 1 ? '1 registro' : `${total} registros`;
  }

  return `${visible} de ${total} registros`;
}

export function DragonListPage() {
  const {
    data: dragons,
    isPending,
    isError,
    error,
    failureReason,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useDragonListQuery();
  const catalog = useDragonCatalog(dragons);
  const deleteDragon = useDeleteDragon();
  const toast = useToast();
  const [pendingRemoval, setPendingRemoval] = useState<Dragon | null>(null);

  const handleRemove = useCallback((dragon: Dragon) => setPendingRemoval(dragon), []);

  const isShowingCachedData = Boolean(dragons) && failureReason !== null && !isFetching;

  function confirmRemoval() {
    if (!pendingRemoval) {
      return;
    }

    const { id, name } = pendingRemoval;

    deleteDragon.mutate(id, {
      onSuccess: () => toast.success(`${name} saiu do catálogo.`),
      onError: (removalError) =>
        toast.error(toErrorMessage(removalError, 'Não foi possível remover o dragão.')),
      onSettled: () => setPendingRemoval(null),
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Meus dragões"
        actions={
          <Link className={styles.newLink} to="/dragons/new">
            Registrar dragão
          </Link>
        }
      />

      {isShowingCachedData && (
        <div className={styles.state}>
          <Alert
            tone="warning"
            title="Exibindo a última cópia salva neste navegador"
            description={`${toErrorMessage(failureReason, 'A API não respondeu.')} Os dados abaixo são de ${formatDateTime(new Date(dataUpdatedAt).toISOString())} e podem estar desatualizados.`}
            action={
              <Button variant="outline" onClick={() => refetch()}>
                Atualizar
              </Button>
            }
          />
        </div>
      )}

      {isPending && <LoadingIndicator label="Consultando o catálogo…" />}

      {isError && !dragons && (
        <div className={styles.state}>
          <StateMessage
            tone="danger"
            eyebrow="Falha na consulta"
            title="O catálogo não pôde ser carregado"
            description={toErrorMessage(error, 'Tente novamente em instantes.')}
            action={<Button onClick={() => refetch()}>Tentar novamente</Button>}
          />
        </div>
      )}

      {dragons && dragons.length === 0 && (
        <div className={styles.state}>
          <StateMessage
            eyebrow="Catálogo vazio"
            title="Nenhum dragão registrado"
            description="Comece o catálogo registrando a primeira criatura."
            action={
              <Link className={styles.newLink} to="/dragons/new">
                Registrar dragão
              </Link>
            }
          />
        </div>
      )}

      {dragons && dragons.length > 0 && (
        <>
          <DragonToolbar
            search={catalog.search}
            onSearchChange={catalog.setSearch}
            selectedType={catalog.selectedType}
            onTypeChange={catalog.setSelectedType}
            availableTypes={catalog.availableTypes}
            hasActiveFilters={catalog.hasActiveFilters}
            onClear={catalog.clearFilters}
            resultLabel={buildResultLabel(catalog.visibleDragons.length, dragons.length)}
          />

          {catalog.visibleDragons.length === 0 ? (
            <div className={styles.state}>
              <StateMessage
                eyebrow="Sem resultados"
                title="Nenhum dragão corresponde ao filtro"
                description="Ajuste a busca, escolha outro tipo ou limpe os filtros acima."
              />
            </div>
          ) : (
            <DragonTable
              dragons={catalog.visibleDragons}
              sort={catalog.sort}
              onToggleSort={catalog.toggleSort}
              onRemove={handleRemove}
            />
          )}
        </>
      )}

      {pendingRemoval && (
        <ConfirmDialog
          title="Remover este dragão?"
          description={`Você tem certeza que deseja remover esse dragão? Essa ação não pode ser desfeita.`}
          confirmLabel="Remover"
          isConfirming={deleteDragon.isPending}
          onConfirm={confirmRemoval}
          onCancel={() => setPendingRemoval(null)}
        />
      )}
    </>
  );
}

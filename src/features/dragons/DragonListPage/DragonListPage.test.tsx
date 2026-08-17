import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/services/httpError';
import { authenticate } from '@/test/authenticate';
import { buildDragon, createInMemoryDragonRepository } from '@/test/inMemoryDragonRepository';
import { createTestQueryClient, renderApp } from '@/test/renderApp';

import { dragonKeys } from '../queries';

const DRAGONS = [
  buildDragon({ id: '1', name: 'Zephyr', type: 'Vento', createdAt: '2026-01-10T10:00:00.000Z' }),
  buildDragon({ id: '2', name: 'alcione', type: 'Draconico', createdAt: '2026-05-20T10:00:00.000Z' }),
  buildDragon({ id: '3', name: 'Harry', type: 'Luz', createdAt: '2026-03-15T10:00:00.000Z' }),
];

function visibleNames(): (string | null)[] {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent ?? null);
}

async function openRemovalDialog(user: UserEvent, name: string) {
  const row = (await screen.findByRole('link', { name })).closest('tr') as HTMLElement;

  await user.click(within(row).getByRole('button', { name: `Remover ${name}` }));

  return within(await screen.findByRole('dialog'));
}

describe('catalogo de dragoes', () => {
  beforeEach(async () => {
    await authenticate();
  });

  it('lista os nomes em ordem alfabetica ignorando a caixa', async () => {
    renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await screen.findByRole('table');

    expect(visibleNames()).toEqual(['alcione', 'Harry', 'Zephyr']);
  });

  it('informa quantos registros existem', async () => {
    renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    expect(await screen.findByText('3 registros')).toBeInTheDocument();
  });

  it('inverte a ordem ao clicar de novo na coluna nome', async () => {
    const { user } = renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await user.click(await screen.findByRole('button', { name: /Nome/ }));

    expect(visibleNames()).toEqual(['Zephyr', 'Harry', 'alcione']);
    expect(screen.getByRole('columnheader', { name: /Nome/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  });

  it('ordena pela data de criacao', async () => {
    const { user } = renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await user.click(await screen.findByRole('button', { name: /Criado em/ }));

    expect(visibleNames()).toEqual(['Zephyr', 'Harry', 'alcione']);
  });

  it('ordena pelo tipo', async () => {
    const { user } = renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await user.click(await screen.findByRole('button', { name: /Tipo/ }));

    expect(visibleNames()).toEqual(['alcione', 'Harry', 'Zephyr']);
  });

  it('filtra pela busca ignorando acento e caixa', async () => {
    const dragons = createInMemoryDragonRepository([
      ...DRAGONS,
      buildDragon({ id: '4', name: 'Fúria da Noite', type: 'Fogo' }),
    ]);
    const { user } = renderApp({ dragons });

    await user.type(await screen.findByLabelText('Buscar'), 'furia');

    expect(visibleNames()).toEqual(['Fúria da Noite']);
    expect(screen.getByText('1 de 4 registros')).toBeInTheDocument();
  });

  it('filtra pelo tipo escolhido', async () => {
    const { user } = renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await user.selectOptions(await screen.findByLabelText('Tipo'), 'Luz');

    expect(visibleNames()).toEqual(['Harry']);
  });

  it('avisa e permite limpar quando o filtro nao encontra nada', async () => {
    const { user } = renderApp({ dragons: createInMemoryDragonRepository(DRAGONS) });

    await user.type(await screen.findByLabelText('Buscar'), 'quimera');

    expect(screen.getByText('Nenhum dragão corresponde ao filtro')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(visibleNames()).toEqual(['alcione', 'Harry', 'Zephyr']);
  });

  it('mostra o estado vazio quando nao ha registros', async () => {
    renderApp({ dragons: createInMemoryDragonRepository([]) });

    expect(await screen.findByText('Nenhum dragão registrado')).toBeInTheDocument();
  });

  it('mostra o estado de erro e permite tentar de novo', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    const list = vi
      .spyOn(dragons, 'list')
      .mockRejectedValueOnce(new HttpError('server', 500))
      .mockResolvedValueOnce(DRAGONS);

    const { user } = renderApp({ dragons });

    expect(await screen.findByText('O catálogo não pôde ser carregado')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(await screen.findByText('Harry')).toBeInTheDocument();
    expect(list).toHaveBeenCalledTimes(2);
  });

  it('mostra a copia em cache e avisa quando a api cai', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    vi.spyOn(dragons, 'list').mockRejectedValue(new HttpError('network'));

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(dragonKeys.list(), DRAGONS);

    renderApp({ dragons, queryClient });

    expect(
      await screen.findByText('Exibindo a última cópia salva neste navegador'),
    ).toBeInTheDocument();
    expect(visibleNames()).toHaveLength(3);
    expect(screen.queryByText('O catálogo não pôde ser carregado')).not.toBeInTheDocument();
  });

  it('mostra o erro de carga quando a api cai sem nada em cache', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    vi.spyOn(dragons, 'list').mockRejectedValue(new HttpError('network'));

    renderApp({ dragons });

    expect(await screen.findByText('O catálogo não pôde ser carregado')).toBeInTheDocument();
    expect(
      screen.getByText('Não foi possível falar com o servidor. Verifique sua conexão.'),
    ).toBeInTheDocument();
  });

  it('remove o dragao apos confirmacao', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    const { user } = renderApp({ dragons });

    const dialog = await openRemovalDialog(user, 'Harry');
    await user.click(dialog.getByRole('button', { name: 'Remover' }));

    await waitFor(() =>
      expect(screen.queryByRole('link', { name: 'Harry' })).not.toBeInTheDocument(),
    );
    expect(dragons.seed.map((dragon) => dragon.name)).not.toContain('Harry');
  });

  it('mantem o dragao ao cancelar a remocao', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    const remove = vi.spyOn(dragons, 'remove');
    const { user } = renderApp({ dragons });

    const dialog = await openRemovalDialog(user, 'Harry');
    await user.click(dialog.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByRole('link', { name: 'Harry' })).toBeInTheDocument();
    expect(remove).not.toHaveBeenCalled();
  });

  it('devolve o dragao a lista quando a remocao falha na api', async () => {
    const dragons = createInMemoryDragonRepository(DRAGONS);
    vi.spyOn(dragons, 'remove').mockRejectedValue(new HttpError('server', 500));
    const { user } = renderApp({ dragons });

    const dialog = await openRemovalDialog(user, 'Harry');
    await user.click(dialog.getByRole('button', { name: 'Remover' }));

    expect(await screen.findByRole('link', { name: 'Harry' })).toBeInTheDocument();
  });
});

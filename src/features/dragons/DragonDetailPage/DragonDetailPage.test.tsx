import { screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/services/httpError';
import { authenticate } from '@/test/authenticate';
import { buildDragon, createInMemoryDragonRepository } from '@/test/inMemoryDragonRepository';
import { renderApp } from '@/test/renderApp';

const DRAGON = buildDragon({
  id: '7',
  name: 'Fúria da Noite',
  type: 'Fogo',
  createdAt: '2026-03-12T18:46:34.760Z',
});

function withHistories(...histories: string[]) {
  return createInMemoryDragonRepository([buildDragon({ ...DRAGON, histories })]);
}

function renderDetail(dragons = withHistories()) {
  return renderApp({ route: '/dragons/7', dragons });
}

describe('ficha do dragao', () => {
  beforeEach(async () => {
    await authenticate();
  });

  it('apresenta nome, tipo e data de criacao', async () => {
    renderDetail();

    expect(await screen.findByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Fogo')).toBeInTheDocument();
    expect(screen.getByText('Data de criação')).toBeInTheDocument();
    expect(screen.getByText(/12\/03\/2026/)).toBeInTheDocument();
  });

  it('lista as historias registradas', async () => {
    renderDetail(withHistories('Atinge velocidade supersônica', 'Tem cargas de plasma'));

    const list = await screen.findByRole('list', { name: 'Histórias do dragão' });

    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Atinge velocidade supersônica')).toBeInTheDocument();
  });

  it('convida a escrever a primeira historia quando nao ha nenhuma', async () => {
    renderDetail();

    expect(await screen.findByText(/Nenhuma história registrada/)).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'Histórias do dragão' })).not.toBeInTheDocument();
  });

  it('avisa quando o registro nao existe', async () => {
    renderApp({ route: '/dragons/999', dragons: withHistories() });

    expect(await screen.findByText('Dragão não encontrado')).toBeInTheDocument();
  });
});

describe('historias do dragao', () => {
  beforeEach(async () => {
    await authenticate();
  });

  it('adiciona uma historia pelo dialogo', async () => {
    const dragons = withHistories('Primeira');
    const { user } = renderDetail(dragons);

    await user.click(await screen.findByRole('button', { name: 'Adicionar' }));

    const dialog = within(screen.getByRole('dialog'));
    await user.type(dialog.getByLabelText('História'), 'Cospe plasma azul');
    await user.click(dialog.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(dragons.seed[0]?.histories).toEqual(['Primeira', 'Cospe plasma azul']);
  });

  it('recusa historia vazia sem chamar a api', async () => {
    const dragons = withHistories();
    const update = vi.spyOn(dragons, 'update');
    const { user } = renderDetail(dragons);

    await user.click(await screen.findByRole('button', { name: 'Adicionar' }));

    const dialog = within(screen.getByRole('dialog'));
    await user.type(dialog.getByLabelText('História'), '   ');
    await user.click(dialog.getByRole('button', { name: 'Adicionar' }));

    expect(await screen.findByText('Escreva a história antes de salvar.')).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });

  it('edita a historia escolhida mantendo as demais', async () => {
    const dragons = withHistories('Primeira', 'Segunda');
    const { user } = renderDetail(dragons);

    const items = within(
      await screen.findByRole('list', { name: 'Histórias do dragão' }),
    ).getAllByRole('listitem');

    await user.click(
      within(items[1] as HTMLElement).getByRole('button', { name: 'Editar história 2' }),
    );

    const dialog = within(screen.getByRole('dialog'));
    const field = dialog.getByLabelText('História');

    expect(field).toHaveValue('Segunda');

    await user.clear(field);
    await user.type(field, 'Segunda revisada');
    await user.click(dialog.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(dragons.seed[0]?.histories).toEqual(['Primeira', 'Segunda revisada']);
  });

  it('remove a historia apos confirmacao', async () => {
    const dragons = withHistories('Primeira', 'Segunda');
    const { user } = renderDetail(dragons);

    const items = within(
      await screen.findByRole('list', { name: 'Histórias do dragão' }),
    ).getAllByRole('listitem');

    await user.click(
      within(items[0] as HTMLElement).getByRole('button', { name: 'Remover história 1' }),
    );

    const dialog = within(screen.getByRole('dialog'));
    await user.click(dialog.getByRole('button', { name: 'Remover' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(dragons.seed[0]?.histories).toEqual(['Segunda']);
  });

  it('mantem a historia ao cancelar a remocao', async () => {
    const dragons = withHistories('Primeira');
    const update = vi.spyOn(dragons, 'update');
    const { user } = renderDetail(dragons);

    const item = within(
      await screen.findByRole('list', { name: 'Histórias do dragão' }),
    ).getAllByRole('listitem')[0] as HTMLElement;

    await user.click(within(item).getByRole('button', { name: 'Remover história 1' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });

  it('avisa quando a api recusa salvar a historia', async () => {
    const dragons = withHistories();
    vi.spyOn(dragons, 'update').mockRejectedValue(new HttpError('network'));
    const { user } = renderDetail(dragons);

    await user.click(await screen.findByRole('button', { name: 'Adicionar' }));

    const dialog = within(screen.getByRole('dialog'));
    await user.type(dialog.getByLabelText('História'), 'Cospe plasma azul');
    await user.click(dialog.getByRole('button', { name: 'Adicionar' }));

    expect(
      await screen.findByText('Não foi possível falar com o servidor. Verifique sua conexão.'),
    ).toBeInTheDocument();
  });
});

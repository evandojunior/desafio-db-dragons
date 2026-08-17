import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpError } from '@/shared/services/httpError';
import { authenticate } from '@/test/authenticate';
import { buildDragon, createInMemoryDragonRepository } from '@/test/inMemoryDragonRepository';
import { renderApp } from '@/test/renderApp';

const DRAGON = buildDragon({ id: '7', name: 'Fúria da Noite', type: 'Fogo' });

describe('cadastro de dragao', () => {
  beforeEach(async () => {
    await authenticate();
  });

  it('registra e volta para o indice', async () => {
    const dragons = createInMemoryDragonRepository([]);
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.type(await screen.findByLabelText('Nome'), 'Sarai');
    await user.type(screen.getByLabelText('Tipo'), 'Luz');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Meus dragões')).toBeInTheDocument();
    expect(dragons.seed.map((dragon) => dragon.name)).toContain('Sarai');
  });

  it('bloqueia o envio e nao chama a api quando um campo fica vazio', async () => {
    const dragons = createInMemoryDragonRepository([]);
    const create = vi.spyOn(dragons, 'create');
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.type(await screen.findByLabelText('Nome'), 'Sarai');
    await user.type(screen.getByLabelText('Tipo'), 'Luz');
    await user.clear(screen.getByLabelText('Tipo'));
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Informe o tipo do dragão.')).toBeInTheDocument();
    expect(create).not.toHaveBeenCalled();
  });

  it('acusa os dois campos obrigatorios ao enviar o formulario vazio', async () => {
    const dragons = createInMemoryDragonRepository([]);
    const create = vi.spyOn(dragons, 'create');
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.click(await screen.findByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Informe o nome do dragão.')).toBeInTheDocument();
    expect(screen.getByText('Informe o tipo do dragão.')).toBeInTheDocument();
    expect(create).not.toHaveBeenCalled();
  });

  it('marca os campos como obrigatorios para tecnologia assistiva', async () => {
    renderApp({ route: '/dragons/new' });

    expect(await screen.findByLabelText("Nome")).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText("Tipo")).toHaveAttribute('aria-required', 'true');
  });

  it('valida ao sair do campo, sem esperar o envio', async () => {
    const { user } = renderApp({ route: '/dragons/new' });

    const nameInput = await screen.findByLabelText("Nome");
    await user.click(nameInput);
    await user.tab();

    expect(await screen.findByText('Informe o nome do dragão.')).toBeInTheDocument();
  });

  it('limita o tamanho do nome e mostra quanto ja foi usado', async () => {
    const { user } = renderApp({ route: '/dragons/new' });

    const nameInput = await screen.findByLabelText("Nome");

    expect(nameInput).toHaveAttribute('maxLength', '60');
    expect(screen.getByText('0/60')).toBeInTheDocument();

    await user.type(nameInput, 'Sarai');

    expect(screen.getByText('5/60')).toBeInTheDocument();
  });

  it('liga a mensagem de erro ao campo correspondente', async () => {
    const { user } = renderApp({ route: '/dragons/new' });

    await user.type(await screen.findByLabelText('Tipo'), 'Luz');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    const input = await screen.findByLabelText('Nome');
    const errorId = input.getAttribute('aria-describedby');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById(errorId ?? '')).toHaveTextContent('Informe o nome do dragão.');
  });

  it('mantem o formulario preenchido quando a api recusa', async () => {
    const dragons = createInMemoryDragonRepository([]);
    vi.spyOn(dragons, 'create').mockRejectedValue(new HttpError('server', 500));
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.type(await screen.findByLabelText('Nome'), 'Sarai');
    await user.type(screen.getByLabelText('Tipo'), 'Luz');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('button', { name: 'Registrar' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nome')).toHaveValue('Sarai');
  });

  it('explica na tela por que o registro nao foi salvo quando a api cai', async () => {
    const dragons = createInMemoryDragonRepository([]);
    vi.spyOn(dragons, 'create').mockRejectedValue(new HttpError('network'));
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.type(await screen.findByLabelText('Nome'), 'Sarai');
    await user.type(screen.getByLabelText('Tipo'), 'Luz');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent('O registro não foi salvo');
    expect(alert).toHaveTextContent('Não foi possível falar com o servidor.');
  });

  it('diferencia estouro de tempo de falha de rede na mensagem', async () => {
    const dragons = createInMemoryDragonRepository([]);
    vi.spyOn(dragons, 'create').mockRejectedValue(new HttpError('timeout'));
    const { user } = renderApp({ route: '/dragons/new', dragons });

    await user.type(await screen.findByLabelText('Nome'), 'Sarai');
    await user.type(screen.getByLabelText('Tipo'), 'Luz');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'A requisição demorou demais para responder.',
    );
  });
});

describe('edicao de dragao', () => {
  beforeEach(async () => {
    await authenticate();
  });

  it('carrega os valores atuais no formulario', async () => {
    renderApp({ route: '/dragons/7/edit', dragons: createInMemoryDragonRepository([DRAGON]) });

    expect(await screen.findByLabelText('Nome')).toHaveValue('Fúria da Noite');
    expect(screen.getByLabelText('Tipo')).toHaveValue('Fogo');
  });

  it('pede confirmacao antes de gravar a alteracao', async () => {
    const dragons = createInMemoryDragonRepository([DRAGON]);
    const update = vi.spyOn(dragons, 'update');
    const { user } = renderApp({ route: '/dragons/7/edit', dragons });

    const nameInput = await screen.findByLabelText('Nome');
    await user.clear(nameInput);
    await user.type(nameInput, 'Banguela');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    const dialog = within(await screen.findByRole('dialog'));

    expect(dialog.getByText('Salvar alterações?')).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });

  it('persiste a alteracao apos confirmacao e abre a ficha atualizada', async () => {
    const dragons = createInMemoryDragonRepository([DRAGON]);
    const { user } = renderApp({ route: '/dragons/7/edit', dragons });

    const nameInput = await screen.findByLabelText('Nome');
    await user.clear(nameInput);
    await user.type(nameInput, 'Banguela');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    const dialog = within(await screen.findByRole('dialog'));
    await user.click(dialog.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Ficha de registro')).toBeInTheDocument();
    expect(dragons.seed[0]?.name).toBe('Banguela');
  });

  it('descarta a gravacao ao cancelar a confirmacao', async () => {
    const dragons = createInMemoryDragonRepository([DRAGON]);
    const update = vi.spyOn(dragons, 'update');
    const { user } = renderApp({ route: '/dragons/7/edit', dragons });

    const nameInput = await screen.findByLabelText('Nome');
    await user.clear(nameInput);
    await user.type(nameInput, 'Banguela');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    const dialog = within(await screen.findByRole('dialog'));
    await user.click(dialog.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nome')).toHaveValue('Banguela');
  });

  it('avisa quando o registro a editar nao existe', async () => {
    renderApp({ route: '/dragons/999/edit', dragons: createInMemoryDragonRepository([DRAGON]) });

    expect(await screen.findByText('Dragão não encontrado')).toBeInTheDocument();
  });
});

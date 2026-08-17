import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { THEME_STORAGE_KEY } from '@/app/theme/themeContext';
import { authenticate } from '@/test/authenticate';
import { renderApp } from '@/test/renderApp';

const TRIGGER = 'Conta de catalogador';

describe('menu de conta', () => {
  beforeEach(() => {
    authenticate();
  });

  it('comeca fechado e anuncia o estado', async () => {
    renderApp();

    const trigger = await screen.findByRole('button', { name: TRIGGER });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('abre com as tres acoes da conta', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('button', { name: TRIGGER }));

    const menu = screen.getByRole('menu');

    expect(screen.getByRole('button', { name: TRIGGER })).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Tema escuro' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Configurações' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sair' })).toBeInTheDocument();
  });

  it('alterna o tema e fecha o menu', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('button', { name: TRIGGER }));
    await user.click(screen.getByRole('menuitem', { name: 'Tema escuro' }));

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(screen.getByRole('button', { name: TRIGGER }));

    expect(screen.getByRole('menuitem', { name: 'Tema claro' })).toBeInTheDocument();
  });

  it('leva para as configuracoes', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('button', { name: TRIGGER }));
    await user.click(screen.getByRole('menuitem', { name: 'Configurações' }));

    expect(await screen.findByText('Configurações')).toBeInTheDocument();
  });

  it('fecha ao pressionar Escape', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('button', { name: TRIGGER }));
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('fecha ao clicar fora', async () => {
    const { user } = renderApp();

    await user.click(await screen.findByRole('button', { name: TRIGGER }));
    await user.click(screen.getByRole('heading', { name: 'Meus dragões' }));

    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});

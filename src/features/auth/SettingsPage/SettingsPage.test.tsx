import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { THEME_STORAGE_KEY } from '@/app/theme/themeContext';
import { authenticate } from '@/test/authenticate';
import { renderApp } from '@/test/renderApp';

const CURRENT_PASSWORD = 'segredo123';

function renderSettings() {
  authenticate();
  return renderApp({ route: '/settings' });
}

async function fillPasswordForm(
  user: UserEvent,
  { current, next, confirm }: { current: string; next: string; confirm: string },
) {
  await user.type(await screen.findByLabelText('Senha atual'), current);
  await user.type(screen.getByLabelText('Nova senha'), next);
  await user.type(screen.getByLabelText('Confirmar nova senha'), confirm);
  await user.click(screen.getByRole('button', { name: 'Alterar senha' }));
}

function storedPassword(): string | undefined {
  const [user] = JSON.parse(localStorage.getItem('dragons:users') ?? '[]');
  return user?.password;
}

describe('configuracoes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exige sessao ativa', async () => {
    renderApp({ route: '/settings' });

    expect(await screen.findByRole('tab', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('alterna o tema pelo interruptor', async () => {
    const { user } = renderSettings();

    const themeSwitch = await screen.findByRole('switch', { name: 'Tema escuro' });

    expect(themeSwitch).toHaveAttribute('aria-checked', 'false');

    await user.click(themeSwitch);

    expect(themeSwitch).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('altera a senha e passa a aceitar a nova', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, {
      current: CURRENT_PASSWORD,
      next: 'novaSenha1',
      confirm: 'novaSenha1',
    });

    await waitFor(() => expect(storedPassword()).toBe('novaSenha1'));
  });

  it('limpa os campos apos alterar', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, {
      current: CURRENT_PASSWORD,
      next: 'novaSenha1',
      confirm: 'novaSenha1',
    });

    await waitFor(() => expect(screen.getByLabelText('Senha atual')).toHaveValue(''));
    expect(screen.getByLabelText('Nova senha')).toHaveValue('');
  });

  it('recusa senha atual errada sem trocar nada', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, {
      current: 'chute',
      next: 'novaSenha1',
      confirm: 'novaSenha1',
    });

    expect(await screen.findByRole('alert')).toHaveTextContent('A senha atual não confere.');
    expect(storedPassword()).toBe(CURRENT_PASSWORD);
  });

  it('exige confirmacao coincidente', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, {
      current: CURRENT_PASSWORD,
      next: 'novaSenha1',
      confirm: 'outraCoisa1',
    });

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(storedPassword()).toBe(CURRENT_PASSWORD);
  });

  it('exige tamanho minimo na nova senha', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, { current: CURRENT_PASSWORD, next: '123', confirm: '123' });

    expect(
      await screen.findByText('A senha precisa de ao menos 6 caracteres.'),
    ).toBeInTheDocument();
    expect(storedPassword()).toBe(CURRENT_PASSWORD);
  });

  it('recusa repetir a senha que ja estava em uso', async () => {
    const { user } = renderSettings();

    await fillPasswordForm(user, {
      current: CURRENT_PASSWORD,
      next: CURRENT_PASSWORD,
      confirm: CURRENT_PASSWORD,
    });

    expect(
      await screen.findByText('A nova senha precisa ser diferente da atual.'),
    ).toBeInTheDocument();
  });
});

import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createAuthService } from '@/features/auth/authService';
import { createUserStore } from '@/features/auth/userStore';
import { renderApp } from '@/test/renderApp';

const CREDENTIALS = { username: 'catalogador', password: 'segredo123' };

function registerUser() {
  createAuthService(createUserStore()).signUp(CREDENTIALS);
  createAuthService(createUserStore()).signOut();
}

describe('acesso', () => {
  it('leva para o login ao abrir uma rota protegida sem sessao', async () => {
    renderApp({ route: '/dragons' });

    expect(await screen.findByRole('tab', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.queryByText('Meus dragões')).not.toBeInTheDocument();
  });

  it.each(['/dragons/new', '/dragons/1', '/dragons/1/edit'])(
    'protege a rota %s',
    async (route) => {
      renderApp({ route });

      expect(await screen.findByRole('tab', { name: 'Entrar' })).toBeInTheDocument();
    },
  );

  it('cadastra e entra no indice', async () => {
    const { user } = renderApp({ route: '/login' });

    await user.click(await screen.findByRole('tab', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), CREDENTIALS.password);
    await user.type(screen.getByLabelText('Confirmar senha'), CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Meus dragões')).toBeInTheDocument();
  });

  it('exige confirmacao de senha coincidente', async () => {
    const { user } = renderApp({ route: '/login' });

    await user.click(await screen.findByRole('tab', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), CREDENTIALS.password);
    await user.type(screen.getByLabelText('Confirmar senha'), 'outra-coisa');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(screen.queryByText('Meus dragões')).not.toBeInTheDocument();
  });

  it('exige tamanho minimo de usuario e senha', async () => {
    const { user } = renderApp({ route: '/login' });

    await user.click(await screen.findByRole('tab', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Usuário'), 'ab');
    await user.type(screen.getByLabelText('Senha'), '123');
    await user.type(screen.getByLabelText('Confirmar senha'), '123');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(
      await screen.findByText('O usuário precisa de ao menos 3 caracteres.'),
    ).toBeInTheDocument();
    expect(screen.getByText('A senha precisa de ao menos 6 caracteres.')).toBeInTheDocument();
  });

  it('avisa quando o usuario ja existe', async () => {
    registerUser();
    const { user } = renderApp({ route: '/login' });

    await user.click(await screen.findByRole('tab', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), CREDENTIALS.password);
    await user.type(screen.getByLabelText('Confirmar senha'), CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Esse nome de usuário já está em uso.',
    );
  });

  it('entra com as credenciais cadastradas', async () => {
    registerUser();
    const { user } = renderApp({ route: '/login' });

    await user.type(await screen.findByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Meus dragões')).toBeInTheDocument();
  });

  it('recusa senha errada sem revelar se o usuario existe', async () => {
    registerUser();
    const { user } = renderApp({ route: '/login' });

    await user.type(await screen.findByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Usuário ou senha inválidos.');
    expect(screen.queryByText('Meus dragões')).not.toBeInTheDocument();
  });

  it('mantem a sessao ao remontar a aplicacao', async () => {
    createAuthService(createUserStore()).signUp(CREDENTIALS);

    renderApp({ route: '/dragons' });

    expect(await screen.findByText('Meus dragões')).toBeInTheDocument();
  });

  it('redireciona para o indice quem ja tem sessao e abre o login', async () => {
    createAuthService(createUserStore()).signUp(CREDENTIALS);

    renderApp({ route: '/login' });

    expect(await screen.findByText('Meus dragões')).toBeInTheDocument();
  });

  it('encerra a sessao e volta para o login', async () => {
    createAuthService(createUserStore()).signUp(CREDENTIALS);
    const { user } = renderApp({ route: '/dragons' });

    await user.click(await screen.findByRole('button', { name: 'Conta de catalogador' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sair' }));

    await waitFor(() => expect(screen.getByRole('tab', { name: 'Entrar' })).toBeInTheDocument());
    expect(localStorage.getItem('dragons:session')).toBeNull();
  });

  it('limpa o aviso de falha ao trocar de aba', async () => {
    registerUser();
    const { user } = renderApp({ route: '/login' });

    await user.type(await screen.findByLabelText('Usuário'), CREDENTIALS.username);
    await user.type(screen.getByLabelText('Senha'), 'errada');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Criar conta' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('exibe o nome do usuario autenticado', async () => {
    createAuthService(createUserStore()).signUp(CREDENTIALS);

    renderApp({ route: '/dragons' });

    expect(await screen.findByText('catalogador')).toBeInTheDocument();
  });
});

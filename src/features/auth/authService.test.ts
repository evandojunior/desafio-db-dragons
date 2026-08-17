import { beforeEach, describe, expect, it } from 'vitest';

import { AuthError } from './AuthError';
import { createAuthService } from './authService';
import { createUserStore } from './userStore';

const CREDENTIALS = { username: 'catalogador', password: 'segredo123' };

function createService() {
  return createAuthService(createUserStore());
}

function messageOf(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    return (error as AuthError).message;
  }

  throw new Error('Esperava uma falha de autenticação.');
}

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('abre a sessao ao concluir o cadastro', () => {
    const session = createService().signUp(CREDENTIALS);

    expect(session.username).toBe('catalogador');
    expect(session.userId).toBeTruthy();
  });

  it('recusa cadastro com usuario ja existente ignorando a caixa', () => {
    const service = createService();
    service.signUp(CREDENTIALS);

    expect(() => service.signUp({ ...CREDENTIALS, username: 'CATALOGADOR' })).toThrow(AuthError);
  });

  it('autentica com as credenciais cadastradas', () => {
    const service = createService();
    service.signUp(CREDENTIALS);
    service.signOut();

    expect(service.signIn(CREDENTIALS)).toMatchObject({ username: 'catalogador' });
  });

  it('usa a mesma mensagem para senha errada e usuario inexistente', () => {
    const service = createService();
    service.signUp(CREDENTIALS);

    const wrongPassword = messageOf(() => service.signIn({ ...CREDENTIALS, password: 'errada' }));
    const unknownUser = messageOf(() =>
      service.signIn({ username: 'fantasma', password: 'segredo123' }),
    );

    expect(wrongPassword).toBe(unknownUser);
  });

  it('restaura a sessao gravada e a limpa ao sair', () => {
    const service = createService();
    service.signUp(CREDENTIALS);

    expect(service.restoreSession()).toMatchObject({ username: 'catalogador' });

    service.signOut();

    expect(service.restoreSession()).toBeNull();
  });

  it('mantem a sessao sem expor a senha do usuario', () => {
    createService().signUp(CREDENTIALS);

    expect(localStorage.getItem('dragons:session')).not.toContain('segredo123');
  });

  it('ignora armazenamento corrompido em vez de quebrar', () => {
    localStorage.setItem('dragons:session', '{corrompido');

    expect(createService().restoreSession()).toBeNull();
  });
});

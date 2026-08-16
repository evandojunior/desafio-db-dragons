export type AuthErrorCode =
  | 'username-taken'
  | 'invalid-credentials'
  | 'wrong-password'
  | 'session-expired';

const MESSAGE_BY_CODE: Record<AuthErrorCode, string> = {
  'username-taken': 'Esse nome de usuário já está em uso.',
  'invalid-credentials': 'Usuário ou senha inválidos.',
  'wrong-password': 'A senha atual não confere.',
  'session-expired': 'Sua sessão não é mais válida. Entre de novo.',
};

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(MESSAGE_BY_CODE[code]);
    this.name = 'AuthError';
    this.code = code;
  }
}

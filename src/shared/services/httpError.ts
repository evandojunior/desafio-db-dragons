export type HttpErrorKind = 'timeout' | 'network' | 'client' | 'server' | 'parse';

const MESSAGE_BY_KIND: Record<HttpErrorKind, string> = {
  timeout: 'A requisição demorou demais para responder. Tente novamente.',
  network: 'Não foi possível falar com o servidor. Verifique sua conexão.',
  client: 'Não foi possível concluir a operação.',
  server: 'O servidor não conseguiu responder agora. Tente de novo em instantes.',
  parse: 'O servidor devolveu uma resposta em formato inesperado.',
};

export class HttpError extends Error {
  readonly kind: HttpErrorKind;

  readonly status: number | null;

  constructor(kind: HttpErrorKind, status: number | null = null, message?: string) {
    super(message ?? MESSAGE_BY_KIND[kind]);
    this.name = 'HttpError';
    this.kind = kind;
    this.status = status;
  }

  static fromStatus(status: number): HttpError {
    if (status === 404) {
      return new HttpError('client', status, 'Registro não encontrado.');
    }

    return status >= 500
      ? new HttpError('server', status)
      : new HttpError('client', status);
  }
}

export function isNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}

export function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  return error instanceof Error && error.message ? error.message : fallback;
}

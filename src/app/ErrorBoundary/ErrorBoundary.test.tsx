import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '.';

function Explode({ message }: { message: string }): never {
  throw new Error(message);
}

describe('barreira de erro', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deixa passar o conteudo quando nada falha', () => {
    render(
      <ErrorBoundary>
        <p>catálogo</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText('catálogo')).toBeInTheDocument();
  });

  it('explica a conexao quando o trecho da tela nao pode ser baixado', () => {
    render(
      <ErrorBoundary>
        <Explode message="Failed to fetch dynamically imported module: /assets/EditDragonPage.js" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Esta tela não pôde ser carregada')).toBeInTheDocument();
    expect(screen.getByText(/Recarregue quando estiver online/)).toBeInTheDocument();
  });

  it('reporta falha inesperada com outra mensagem', () => {
    render(
      <ErrorBoundary>
        <Explode message="Cannot read properties of undefined" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo quebrou ao montar esta tela')).toBeInTheDocument();
  });

  it('oferece recarregar a pagina', () => {
    render(
      <ErrorBoundary>
        <Explode message="qualquer falha" />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('button', { name: 'Recarregar' })).toBeInTheDocument();
  });

  it('registra a falha no console para diagnostico', () => {
    render(
      <ErrorBoundary>
        <Explode message="qualquer falha" />
      </ErrorBoundary>,
    );

    expect(console.error).toHaveBeenCalledWith(
      'Falha não tratada na interface',
      expect.any(Error),
      expect.any(String),
    );
  });
});

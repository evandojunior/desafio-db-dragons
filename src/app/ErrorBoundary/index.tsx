import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/shared/components/Button';
import { StateMessage } from '@/shared/components/StateMessage';

import styles from './ErrorBoundary.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  failure: Error | null;
}

function isChunkLoadFailure(error: Error): boolean {
  return /dynamically imported module|Loading chunk|Importing a module script failed/i.test(
    error.message,
  );
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failure: null };

  static getDerivedStateFromError(failure: Error): ErrorBoundaryState {
    return { failure };
  }

  componentDidCatch(failure: Error, info: ErrorInfo) {
    console.error('Falha não tratada na interface', failure, info.componentStack);
  }

  render() {
    const { failure } = this.state;

    if (!failure) {
      return this.props.children;
    }

    const offline = isChunkLoadFailure(failure);

    return (
      <main className={styles.page}>
        <StateMessage
          tone="danger"
          eyebrow={offline ? 'Conexão indisponível' : 'Falha inesperada'}
          title={
            offline ? 'Esta tela não pôde ser carregada' : 'Algo quebrou ao montar esta tela'
          }
          description={
            offline
              ? 'Parte da aplicação ainda não tinha sido baixada e a conexão caiu antes. Recarregue quando estiver online.'
              : 'Recarregue a página. Se continuar acontecendo, o erro está registrado no console do navegador.'
          }
          action={<Button onClick={() => window.location.reload()}>Recarregar</Button>}
        />
      </main>
    );
  }
}

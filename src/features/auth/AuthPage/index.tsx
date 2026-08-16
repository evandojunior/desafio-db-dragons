import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert } from '@/shared/components/Alert';
import { AppFooter } from '@/app/layout/AppFooter';
import { useToast } from '@/shared/components/Toast/useToast';
import { classNames } from '@/shared/utils';

import { AuthError } from '../AuthError';
import { SignInForm } from '../SignInForm';
import { SignUpForm } from '../SignUpForm';
import type { SignInValues, SignUpValues } from '../schemas';
import { useAuth } from '../useAuth';

import styles from './AuthPage.module.scss';

type AuthMode = 'sign-in' | 'sign-up';

const DESCRIPTION_BY_MODE: Record<AuthMode, string> = {
  'sign-in': 'Entre e acesse seus registros.',
  'sign-up': 'Crie uma conta para começar.',
};

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [failure, setFailure] = useState<string | null>(null);

  const handleFailure = useCallback(
    (error: unknown) => {
      const message =
        error instanceof AuthError ? error.message : 'Tente novamente em instantes.';

      setFailure(message);
      toast.error(message);
    },
    [toast],
  );

  const changeMode = useCallback((next: AuthMode) => {
    setMode(next);
    setFailure(null);
  }, []);

  const handleSignIn = useCallback(
    async (values: SignInValues) => {
      try {
        signIn(values);
        toast.success('Bem-vindo de volta.');
        navigate('/dragons', { replace: true });
      } catch (error) {
        handleFailure(error);
      }
    },
    [signIn, navigate, toast, handleFailure],
  );

  const handleSignUp = useCallback(
    async (values: SignUpValues) => {
      try {
        signUp(values);
        toast.success('Sua conta foi criada com sucesso.');
        navigate('/dragons', { replace: true });
      } catch (error) {
        handleFailure(error);
      }
    },
    [signUp, navigate, toast, handleFailure],
  );

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <header className={styles.brand}>
          <h1 className={styles.title}>My Dragons</h1>
          <p className={styles.description}>{DESCRIPTION_BY_MODE[mode]}</p>
        </header>

        <div className={styles.tabs} role="tablist" aria-label="Formas de acesso">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-in'}
            className={classNames(styles.tab, mode === 'sign-in' && styles.tabActive)}
            onClick={() => changeMode('sign-in')}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-up'}
            className={classNames(styles.tab, mode === 'sign-up' && styles.tabActive)}
            onClick={() => changeMode('sign-up')}
          >
            Criar conta
          </button>
        </div>

        {failure && <Alert tone="danger" title="Ocorreu algum problema" description={failure} />}

        {mode === 'sign-in' ? (
          <SignInForm onSubmit={handleSignIn} />
        ) : (
          <SignUpForm onSubmit={handleSignUp} />
        )}
      </section>

      <AppFooter />
    </main>
  );
}

import { useState } from 'react';

import { useTheme } from '@/app/theme/useTheme';
import { Alert } from '@/shared/components/Alert';
import { PageHeader } from '@/shared/components/PageHeader';
import { useToast } from '@/shared/components/Toast/useToast';

import { AuthError } from '../AuthError';
import { PasswordForm } from '../PasswordForm';
import type { PasswordChangeValues } from '../schemas';
import { useAuth } from '../useAuth';

import styles from './SettingsPage.module.scss';

export function SettingsPage() {
  const { session, changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const [failure, setFailure] = useState<string | null>(null);

  if (!session) {
    return null;
  }

  function report(error: unknown) {
    const message = error instanceof AuthError ? error.message : 'Tente novamente em instantes.';

    setFailure(message);
    toast.error(message);
  }


  async function handlePassword({ currentPassword, newPassword }: PasswordChangeValues) {
    try {
      setFailure(null);
      changePassword(currentPassword, newPassword);
      toast.success('Senha alterada.');
    } catch (error) {
      report(error);
    }
  }

  return (
    <>
      <PageHeader eyebrow="Conta" title="Configurações" />

      {failure && (
        <div className={styles.alert}>
          <Alert tone="danger" title="Ocorreu algum problema" description={failure} />
        </div>
      )}

      <div className={styles.sections}>
        <section className={styles.section}>
          <div className={styles.intro}>
            <h2 className={styles.title}>Aparência</h2>
          </div>

          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>
              {theme === 'light' ? 'Tema claro' : 'Tema escuro'}
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="Tema escuro"
              className={styles.switch}
              onClick={toggleTheme}
            >
              <span className={styles.knob} aria-hidden="true" />
            </button>
          </div>
        </section>


        <section className={styles.section}>
          <div className={styles.intro}>
            <h2 className={styles.title}>Senha</h2>
            <p className={styles.description}>
              Confirme a senha atual para definir uma nova.
            </p>
          </div>

          <PasswordForm onSubmit={handlePassword} />
        </section>
      </div>
    </>
  );
}

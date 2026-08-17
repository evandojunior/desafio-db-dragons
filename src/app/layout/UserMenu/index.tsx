import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@/app/theme/useTheme';
import { useAuth } from '@/features/auth/useAuth';
import { useToast } from '@/shared/components/Toast/useToast';

import styles from './UserMenu.module.scss';

export function UserMenu() {
  const { session, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!session) {
    return null;
  }

  function goToSettings() {
    setIsOpen(false);
    navigate('/settings');
  }

  function switchTheme() {
    toggleTheme();
    setIsOpen(false);
  }

  function handleSignOut() {
    setIsOpen(false);
    signOut();
    toast.info('Sessão encerrada.');
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Conta de ${session.username}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.initial} aria-hidden="true">
          {session.username.charAt(0).toLocaleUpperCase('pt-BR')}
        </span>
        <span className={styles.username}>{session.username}</span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu" aria-label="Conta">
          <button type="button" role="menuitem" className={styles.item} onClick={switchTheme}>
            {theme === 'light' ? 'Tema escuro' : 'Tema claro'}
          </button>

          <button type="button" role="menuitem" className={styles.item} onClick={goToSettings}>
            Configurações
          </button>

          <button
            type="button"
            role="menuitem"
            className={styles.itemDanger}
            onClick={handleSignOut}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

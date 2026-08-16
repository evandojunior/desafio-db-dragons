import { useCallback, useMemo, useState, type ReactNode } from 'react';

import type { Credentials, Session } from '@/shared/types';

import { AuthError } from './AuthError';
import { AuthContext } from './authContext';
import { createAuthService, type AuthService } from './authService';

interface AuthProviderProps {
  children: ReactNode;
  authService?: AuthService;
}

export function AuthProvider({ children, authService }: AuthProviderProps) {
  const service = useMemo(() => authService ?? createAuthService(), [authService]);
  const [session, setSession] = useState<Session | null>(() => service.restoreSession());

  const signUp = useCallback(
    (credentials: Credentials) => {
      setSession(service.signUp(credentials));
    },
    [service],
  );

  const signIn = useCallback(
    (credentials: Credentials) => {
      setSession(service.signIn(credentials));
    },
    [service],
  );

  const signOut = useCallback(() => {
    service.signOut();
    setSession(null);
  }, [service]);

  const requireSession = useCallback(() => {
    if (!session) {
      throw new AuthError('session-expired');
    }

    return session;
  }, [session]);

  const changePassword = useCallback(
    (currentPassword: string, newPassword: string) => {
      service.changePassword(requireSession().userId, currentPassword, newPassword);
    },
    [service, requireSession],
  );

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      signUp,
      signIn,
      signOut,
      changePassword,
    }),
    [session, signUp, signIn, signOut, changePassword],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

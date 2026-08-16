import { createContext } from 'react';

import type { Credentials, Session } from '@/shared/types';

export interface AuthContextValue {
  session: Session | null;
  isAuthenticated: boolean;
  signUp: (credentials: Credentials) => void;
  signIn: (credentials: Credentials) => void;
  signOut: () => void;
  changePassword: (currentPassword: string, newPassword: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

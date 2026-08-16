import { use } from 'react';

import { AuthContext, type AuthContextValue } from './authContext';

export function useAuth(): AuthContextValue {
  const auth = use(AuthContext);

  if (!auth) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  }

  return auth;
}

import { createAuthService } from '@/features/auth/authService';
import { createUserStore } from '@/features/auth/userStore';

export function authenticate(username = 'catalogador') {
  return createAuthService(createUserStore()).signUp({ username, password: 'segredo123' });
}

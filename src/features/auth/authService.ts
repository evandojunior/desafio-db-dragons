import type { Credentials, Session, StoredUser } from '@/shared/types';
import { createId } from '@/shared/utils';

import { AuthError } from './AuthError';
import { createUserStore, type UserStore } from './userStore';

export interface AuthService {
  signUp(credentials: Credentials): Session;
  signIn(credentials: Credentials): Session;
  signOut(): void;
  restoreSession(): Session | null;
  changePassword(userId: string, currentPassword: string, newPassword: string): void;
}

function toSession({ id, username }: StoredUser): Session {
  return { userId: id, username };
}

export function createAuthService(store: UserStore = createUserStore()): AuthService {
  return {
    signUp({ username, password }) {
      const trimmedUsername = username.trim();

      if (store.findByUsername(trimmedUsername)) {
        throw new AuthError('username-taken');
      }

      const user: StoredUser = {
        id: createId(),
        username: trimmedUsername,
        password,
        createdAt: new Date().toISOString(),
      };

      store.save(user);

      const session = toSession(user);
      store.writeSession(session);

      return session;
    },

    signIn({ username, password }) {
      const user = store.findByUsername(username);

      if (!user || user.password !== password) {
        throw new AuthError('invalid-credentials');
      }

      const session = toSession(user);
      store.writeSession(session);

      return session;
    },

    signOut() {
      store.clearSession();
    },

    restoreSession() {
      return store.readSession();
    },

    changePassword(userId, currentPassword, newPassword) {
      const user = requireUser(store, userId);

      if (user.password !== currentPassword) {
        throw new AuthError('wrong-password');
      }

      store.replace({ ...user, password: newPassword });
    },
  };
}

function requireUser(store: UserStore, userId: string): StoredUser {
  const user = store.findById(userId);

  if (!user) {
    throw new AuthError('session-expired');
  }

  return user;
}

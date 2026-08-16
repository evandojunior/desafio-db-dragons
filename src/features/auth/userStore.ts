import { createJsonStorage, type JsonStorage } from '@/shared/services/jsonStorage';
import type { Session, StoredUser } from '@/shared/types';

const USERS_KEY = 'dragons:users';
const SESSION_KEY = 'dragons:session';

export interface UserStore {
  findByUsername(username: string): StoredUser | undefined;
  findById(id: string): StoredUser | undefined;
  save(user: StoredUser): void;
  replace(user: StoredUser): void;
  readSession(): Session | null;
  writeSession(session: Session): void;
  clearSession(): void;
}

function normalize(username: string): string {
  return username.trim().toLocaleLowerCase('pt-BR');
}

export function createUserStore(storage: JsonStorage = createJsonStorage()): UserStore {
  function readUsers(): StoredUser[] {
    return storage.read<StoredUser[]>(USERS_KEY, []);
  }

  return {
    findByUsername(username) {
      return readUsers().find((user) => normalize(user.username) === normalize(username));
    },

    findById(id) {
      return readUsers().find((user) => user.id === id);
    },

    save(user) {
      storage.write(USERS_KEY, [...readUsers(), user]);
    },

    replace(user) {
      storage.write(
        USERS_KEY,
        readUsers().map((current) => (current.id === user.id ? user : current)),
      );
    },

    readSession() {
      return storage.read<Session | null>(SESSION_KEY, null);
    },

    writeSession(session) {
      storage.write(SESSION_KEY, session);
    },

    clearSession() {
      storage.remove(SESSION_KEY);
    },
  };
}

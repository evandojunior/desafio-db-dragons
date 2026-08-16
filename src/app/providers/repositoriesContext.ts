import { createContext } from 'react';

import type { DragonRepository } from '@/shared/repositories/DragonRepository';

export interface Repositories {
  dragons: DragonRepository;
}

export const RepositoriesContext = createContext<Repositories | null>(null);

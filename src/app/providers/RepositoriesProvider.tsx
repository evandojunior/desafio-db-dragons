import { useMemo, type ReactNode } from 'react';

import { env } from '@/shared/config/env';
import { createHttpDragonRepository } from '@/shared/repositories/HttpDragonRepository';
import { createHttpClient } from '@/shared/services/httpClient';

import { RepositoriesContext, type Repositories } from './repositoriesContext';

interface RepositoriesProviderProps {
  children: ReactNode;
  repositories?: Repositories;
}

function createDefaultRepositories(): Repositories {
  return {
    dragons: createHttpDragonRepository(createHttpClient({ baseUrl: env.apiBaseUrl })),
  };
}

export function RepositoriesProvider({ children, repositories }: RepositoriesProviderProps) {
  const value = useMemo(() => repositories ?? createDefaultRepositories(), [repositories]);

  return <RepositoriesContext value={value}>{children}</RepositoriesContext>;
}

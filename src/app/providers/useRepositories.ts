import { use } from 'react';

import { RepositoriesContext, type Repositories } from './repositoriesContext';

export function useRepositories(): Repositories {
  const repositories = use(RepositoriesContext);

  if (!repositories) {
    throw new Error('useRepositories precisa estar dentro de <RepositoriesProvider>.');
  }

  return repositories;
}

export function useDragonRepository() {
  return useRepositories().dragons;
}

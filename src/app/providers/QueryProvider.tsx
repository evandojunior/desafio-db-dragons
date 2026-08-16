import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useState, type ReactNode } from 'react';

const STALE_TIME_MS = 30_000;
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'dragons:query-cache';

interface QueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        gcTime: CACHE_MAX_AGE_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

export function QueryProvider({ children, client }: QueryProviderProps) {
  const [queryClient] = useState(() => client ?? createQueryClient());
  const [persister] = useState(() =>
    createSyncStoragePersister({ storage: window.localStorage, key: CACHE_KEY }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: CACHE_MAX_AGE_MS }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

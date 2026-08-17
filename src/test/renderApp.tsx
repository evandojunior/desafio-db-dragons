import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { RepositoriesProvider } from '@/app/providers/RepositoriesProvider';
import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { AppRoutes } from '@/app/routes';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ToastProvider } from '@/shared/components/Toast/ToastProvider';
import type { DragonRepository } from '@/shared/repositories/DragonRepository';

import { createInMemoryDragonRepository } from './inMemoryDragonRepository';

interface RenderAppOptions {
  route?: string;
  dragons?: DragonRepository;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export { createTestQueryClient };

export function renderApp({
  route = '/dragons',
  dragons = createInMemoryDragonRepository(),
  queryClient = createTestQueryClient(),
}: RenderAppOptions = {}) {
  const user = userEvent.setup();

  const view = render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RepositoriesProvider repositories={{ dragons }}>
          <ToastProvider>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </ToastProvider>
        </RepositoriesProvider>
      </QueryClientProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

  return { ...view, user, dragons, queryClient };
}

import { BrowserRouter } from 'react-router-dom';

import { ErrorBoundary } from '@/app/ErrorBoundary';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { RepositoriesProvider } from '@/app/providers/RepositoriesProvider';
import { AppRoutes } from '@/app/routes';
import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ToastProvider } from '@/shared/components/Toast/ToastProvider';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <QueryProvider>
          <RepositoriesProvider>
            <ToastProvider>
              <AuthProvider>
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </AuthProvider>
            </ToastProvider>
          </RepositoriesProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

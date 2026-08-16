import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/layout/AppLayout';
import { LoadingIndicator } from '@/shared/components/LoadingIndicator';

import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

const AuthPage = lazy(() =>
  import('@/features/auth/AuthPage').then((module) => ({ default: module.AuthPage })),
);
const SettingsPage = lazy(() =>
  import('@/features/auth/SettingsPage').then((module) => ({ default: module.SettingsPage })),
);
const DragonListPage = lazy(() =>
  import('@/features/dragons/DragonListPage').then((module) => ({
    default: module.DragonListPage,
  })),
);
const NewDragonPage = lazy(() =>
  import('@/features/dragons/NewDragonPage').then((module) => ({ default: module.NewDragonPage })),
);
const EditDragonPage = lazy(() =>
  import('@/features/dragons/EditDragonPage').then((module) => ({
    default: module.EditDragonPage,
  })),
);
const DragonDetailPage = lazy(() =>
  import('@/features/dragons/DragonDetailPage').then((module) => ({
    default: module.DragonDetailPage,
  })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dragons" element={<DragonListPage />} />
            <Route path="/dragons/new" element={<NewDragonPage />} />
            <Route path="/dragons/:id" element={<DragonDetailPage />} />
            <Route path="/dragons/:id/edit" element={<EditDragonPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dragons" replace />} />
      </Routes>
    </Suspense>
  );
}

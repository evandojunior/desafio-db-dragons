import { use } from 'react';

import { ToastContext } from './toastContext';
import type { ToastApi } from './types';

export function useToast(): ToastApi {
  const toast = use(ToastContext);

  if (!toast) {
    throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  }

  return toast;
}

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { createId } from '@/shared/utils';

import { ToastViewport } from './ToastViewport';
import { ToastContext } from './toastContext';
import type { Toast, ToastTone } from './types';

const AUTO_DISMISS_MS = 4500;

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = createId();

      setToasts((current) => [...current, { id, tone, message }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const api = useMemo(
    () => ({
      success: (message: string) => push('success', message),
      error: (message: string) => push('error', message),
      warning: (message: string) => push('warning', message),
      info: (message: string) => push('info', message),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}

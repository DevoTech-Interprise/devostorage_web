import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';
type Toast = { id: string; type: ToastType; message: string };

interface ToastContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const push = useCallback((type: ToastType, message: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    const t: Toast = { id, type, message };
    setToasts(s => [t, ...s]);
    setTimeout(() => remove(id), 4500);
  }, [remove]);

  const value: ToastContextValue = {
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
    info: (m: string) => push('info', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col-reverse gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-sm text-white ${
              t.type === 'success' ? 'bg-green-600 dark:bg-green-500' : t.type === 'error' ? 'bg-red-600 dark:bg-red-500' : 'bg-indigo-600 dark:bg-indigo-500'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export default ToastContext;

import { CheckCircle2, X, XCircle } from 'lucide-react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type: 'success', ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] grid w-[min(420px,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => {
          const Icon = toast.type === 'error' ? XCircle : CheckCircle2;
          return (
            <div
              key={toast.id}
              className="animate-scale-in flex items-start gap-3 rounded-lg border border-white/10 bg-zinc-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur"
            >
              <Icon className={toast.type === 'error' ? 'text-rose-300' : 'text-emerald-300'} size={20} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                {toast.description && <p className="mt-1 text-sm text-zinc-400">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
                className="text-zinc-500 transition-colors hover:text-white"
                aria-label="Fechar notificacao"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast precisa estar dentro de ToastProvider.');
  }
  return context;
}

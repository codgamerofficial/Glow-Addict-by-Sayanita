'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, ReactNode> = {
  success: <Check size={18} />,
  error: <X size={18} />,
  info: <Info size={18} />,
};

const colors: Record<ToastType, string> = {
  success: 'rgba(16,185,129,0.9)',
  error: 'rgba(239,68,68,0.9)',
  info: 'rgba(124,58,237,0.9)',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-[90%] max-w-[400px]">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="backdrop-blur-[20px] rounded-[14px] p-3.5 px-5 flex items-center gap-2.5 text-white text-sm font-medium shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto"
              style={{ background: colors[toast.type] }}
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                {icons[toast.type]}
              </div>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

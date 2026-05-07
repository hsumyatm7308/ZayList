import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[110] w-[calc(100%-48px)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                variant === 'danger' ? 'bg-red-50 text-red-500' : 
                variant === 'warning' ? 'bg-amber-50 text-amber-500' : 
                'bg-green-50 text-green-500'
              }`}>
                <AlertTriangle className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-black">{title}</h2>
              <p className="mt-2 text-sm font-medium text-black/40 leading-relaxed">
                {message}
              </p>

              <div className="mt-8 flex w-full flex-col gap-3">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`h-14 w-full rounded-2xl font-bold uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                    variant === 'danger' ? 'bg-red-500 shadow-red-200' : 
                    variant === 'warning' ? 'bg-amber-500 shadow-amber-200' : 
                    'bg-black shadow-black/10'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="h-14 w-full rounded-2xl bg-black/5 font-bold uppercase tracking-widest text-black/40 transition-all hover:bg-black/10 active:scale-95"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

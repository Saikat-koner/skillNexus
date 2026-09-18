import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  RotateCcw,
  Sparkles,
  Flame
} from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'chain';
  duration?: number;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastSystemProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastSingleCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastSingleCard: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 4500;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'chain':
        return <Flame className="h-5 w-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-indigo-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-white/95';
      case 'error':
        return 'border-rose-200 bg-white/95';
      case 'chain':
        return 'border-amber-200 bg-white/95';
      default:
        return 'border-indigo-200 bg-white/95';
    }
  };

  const getBarColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-500';
      case 'error':
        return 'bg-rose-500';
      case 'chain':
        return 'bg-amber-500';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md p-4 transition-all duration-300 animate-slide-up ${getBorderColor()}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {getIcon()}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{toast.title}</h4>
            <p className="mt-0.5 text-xs text-slate-600 leading-relaxed break-words">{toast.message}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                onDismiss(toast.id);
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700 transition-all"
            >
              <RotateCcw className="h-3 w-3 text-slate-600" />
              <span>{toast.undoLabel || 'Undo'}</span>
            </button>
          )}

          <button
            onClick={() => onDismiss(toast.id)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div
          className={`h-full transition-all duration-75 ${getBarColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

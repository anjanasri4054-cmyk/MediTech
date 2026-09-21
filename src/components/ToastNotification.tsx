import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useRxBridge } from '../context/RxBridgeContext';

export const ToastNotification: React.FC = () => {
  const { toast, clearToast } = useRxBridge();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`p-3.5 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
          toast.type === 'success'
            ? 'bg-emerald-900 text-white border-emerald-700'
            : toast.type === 'alert'
            ? 'bg-amber-900 text-white border-amber-700'
            : 'bg-slate-900 text-white border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toast.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-teal-400 shrink-0" />}
          <span>{toast.message}</span>
        </div>

        <button
          onClick={clearToast}
          className="p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

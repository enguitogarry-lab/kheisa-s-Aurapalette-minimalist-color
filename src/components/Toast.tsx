import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
  submessage?: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message, submessage }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-10 right-8 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="bg-black text-white border border-black px-4 py-3 shadow-2xl flex items-center gap-3">
        <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-bold text-xs">
          <Check className="w-3.5 h-3.5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider font-mono text-white leading-tight">{message}</p>
          {submessage && <p className="text-[10px] text-[#AAA] font-mono mt-0.5 uppercase tracking-wide">{submessage}</p>}
        </div>
      </div>
    </div>
  );
};

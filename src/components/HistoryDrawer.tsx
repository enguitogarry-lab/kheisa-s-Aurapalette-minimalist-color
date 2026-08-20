import React from 'react';
import { Palette, ColorItem } from '../types/palette';
import { X, History, Trash2, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: Palette[];
  onApplyPalette: (colors: ColorItem[]) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onApplyPalette,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-l border-black h-full flex flex-col justify-between shadow-2xl text-black animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-black" />
            <h2 className="text-base font-black text-black uppercase font-mono tracking-tight">Palette History</h2>
            <span className="text-xs text-[#888] font-mono">({history.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-[#666] hover:text-black hover:bg-[#F5F5F5] transition-colors cursor-pointer text-xs font-bold uppercase flex items-center gap-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-[#F5F5F5] text-[#666] hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Past Palettes */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-[#888] space-y-2">
              <History className="w-8 h-8 mx-auto text-[#AAA] opacity-60" />
              <p className="text-sm font-bold uppercase font-mono">No palettes in history.</p>
              <p className="text-xs">Press Spacebar to generate your first aesthetic theme.</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-[#F5F5F5] border border-[#E5E5E5] p-3 hover:border-black transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-center justify-between text-xs text-[#666]">
                  <span className="font-bold text-black font-mono uppercase">{item.title || `Palette #${history.length - idx}`}</span>
                  <span className="text-[10px] font-mono text-[#888]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                {/* Swatch Mini Strip */}
                <div className="h-10 flex border border-black/20 shadow-inner">
                  {item.colors.map((c) => (
                    <div
                      key={c.id}
                      className="flex-1 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex.toUpperCase()})`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => {
                      onApplyPalette(item.colors);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>Restore Theme</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAFA] border-t border-[#E5E5E5] text-center text-xs font-mono text-[#888] uppercase">
          Session history preserves 30 generated palettes.
        </div>

      </div>
    </div>
  );
};

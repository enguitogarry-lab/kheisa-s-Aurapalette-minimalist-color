import React from 'react';
import { Palette, ColorItem } from '../types/palette';
import { X, Bookmark, Trash2, ArrowRight, Copy } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Palette[];
  onApplyPalette: (colors: ColorItem[]) => void;
  onRemoveFavorite: (id: string) => void;
  onCopy: (text: string, label: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onApplyPalette,
  onRemoveFavorite,
  onCopy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-l border-black h-full flex flex-col justify-between shadow-2xl text-black animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-black fill-black" />
            <h2 className="text-base font-black text-black uppercase font-mono tracking-tight">Saved Favorites</h2>
            <span className="text-xs text-[#888] font-mono">({favorites.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#F5F5F5] text-[#666] hover:text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Saved Favorites */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-16 text-[#888] space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-[#AAA] opacity-60" />
              <p className="text-sm font-bold uppercase font-mono">No saved themes yet.</p>
              <p className="text-xs">Save themes from the Curated Library or generator.</p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="bg-[#F5F5F5] border border-[#E5E5E5] p-3.5 hover:border-black transition-all flex flex-col gap-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-black font-mono uppercase">{item.title}</span>
                  <button
                    onClick={() => onRemoveFavorite(item.id)}
                    className="p-1 text-[#888] hover:text-black transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Swatch Mini Strip */}
                <div className="h-10 flex border border-black/20 shadow-inner">
                  {item.colors.map((c) => (
                    <div
                      key={c.id}
                      className="flex-1"
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.hex.toUpperCase()})`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      const hexes = item.colors.map((c) => c.hex.toUpperCase()).join(', ');
                      onCopy(hexes, `${item.title} Hexes`);
                    }}
                    className="text-xs font-mono font-bold uppercase text-[#666] hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Hexes</span>
                  </button>

                  <button
                    onClick={() => {
                      onApplyPalette(item.colors);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>Use Palette</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAFA] border-t border-[#E5E5E5] text-center text-xs font-mono text-[#888] uppercase">
          Saved themes persist locally in your browser.
        </div>

      </div>
    </div>
  );
};

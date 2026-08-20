import React, { useState } from 'react';
import { Palette, ColorItem } from '../types/palette';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { isLightColor } from '../utils/colorUtils';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  ArrowRight
} from 'lucide-react';

interface CuratedLibraryViewProps {
  favorites: Palette[];
  onToggleFavorite: (palette: Palette) => void;
  onApplyPalette: (colors: ColorItem[]) => void;
  onCopy: (text: string, label: string) => void;
}

const TAG_FILTERS = [
  'All',
  'Minimal',
  'Editorial',
  'Warm',
  'Nordic',
  'Cyberpunk',
  'Dark Mode',
  'Botanical',
  'Bauhaus',
  'Luxury',
  'Pastel',
];

export const CuratedLibraryView: React.FC<CuratedLibraryViewProps> = ({
  favorites,
  onToggleFavorite,
  onApplyPalette,
  onCopy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPalettes = CURATED_PALETTES.filter((p) => {
    const matchesTag = selectedTag === 'All' || p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.colors.some((c) => c.hex.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const handleCopyAll = (palette: Palette) => {
    const text = palette.colors.map((c) => c.hex.toUpperCase()).join(', ');
    onCopy(text, `${palette.title} (All Hexes)`);
    setCopiedId(palette.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5] text-black p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-black" />
              Curated Designer Themes Library
            </h2>
            <p className="text-xs text-[#666] mt-1">
              Explore professionally calibrated palettes across high-end editorial, minimalist SaaS, brutalist, and organic aesthetics.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search aesthetics, tags, or hexes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-mono text-black placeholder-[#888] focus:outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TAG_FILTERS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white border border-[#E5E5E5] text-[#666] hover:text-black hover:border-black'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPalettes.map((palette) => {
            const isFav = favorites.some((f) => f.id === palette.id);
            const isCopied = copiedId === palette.id;

            return (
              <div
                key={palette.id}
                className="bg-white border border-[#E5E5E5] hover:border-black transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Swatch Color Strip */}
                  <div className="flex h-28 w-full border-b border-[#E5E5E5]">
                    {palette.colors.map((color) => {
                      const isLight = isLightColor(color.hex);
                      return (
                        <div
                          key={color.id}
                          className="flex-1 flex flex-col justify-end p-2 transition-all group-hover:flex-[1.2] relative cursor-pointer"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => onCopy(color.hex.toUpperCase(), color.name)}
                          title={`${color.name} (${color.hex.toUpperCase()})`}
                        >
                          <span className={`text-[9px] font-mono font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity ${
                            isLight ? 'text-black/90' : 'text-white/90'
                          }`}>
                            {color.hex.toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-black uppercase font-mono tracking-tight group-hover:text-zinc-700 transition-colors">
                        {palette.title}
                      </h3>
                      <button
                        onClick={() => onToggleFavorite(palette)}
                        className={`p-1.5 border transition-colors cursor-pointer ${
                          isFav
                            ? 'bg-black border-black text-white'
                            : 'bg-[#F5F5F5] border-[#E5E5E5] text-[#888] hover:text-black hover:border-black'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-[#666] mt-2 leading-relaxed line-clamp-2">
                      {palette.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {palette.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-[#F5F5F5] border border-[#E5E5E5] text-[10px] font-mono font-bold text-[#666] uppercase"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-6 py-3.5 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyAll(palette)}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-[#666] hover:text-black transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Hexes'}</span>
                  </button>

                  <button
                    onClick={() => onApplyPalette(palette.colors)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <span>Use in Generator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

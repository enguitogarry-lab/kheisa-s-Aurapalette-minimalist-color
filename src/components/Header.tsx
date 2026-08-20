import React from 'react';
import { HarmonyType, ActiveTab, ColorFormat } from '../types/palette';
import { 
  Sparkles, 
  Layers, 
  Eye, 
  Image as ImageIcon, 
  Compass, 
  Flame, 
  Download, 
  Share2, 
  History, 
  Bookmark,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  harmony: HarmonyType;
  setHarmony: (harmony: HarmonyType) => void;
  colorFormat: ColorFormat;
  setColorFormat: (format: ColorFormat) => void;
  onGenerate: () => void;
  onOpenExport: () => void;
  onOpenShare: () => void;
  onToggleHistory: () => void;
  onToggleFavorites: () => void;
  historyCount: number;
  favoritesCount: number;
}

const HARMONY_OPTIONS: { value: HarmonyType; label: string; desc: string }[] = [
  { value: 'aesthetic', label: 'Balanced Aesthetic', desc: 'Curated luminance & contrast' },
  { value: 'analogous', label: 'Analogous', desc: 'Adjacent hues on the wheel' },
  { value: 'monochromatic', label: 'Monochromatic', desc: 'Single hue tonal spectrum' },
  { value: 'complementary', label: 'Complementary', desc: 'Direct opposite hues' },
  { value: 'split-complementary', label: 'Split-Complementary', desc: 'Dynamic high-contrast trio' },
  { value: 'triadic', label: 'Triadic', desc: 'Equidistant triangle hues' },
  { value: 'warm-editorial', label: 'Warm Editorial', desc: 'Terracotta, ochre & linen' },
  { value: 'nordic-minimal', label: 'Nordic Minimal', desc: 'Mist, pine & cool slate' },
  { value: 'cyberpunk-neon', label: 'Cyberpunk Neon', desc: 'Electric high-contrast glow' },
  { value: 'earthy-botanical', label: 'Earthy Botanical', desc: 'Forest, sage & clay' },
  { value: 'pastel-dream', label: 'Pastel Dream', desc: 'Soft confectionary tones' },
  { value: 'luxury-noir', label: 'Luxury Noir', desc: 'Velvet obsidian & metallic gold' },
  { value: 'japanese-wabi', label: 'Japanese Wabi-Sabi', desc: 'Earthy organic neutrals' },
  { value: 'sunset-dusk', label: 'Sunset & Dusk', desc: 'Radiant twilight gradient' },
  { value: 'swiss-bauhaus', label: 'Swiss Bauhaus', desc: 'Iconic bold graphic primaries' },
  { value: 'random', label: 'Experimental Random', desc: 'Unconstrained algorithmic hues' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  harmony,
  setHarmony,
  colorFormat,
  setColorFormat,
  onGenerate,
  onOpenExport,
  onOpenShare,
  onToggleHistory,
  onToggleFavorites,
  historyCount,
  favoritesCount,
}) => {
  const [harmonyOpen, setHarmonyOpen] = React.useState(false);
  const [formatOpen, setFormatOpen] = React.useState(false);
  const harmonyRef = React.useRef<HTMLDivElement>(null);
  const formatRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (harmonyRef.current && !harmonyRef.current.contains(e.target as Node)) {
        setHarmonyOpen(false);
      }
      if (formatRef.current && !formatRef.current.contains(e.target as Node)) {
        setFormatOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'generator', label: 'Generator', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'Space' },
    { id: 'preview', label: 'UI Preview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'contrast', label: 'WCAG Matrix', icon: <Eye className="w-3.5 h-3.5" /> },
    { id: 'extractor', label: 'Image Extract', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'library', label: 'Curated Grid', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'gradients', label: 'Gradient Studio', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] text-black transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Geometric Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('generator')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <div className="w-8 h-8 bg-black flex items-center justify-center shadow-sm group-hover:bg-zinc-800 transition-colors">
                <div className="w-4 h-4 bg-white rotate-45" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tighter text-black flex items-center gap-2">
                  CHROMA.GRID
                  <span className="text-[9px] px-1.5 py-0.5 border border-black font-mono font-bold tracking-widest uppercase">
                    v2.4
                  </span>
                </span>
                <p className="text-[10px] uppercase tracking-widest text-[#888] hidden sm:block font-medium">
                  Geometric Balance Theme
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-[#666]">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-2 transition-all cursor-pointer ${
                    isActive
                      ? 'text-black border-b-2 border-black font-extrabold'
                      : 'hover:text-black'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <kbd className={`text-[9px] px-1 py-0.2 font-mono font-bold ${
                      isActive ? 'bg-black text-white' : 'bg-[#EAEAEA] text-[#666]'
                    }`}>
                      {tab.badge}
                    </kbd>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls & Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Harmony Mode Dropdown */}
            <div className="relative" ref={harmonyRef}>
              <button
                onClick={() => setHarmonyOpen(!harmonyOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#F5F5F5] border border-[#E5E5E5] hover:border-black text-black transition-colors cursor-pointer"
                title="Color Harmony Algorithm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-black" />
                <span className="hidden md:inline font-mono text-[11px]">
                  {HARMONY_OPTIONS.find((h) => h.value === harmony)?.label.split(' ')[0] || 'Harmony'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#666]" />
              </button>

              {harmonyOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E5E5] shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#999] uppercase tracking-widest border-b border-[#E5E5E5]">
                    Harmony Parameters
                  </div>
                  <div className="max-h-72 overflow-y-auto mt-1 divide-y divide-[#F0F0F0]">
                    {HARMONY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setHarmony(opt.value);
                          setHarmonyOpen(false);
                          onGenerate();
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-[#F5F5F5] transition-colors cursor-pointer ${
                          harmony === opt.value ? 'bg-[#F5F5F5] text-black font-bold' : 'text-[#444]'
                        }`}
                      >
                        <div className="font-semibold flex items-center justify-between">
                          {opt.label}
                          {harmony === opt.value && <div className="w-1.5 h-1.5 bg-black rotate-45" />}
                        </div>
                        <span className="text-[10px] text-[#888]">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Format Selector */}
            <div className="relative" ref={formatRef}>
              <button
                onClick={() => setFormatOpen(!formatOpen)}
                className="px-2.5 py-2 text-xs font-mono font-bold bg-[#F5F5F5] border border-[#E5E5E5] text-black hover:border-black transition-colors cursor-pointer"
                title="Color display format"
              >
                {colorFormat.toUpperCase()}
              </button>

              {formatOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-[#E5E5E5] shadow-xl py-1 z-50">
                  {(['hex', 'rgb', 'hsl', 'cmyk', 'oklch'] as ColorFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setColorFormat(fmt);
                        setFormatOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-[#F5F5F5] transition-colors cursor-pointer ${
                        colorFormat === fmt ? 'text-black font-bold bg-[#F0F0F0]' : 'text-[#666]'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Favorites Drawer Button */}
            <button
              onClick={onToggleFavorites}
              className="relative p-2 bg-[#F5F5F5] border border-[#E5E5E5] text-[#444] hover:text-black hover:border-black transition-colors cursor-pointer"
              title="Saved Favorite Palettes"
            >
              <Bookmark className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* History Drawer Button */}
            <button
              onClick={onToggleHistory}
              className="relative p-2 bg-[#F5F5F5] border border-[#E5E5E5] text-[#444] hover:text-black hover:border-black transition-colors cursor-pointer"
              title="Generation History"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#666] text-white text-[9px] font-bold flex items-center justify-center">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Share Palette */}
            <button
              onClick={onOpenShare}
              className="p-2 bg-[#F5F5F5] border border-[#E5E5E5] text-[#444] hover:text-black hover:border-black transition-colors cursor-pointer"
              title="Share Palette URL"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Export Palette Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 bg-black text-white px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Palette</span>
              <span className="sm:hidden">Export</span>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-4 pb-3 overflow-x-auto no-scrollbar border-t border-[#E5E5E5] pt-2.5 text-xs font-bold uppercase tracking-widest text-[#666]">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-black border-b-2 border-black pb-0.5'
                    : 'hover:text-black'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

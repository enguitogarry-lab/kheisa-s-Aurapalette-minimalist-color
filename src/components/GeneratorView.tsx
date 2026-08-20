import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import chroma from 'chroma-js';
import { ColorItem, ColorFormat, Palette } from '../types/palette';
import { 
  formatColor, 
  isLightColor, 
  generateShadeScale,
  getContrastRatio 
} from '../utils/colorUtils';
import { 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Sliders, 
  RotateCcw,
  ArrowUpDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface GeneratorViewProps {
  colors: ColorItem[];
  colorFormat: ColorFormat;
  onGenerate: () => void;
  onUpdateColors: (colors: ColorItem[]) => void;
  onOpenInspector: (color: ColorItem) => void;
  onCopy: (text: string, label: string) => void;
  onAddColor: () => void;
  onRemoveColor: (id: string) => void;
  history?: Palette[];
  onApplyPalette?: (colors: ColorItem[]) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  colors,
  colorFormat,
  onGenerate,
  onUpdateColors,
  onOpenInspector,
  onCopy,
  onAddColor,
  onRemoveColor,
  history = [],
  onApplyPalette,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [activeShadeId, setActiveShadeId] = React.useState<string | null>(null);

  const handleCopySwatch = (color: ColorItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = formatColor(color.hex, colorFormat);
    onCopy(formatted, color.name);
    setCopiedId(color.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const toggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateColors(
      colors.map((c) => (c.id === id ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const moveColor = (index: number, direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colors.length) return;
    const newColors = [...colors];
    const temp = newColors[index];
    newColors[index] = newColors[targetIndex];
    newColors[targetIndex] = temp;
    onUpdateColors(newColors);
  };

  const lockAll = () => {
    const allLocked = colors.every((c) => c.isLocked);
    onUpdateColors(colors.map((c) => ({ ...c, isLocked: !allLocked })));
  };

  const reversePalette = () => {
    onUpdateColors([...colors].reverse());
  };

  const sortByLightness = () => {
    const sorted = [...colors].sort((a, b) => {
      const lumA = chroma(a.hex).luminance();
      const lumB = chroma(b.hex).luminance();
      return lumA - lumB;
    });
    onUpdateColors(sorted);
  };

  const allLocked = colors.every((c) => c.isLocked);

  // Derive Geometric Balance parameters for the sidebar
  const maxContrast = React.useMemo(() => {
    let max = 1;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const ratio = getContrastRatio(colors[i].hex, colors[j].hex);
        if (ratio > max) max = ratio;
      }
    }
    return max;
  }, [colors]);

  const avgSaturation = React.useMemo(() => {
    try {
      const total = colors.reduce((acc, c) => acc + chroma(c.hex).get('hsl.s'), 0);
      return total / colors.length;
    } catch {
      return 0.5;
    }
  }, [colors]);

  const avgLuminance = React.useMemo(() => {
    try {
      const total = colors.reduce((acc, c) => acc + chroma(c.hex).luminance(), 0);
      return total / colors.length;
    } catch {
      return 0.5;
    }
  }, [colors]);

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5]">
      
      {/* Top Quick Geometric Toolbar */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={lockAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#444] hover:text-black bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] transition-colors cursor-pointer"
            title="Lock or unlock all colors"
          >
            {allLocked ? <Unlock className="w-3.5 h-3.5 text-black" /> : <Lock className="w-3.5 h-3.5 text-[#666]" />}
            <span>{allLocked ? 'Unlock All' : 'Lock All'}</span>
          </button>

          <button
            onClick={reversePalette}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#444] hover:text-black bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] transition-colors cursor-pointer"
            title="Reverse palette order"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#666]" />
            <span className="hidden sm:inline">Invert Order</span>
          </button>

          <button
            onClick={sortByLightness}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#444] hover:text-black bg-[#F5F5F5] hover:bg-[#EAEAEA] border border-[#E5E5E5] transition-colors cursor-pointer"
            title="Sort swatches by contrast luminance"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#666]" />
            <span className="hidden sm:inline">Sort Light/Dark</span>
          </button>
        </div>

        {/* Swatch Count Controller */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666]">
            {colors.length} Tones
          </span>
          {colors.length < 8 && (
            <button
              onClick={onAddColor}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Add a swatch to palette"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tone</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Swatches Column Canvas + Right Geometric Parameters Aside */}
      <div className="flex-1 flex flex-col lg:flex-row w-full">
        
        {/* Left Section: Swatches Spectrum Canvas */}
        <section className="w-full lg:w-2/3 flex flex-col sm:flex-row min-h-[440px] lg:min-h-0 flex-1 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
          <AnimatePresence mode="popLayout">
            {colors.map((color, index) => {
              const isLight = isLightColor(color.hex);
              const formatted = formatColor(color.hex, colorFormat);
              const isCopied = copiedId === color.id;
              const shades = generateShadeScale(color.hex);
              const showShades = activeShadeId === color.id;

              return (
                <motion.div
                  key={color.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col group relative justify-between p-6 sm:p-8 cursor-pointer select-none transition-all border-b sm:border-b-0 sm:border-r border-black/10 last:border-0"
                  style={{ 
                    backgroundColor: color.hex,
                    color: isLight ? '#1A1A1A' : '#FFFFFF' 
                  }}
                  onClick={(e) => handleCopySwatch(color, e)}
                >
                  {/* Top Swatch Controls (Lock, Role, Inspector) */}
                  <div className="w-full flex items-center justify-between z-10">
                    {/* Role / Tone Label */}
                    <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border ${
                      isLight 
                        ? 'border-black/30 bg-black/5 text-black' 
                        : 'border-white/30 bg-white/10 text-white'
                    }`}>
                      {color.role?.toUpperCase() || `TONE 0${index + 1}`}
                    </span>

                    {/* Lock and Adjust Buttons */}
                    <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => toggleLock(color.id, e)}
                        className={`p-2 transition-transform active:scale-95 cursor-pointer text-sm ${
                          color.isLocked
                            ? 'bg-black text-white font-bold'
                            : isLight
                              ? 'bg-black/10 hover:bg-black/20 text-black'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        title={color.isLocked ? 'Locked (will stay unchanged)' : 'Click to lock'}
                      >
                        {color.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInspector(color);
                        }}
                        className={`p-2 transition-transform active:scale-95 cursor-pointer ${
                          isLight ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        title="Adjust tone parameters"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center Swatch Info: Big Monospace Hex & Name */}
                  <div className="my-auto py-6 sm:py-0">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight">
                          {formatted}
                        </h2>
                        {isCopied && (
                          <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-black text-white animate-in zoom-in">
                            COPIED
                          </span>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-widest opacity-75 font-semibold line-clamp-1">
                        {color.name}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Swatch Tools: Reorder, Shades Ramp, Delete */}
                  <div className="w-full flex items-center justify-between z-10 pt-4">
                    {/* Shift Left / Right */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={(e) => moveColor(index, 'left', e)}
                          className={`p-1.5 transition-colors cursor-pointer ${
                            isLight ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                          title="Shift tone left"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {index < colors.length - 1 && (
                        <button
                          onClick={(e) => moveColor(index, 'right', e)}
                          className={`p-1.5 transition-colors cursor-pointer ${
                            isLight ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                          title="Shift tone right"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Shades Toggle & Remove */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveShadeId(showShades ? null : color.id);
                        }}
                        className={`p-1.5 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                          showShades
                            ? 'bg-black text-white'
                            : isLight
                              ? 'bg-black/10 hover:bg-black/20 text-black'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        title="Tonal ramp (50-950)"
                      >
                        <Layers className="w-3 h-3" />
                        <span className="hidden sm:inline">Ramp</span>
                      </button>

                      {colors.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveColor(color.id);
                          }}
                          className={`p-1.5 transition-colors cursor-pointer ${
                            isLight ? 'bg-black/10 hover:bg-black text-black hover:text-white' : 'bg-white/20 hover:bg-white text-white hover:text-black'
                          }`}
                          title="Remove tone"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Shades Popover Ramp */}
                  {showShades && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-16 left-3 right-3 bg-white text-black border border-black p-2 z-30 shadow-2xl animate-in slide-in-from-bottom-2 duration-150"
                    >
                      <div className="text-[10px] font-bold text-[#666] mb-1.5 px-1 uppercase tracking-widest flex justify-between">
                        <span>Tonal Scales</span>
                        <button 
                          onClick={() => setActiveShadeId(null)}
                          className="text-black font-bold hover:opacity-60 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-11 gap-0.5 border border-[#E5E5E5]">
                        {shades.map((s) => (
                          <button
                            key={s.step}
                            onClick={() => {
                              onUpdateColors(
                                colors.map((c) =>
                                  c.id === color.id
                                    ? { ...c, hex: s.hex.toLowerCase(), name: color.name }
                                    : c
                                )
                              );
                              setActiveShadeId(null);
                            }}
                            className="h-8 flex flex-col items-center justify-end pb-0.5 transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: s.hex }}
                            title={`Apply shade ${s.step}: ${s.hex.toUpperCase()}`}
                          >
                            <span className={`text-[8px] font-mono font-bold ${isLightColor(s.hex) ? 'text-black' : 'text-white'}`}>
                              {s.step}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Right Section: Geometric Balance Parameters Aside */}
        <aside className="w-full lg:w-1/3 flex flex-col bg-white p-6 sm:p-10 justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#999] mb-6">
              Theme Parameters
            </h3>

            {/* Geometric Meters */}
            <div className="space-y-6">
              
              {/* Metric 1: Harmony Balance */}
              <div>
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider mb-2">
                  <span className="text-[#444]">Color Harmony</span>
                  <span className="font-mono font-bold text-black">Balanced Grid</span>
                </div>
                <div className="h-1 bg-[#EEE] w-full">
                  <div 
                    className="h-1 bg-black transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(30, (colors.length / 8) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Contrast Ratio */}
              <div>
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider mb-2">
                  <span className="text-[#444]">Contrast Ratio</span>
                  <span className="font-mono font-bold text-black">
                    {maxContrast >= 7 ? `High (${maxContrast.toFixed(1)})` : maxContrast >= 4.5 ? `Medium (${maxContrast.toFixed(1)})` : `Soft (${maxContrast.toFixed(1)})`}
                  </span>
                </div>
                <div className="h-1 bg-[#EEE] w-full">
                  <div 
                    className="h-1 bg-black transition-all duration-300"
                    style={{ width: `${Math.min(100, (maxContrast / 15) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Saturation Balance */}
              <div>
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider mb-2">
                  <span className="text-[#444]">Saturation Index</span>
                  <span className="font-mono font-bold text-black">
                    {avgSaturation > 0.65 ? 'Vibrant' : avgSaturation < 0.3 ? 'Muted' : 'Balanced'} ({(avgSaturation * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="h-1 bg-[#EEE] w-full">
                  <div 
                    className="h-1 bg-black transition-all duration-300"
                    style={{ width: `${Math.min(100, avgSaturation * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Luminance Span */}
              <div>
                <div className="flex justify-between text-xs font-medium uppercase tracking-wider mb-2">
                  <span className="text-[#444]">Luminance Balance</span>
                  <span className="font-mono font-bold text-black">
                    {(avgLuminance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-[#EEE] w-full">
                  <div 
                    className="h-1 bg-black transition-all duration-300"
                    style={{ width: `${Math.min(100, avgLuminance * 100)}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Recent Mixes (Geometric Strip Grid) */}
            <div className="mt-10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#999] mb-4">
                Recent Mixes
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {history.length > 0 ? (
                  history.slice(0, 4).map((item, idx) => (
                    <button
                      key={item.id || idx}
                      onClick={() => onApplyPalette && onApplyPalette(item.colors)}
                      className="flex h-8 w-full border border-[#EEE] hover:border-black transition-all cursor-pointer overflow-hidden group"
                      title={`Restore ${item.title || 'Palette'}`}
                    >
                      {item.colors.map((c) => (
                        <div
                          key={c.id}
                          className="flex-1 h-full transition-transform group-hover:scale-105"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </button>
                  ))
                ) : (
                  <>
                    <div className="flex h-8 w-full border border-[#EEE]">
                      <div className="w-1/4 bg-[#03071E]" />
                      <div className="w-1/4 bg-[#370617]" />
                      <div className="w-1/4 bg-[#D00000]" />
                      <div className="w-1/4 bg-[#FAA307]" />
                    </div>
                    <div className="flex h-8 w-full border border-[#EEE]">
                      <div className="w-1/4 bg-[#2D6A4F]" />
                      <div className="w-1/4 bg-[#40916C]" />
                      <div className="w-1/4 bg-[#95D5B2]" />
                      <div className="w-1/4 bg-[#D8F3DC]" />
                    </div>
                    <div className="flex h-8 w-full border border-[#EEE]">
                      <div className="w-1/4 bg-[#001219]" />
                      <div className="w-1/4 bg-[#005F73]" />
                      <div className="w-1/4 bg-[#94D2BD]" />
                      <div className="w-1/4 bg-[#EE9B00]" />
                    </div>
                    <div className="flex h-8 w-full border border-[#EEE]">
                      <div className="w-1/4 bg-[#22223B]" />
                      <div className="w-1/4 bg-[#4A4E69]" />
                      <div className="w-1/4 bg-[#9A8C98]" />
                      <div className="w-1/4 bg-[#F2E9E4]" />
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Generation Trigger */}
          <div className="space-y-4 pt-8">
            <button
              onClick={onGenerate}
              className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all cursor-pointer shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Palette [Space]</span>
            </button>
            <p className="text-[10px] text-center text-[#999] leading-relaxed uppercase tracking-tighter">
              Press 'L' to lock specific colors. Click swatches to copy values.
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
};

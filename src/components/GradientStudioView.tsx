import React, { useState } from 'react';
import { ColorItem } from '../types/palette';
import { Flame, Copy, Check, Maximize2, Sparkles } from 'lucide-react';

interface GradientStudioViewProps {
  colors: ColorItem[];
  onCopy: (text: string, label: string) => void;
}

type GradientType = 'linear' | 'radial' | 'conic' | 'mesh';

export const GradientStudioView: React.FC<GradientStudioViewProps> = ({ colors, onCopy }) => {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>(
    colors.slice(0, 3).map((c) => c.id)
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync selected colors if palette updates
  React.useEffect(() => {
    if (colors.length >= 2) {
      setSelectedColorIds(colors.slice(0, Math.min(3, colors.length)).map((c) => c.id));
    }
  }, [colors]);

  const activeColors = colors.filter((c) => selectedColorIds.includes(c.id));
  const hexList = activeColors.map((c) => c.hex);

  // Fallback if no colors selected
  const displayHexes = hexList.length >= 2 ? hexList : colors.slice(0, 2).map((c) => c.hex);

  const getGradientCss = (): string => {
    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${displayHexes.join(', ')})`;
      case 'radial':
        return `radial-gradient(circle at center, ${displayHexes.join(', ')})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg at 50% 50%, ${displayHexes.join(', ')}, ${displayHexes[0]})`;
      case 'mesh':
        if (displayHexes.length >= 3) {
          return `radial-gradient(at 10% 20%, ${displayHexes[0]} 0px, transparent 50%),
radial-gradient(at 80% 0%, ${displayHexes[1]} 0px, transparent 50%),
radial-gradient(at 0% 50%, ${displayHexes[2]} 0px, transparent 50%),
radial-gradient(at 80% 50%, ${displayHexes[0]} 0px, transparent 50%),
radial-gradient(at 0% 100%, ${displayHexes[1]} 0px, transparent 50%),
radial-gradient(at 80% 100%, ${displayHexes[2]} 0px, transparent 50%),
${displayHexes[0]}`;
        }
        return `linear-gradient(${angle}deg, ${displayHexes.join(', ')})`;
      default:
        return `linear-gradient(${angle}deg, ${displayHexes.join(', ')})`;
    }
  };

  const cssRule = `background: ${getGradientCss()};`;

  const handleCopyCss = () => {
    onCopy(cssRule, 'CSS Gradient Code');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const toggleColor = (id: string) => {
    if (selectedColorIds.includes(id)) {
      if (selectedColorIds.length > 2) {
        setSelectedColorIds(selectedColorIds.filter((cid) => cid !== id));
      }
    } else {
      setSelectedColorIds([...selectedColorIds, id]);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5] text-black p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2 font-mono">
              <Flame className="w-5 h-5 text-black" />
              Gradient Studio & Mesh Generator
            </h2>
            <p className="text-xs text-[#666] mt-1">
              Create multi-stop linear, radial, and fluid mesh gradients from your active palette tones.
            </p>
          </div>

          <button
            onClick={handleCopyCss}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-all shadow-md cursor-pointer shrink-0"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Copy CSS Code</span>
          </button>
        </div>

        {/* Studio Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6 shadow-sm">
            
            {/* Gradient Type */}
            <div>
              <label className="text-xs font-bold text-[#999] uppercase tracking-widest block mb-2">
                Gradient Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['linear', 'radial', 'conic', 'mesh'] as GradientType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGradientType(type)}
                    className={`py-2 px-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      gradientType === type
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-[#F5F5F5] text-[#666] hover:text-black border border-[#E5E5E5]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Slider (For Linear and Conic) */}
            {(gradientType === 'linear' || gradientType === 'conic') && (
              <div>
                <div className="flex justify-between text-xs text-[#666] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Angle</span>
                  <span className="font-mono text-black font-bold">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full h-1 bg-[#EEE] appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#888] mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Select Swatches Included in Gradient */}
            <div>
              <label className="text-xs font-bold text-[#999] uppercase tracking-widest block mb-2">
                Include Palette Swatches (Min 2)
              </label>
              <div className="space-y-2">
                {colors.map((color) => {
                  const isChecked = selectedColorIds.includes(color.id);
                  return (
                    <button
                      key={color.id}
                      onClick={() => toggleColor(color.id)}
                      className={`w-full p-2.5 border flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#F5F5F5] border-black text-black font-bold shadow-sm'
                          : 'bg-white border-[#E5E5E5] text-[#888] opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 border border-black/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs">{color.name}</span>
                      </div>
                      <span className="font-mono text-[11px] uppercase font-bold">{color.hex}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Code Output Preview Box */}
            <div className="p-4 bg-[#F5F5F5] border border-[#E5E5E5] text-[11px] font-mono text-black break-all">
              <span className="text-[#888] block mb-1 uppercase text-[9px] font-bold tracking-widest">
                CSS Definition:
              </span>
              <code>{cssRule}</code>
            </div>

          </div>

          {/* Large Live Canvas Preview Stage */}
          <div className="lg:col-span-2 relative bg-white border border-[#E5E5E5] overflow-hidden min-h-[480px] shadow-xl flex flex-col justify-between p-6 sm:p-8">
            
            {/* Background Gradient Canvas */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{ background: getGradientCss() }}
            />

            {/* Top Overlay controls */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="px-3 py-1 text-xs font-bold font-mono uppercase bg-black text-white shadow-md">
                {gradientType} • {activeColors.length} Stops
              </span>

              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2.5 bg-black text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-md"
                title="Fullscreen Preview"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Center Typographic Aesthetic Card Demo */}
            <div className="relative z-10 my-auto max-w-md mx-auto p-6 sm:p-8 bg-white text-black border border-black shadow-2xl text-center">
              <div className="w-8 h-8 bg-black mx-auto mb-3 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rotate-45" />
              </div>
              <h3 className="text-2xl font-black uppercase font-mono tracking-tight">Fluid Theme Canvas</h3>
              <p className="text-xs text-[#666] mt-2 leading-relaxed">
                Render calibrated digital backdrops, landing hero cards, and mesh graphics that effortlessly inherit your core color palette.
              </p>
            </div>

            {/* Bottom Swatch Pipettes */}
            <div className="relative z-10 flex items-center justify-center gap-2">
              {activeColors.map((c) => (
                <div
                  key={c.id}
                  className="px-3 py-1 text-[10px] font-mono font-bold uppercase bg-black text-white shadow-sm"
                >
                  {c.hex.toUpperCase()}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Fullscreen Backdrop Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          style={{ background: getGradientCss() }}
          onClick={() => setIsFullscreen(false)}
        >
          <div className="p-4 bg-black text-white border border-white text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
            Click anywhere to exit fullscreen
          </div>
        </div>
      )}

    </div>
  );
};

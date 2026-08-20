import React from 'react';
import chroma from 'chroma-js';
import { ColorItem, ColorFormat } from '../types/palette';
import { 
  formatColor, 
  generateShadeScale, 
  getContrastRatio, 
  getWcagLevel, 
  isLightColor 
} from '../utils/colorUtils';
import { getColorName } from '../utils/colorNames';
import { X, Lock, Unlock, Copy, Check, Sliders, Hash, ShieldCheck, Tag } from 'lucide-react';

interface ColorInspectorModalProps {
  color: ColorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateColor: (updated: ColorItem) => void;
  onCopy: (text: string, label: string) => void;
}

export const ColorInspectorModal: React.FC<ColorInspectorModalProps> = ({
  color,
  isOpen,
  onClose,
  onUpdateColor,
  onCopy,
}) => {
  if (!isOpen || !color) return null;

  const [copiedFormat, setCopiedFormat] = React.useState<string | null>(null);

  // Derive HSL values
  const [h, s, l] = React.useMemo(() => {
    try {
      const [hue, sat, lit] = chroma(color.hex).hsl();
      return [
        isNaN(hue) ? 0 : Math.round(hue),
        Math.round(sat * 100),
        Math.round(lit * 100),
      ];
    } catch {
      return [0, 0, 50];
    }
  }, [color.hex]);

  const handleHueChange = (newHue: number) => {
    try {
      const newHex = chroma.hsl(newHue, s / 100, l / 100).hex().toLowerCase();
      onUpdateColor({
        ...color,
        hex: newHex,
        name: getColorName(newHex),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSatChange = (newSat: number) => {
    try {
      const newHex = chroma.hsl(h, newSat / 100, l / 100).hex().toLowerCase();
      onUpdateColor({
        ...color,
        hex: newHex,
        name: getColorName(newHex),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleLightChange = (newLight: number) => {
    try {
      const newHex = chroma.hsl(h, s / 100, newLight / 100).hex().toLowerCase();
      onUpdateColor({
        ...color,
        hex: newHex,
        name: getColorName(newHex),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleHexInput = (hexVal: string) => {
    let clean = hexVal.trim();
    if (!clean.startsWith('#')) clean = '#' + clean;
    if (chroma.valid(clean)) {
      const normalized = chroma(clean).hex().toLowerCase();
      onUpdateColor({
        ...color,
        hex: normalized,
        name: getColorName(normalized),
      });
    }
  };

  const shades = React.useMemo(() => generateShadeScale(color.hex), [color.hex]);

  const whiteContrast = getContrastRatio(color.hex, '#ffffff');
  const blackContrast = getContrastRatio(color.hex, '#000000');
  const whiteWcag = getWcagLevel(whiteContrast);
  const blackWcag = getWcagLevel(blackContrast);

  const copyWithFeedback = (val: string, format: string) => {
    onCopy(val, format);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  const roles: ColorItem['role'][] = ['primary', 'secondary', 'accent', 'background', 'surface', 'neutral', 'text'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-black w-full max-w-xl shadow-2xl overflow-hidden text-black flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3">
            <div 
              className="w-5 h-5 border border-black/20"
              style={{ backgroundColor: color.hex }}
            />
            <div>
              <h2 className="text-base font-black text-black tracking-tight uppercase font-mono">{color.name}</h2>
              <p className="text-xs text-[#666] font-mono uppercase font-bold">{color.hex}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateColor({ ...color, isLocked: !color.isLocked })}
              className={`p-2 border text-xs font-bold transition-colors cursor-pointer ${
                color.isLocked
                  ? 'bg-black border-black text-white'
                  : 'bg-[#F5F5F5] border-[#E5E5E5] text-[#666] hover:text-black hover:border-black'
              }`}
              title={color.isLocked ? 'Locked (will not change on spacebar)' : 'Unlocked'}
            >
              {color.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-[#F5F5F5] text-[#666] hover:text-black hover:bg-[#EAEAEA] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Visual Swatch Banner */}
          <div 
            className="w-full h-28 relative p-5 flex flex-col justify-between shadow-inner border border-black/15 transition-colors duration-200"
            style={{ backgroundColor: color.hex }}
          >
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 border ${
                isLightColor(color.hex) ? 'bg-black/10 text-black border-black/30' : 'bg-white/15 text-white border-white/30'
              }`}>
                {color.role?.toUpperCase() || 'TONE'}
              </span>
              <button
                onClick={() => copyWithFeedback(color.hex.toUpperCase(), 'HEX')}
                className={`flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 transition-all cursor-pointer border ${
                  isLightColor(color.hex) ? 'bg-black/10 text-black border-black/20 hover:bg-black/20' : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }`}
              >
                {copiedFormat === 'HEX' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{color.hex.toUpperCase()}</span>
              </button>
            </div>

            <div className={isLightColor(color.hex) ? 'text-black' : 'text-white'}>
              <p className="text-xl font-bold font-mono tracking-tight uppercase">{color.name}</p>
            </div>
          </div>

          {/* Quick Format Copy Grid */}
          <div>
            <label className="text-xs font-bold text-[#999] uppercase tracking-widest block mb-2">
              Color Formats & Values
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['hex', 'rgb', 'hsl', 'cmyk', 'oklch'] as ColorFormat[]).map((fmt) => {
                const val = formatColor(color.hex, fmt);
                const isCopied = copiedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => copyWithFeedback(val, fmt)}
                    className="p-3 bg-[#F5F5F5] border border-[#E5E5E5] hover:border-black text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#888] uppercase mb-1">
                      <span>{fmt}</span>
                      {isCopied ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3 text-[#BBB] group-hover:text-black" />}
                    </div>
                    <div className="font-mono text-xs font-bold text-black truncate">
                      {val}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* HSL Tuning Sliders */}
          <div className="space-y-4 bg-[#F9F9F9] p-5 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-black flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-black" />
                Fine-Tune HSL
              </span>
              <div className="flex items-center gap-2">
                <Hash className="w-3 h-3 text-[#888]" />
                <input
                  type="text"
                  defaultValue={color.hex}
                  onBlur={(e) => handleHexInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHexInput((e.target as HTMLInputElement).value)}
                  className="w-20 px-2 py-0.5 text-xs font-mono font-bold bg-white border border-[#E5E5E5] text-black text-center uppercase focus:outline-none focus:border-black"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Hue Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#666] mb-1 font-mono">
                <span className="uppercase text-[10px] font-bold">Hue</span>
                <span className="font-bold text-black">{h}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={h}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="w-full h-1.5 appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
              />
            </div>

            {/* Saturation Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#666] mb-1 font-mono">
                <span className="uppercase text-[10px] font-bold">Saturation</span>
                <span className="font-bold text-black">{s}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={s}
                onChange={(e) => handleSatChange(Number(e.target.value))}
                className="w-full h-1.5 appearance-none cursor-pointer bg-[#DDD]"
              />
            </div>

            {/* Lightness Slider */}
            <div>
              <div className="flex justify-between text-xs text-[#666] mb-1 font-mono">
                <span className="uppercase text-[10px] font-bold">Lightness</span>
                <span className="font-bold text-black">{l}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={l}
                onChange={(e) => handleLightChange(Number(e.target.value))}
                className="w-full h-1.5 appearance-none cursor-pointer bg-[#DDD]"
              />
            </div>
          </div>

          {/* 10-Step Tonal Scale (Tints & Shades) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#999] uppercase tracking-widest">
                Tonal Ramp (50 - 950)
              </label>
              <span className="text-[10px] font-mono text-[#888] uppercase">Click to apply</span>
            </div>
            <div className="grid grid-cols-11 border border-[#E5E5E5]">
              {shades.map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    onUpdateColor({
                      ...color,
                      hex: s.hex.toLowerCase(),
                      name: getColorName(s.hex),
                    });
                  }}
                  className="h-12 flex flex-col items-center justify-end pb-1 text-[9px] font-mono transition-transform hover:scale-105 relative cursor-pointer"
                  style={{ backgroundColor: s.hex }}
                  title={`Shade ${s.step}: ${s.hex.toUpperCase()}`}
                >
                  <span className={`font-bold ${isLightColor(s.hex) ? 'text-black' : 'text-white'}`}>
                    {s.step}
                  </span>
                  {s.isBase && (
                    <div className="absolute top-1 w-1.5 h-1.5 bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* WCAG Contrast Ratio Quick Check */}
          <div>
            <label className="text-xs font-bold text-[#999] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              WCAG Accessibility Contrast
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Against White */}
              <div className="p-3 bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-white border border-black/20 flex items-center justify-center text-[10px] font-bold font-mono text-black">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">on White</div>
                    <div className="text-[11px] font-mono text-[#666]">{whiteContrast.toFixed(2)}:1</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                  whiteWcag.aaNormal ? 'bg-black text-white border-black' : 'bg-white text-[#888] border-[#E5E5E5]'
                }`}>
                  {whiteWcag.ratingText}
                </span>
              </div>

              {/* Against Black */}
              <div className="p-3 bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-black border border-black flex items-center justify-center text-[10px] font-bold font-mono text-white">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">on Black</div>
                    <div className="text-[11px] font-mono text-[#666]">{blackContrast.toFixed(2)}:1</div>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
                  blackWcag.aaNormal ? 'bg-black text-white border-black' : 'bg-white text-[#888] border-[#E5E5E5]'
                }`}>
                  {blackWcag.ratingText}
                </span>
              </div>
            </div>
          </div>

          {/* Design Role Assigner */}
          <div>
            <label className="text-xs font-bold text-[#999] uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-black" />
              Theme Token Role
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => onUpdateColor({ ...color, role })}
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                    color.role === role
                      ? 'bg-black border-black text-white'
                      : 'bg-[#F5F5F5] border-[#E5E5E5] text-[#666] hover:text-black hover:border-black'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E5E5E5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};

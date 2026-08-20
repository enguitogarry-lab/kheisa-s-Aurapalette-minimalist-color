import React from 'react';
import { ColorItem, VisionDeficiency } from '../types/palette';
import { 
  getContrastRatio, 
  getWcagLevel, 
  isLightColor, 
  simulateVisionDeficiency 
} from '../utils/colorUtils';
import { ShieldCheck, Eye, Check, X } from 'lucide-react';

interface ContrastMatrixViewProps {
  colors: ColorItem[];
}

export const ContrastMatrixView: React.FC<ContrastMatrixViewProps> = ({ colors }) => {
  const [selectedPair, setSelectedPair] = React.useState<{ bg: ColorItem; text: ColorItem }>(() => ({
    bg: colors[0] || { id: 'def-bg', hex: '#ffffff', name: 'White', isLocked: false },
    text: colors[colors.length - 1] || { id: 'def-text', hex: '#000000', name: 'Black', isLocked: false },
  }));

  // Keep selectedPair synced when colors change
  React.useEffect(() => {
    if (colors.length >= 2) {
      setSelectedPair((prev) => {
        const bgExists = colors.find((c) => c.id === prev.bg?.id) || colors[0];
        const textExists = colors.find((c) => c.id === prev.text?.id) || colors[colors.length - 1];
        return { bg: bgExists, text: textExists };
      });
    }
  }, [colors]);

  const [deficiency, setDeficiency] = React.useState<VisionDeficiency>('none');

  const simulatedColors = React.useMemo(() => {
    return colors.map((c) => ({
      ...c,
      simHex: simulateVisionDeficiency(c.hex, deficiency),
    }));
  }, [colors, deficiency]);

  const currentBgHex = selectedPair.bg?.hex || colors[0]?.hex || '#ffffff';
  const currentTextHex = selectedPair.text?.hex || colors[colors.length - 1]?.hex || '#000000';
  const activeRatio = getContrastRatio(currentBgHex, currentTextHex);
  const activeWcag = getWcagLevel(activeRatio);

  const deficiencies: { id: VisionDeficiency; label: string; desc: string }[] = [
    { id: 'none', label: 'Normal Vision', desc: 'Standard color perception' },
    { id: 'protanopia', label: 'Protanopia', desc: 'Red-blind (~1% of males)' },
    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind (~5% of males)' },
    { id: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind (Rare)' },
    { id: 'achromatopsia', label: 'Achromatopsia', desc: 'Monochromacy / Grayscale' },
  ];

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5] text-black p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2 font-mono">
              <ShieldCheck className="w-5 h-5 text-black" />
              WCAG 2.1 Contrast Matrix & Standards
            </h2>
            <p className="text-xs text-[#666] mt-1 max-w-2xl leading-relaxed">
              Verify your design tokens meet international accessibility guidelines (AA Body: 4.5:1, AA Large: 3.0:1, AAA Enhanced: 7.0:1).
            </p>
          </div>

          {/* Color Blindness Selector */}
          <div className="flex items-center gap-2 bg-[#F5F5F5] p-2 border border-[#E5E5E5] shrink-0">
            <Eye className="w-4 h-4 text-black ml-1" />
            <select
              value={deficiency}
              onChange={(e) => setDeficiency(e.target.value as VisionDeficiency)}
              className="bg-transparent text-xs font-mono font-bold uppercase text-black focus:outline-none cursor-pointer pr-2"
            >
              {deficiencies.map((d) => (
                <option key={d.id} value={d.id} className="bg-white text-black">
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Pair Inspector & Interactive Typography Tester */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Contrast Score Card */}
          <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#999] uppercase tracking-widest">
                  Contrast Ratio
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${
                  activeWcag.aaNormal ? 'bg-black text-white border-black' : 'bg-[#F5F5F5] text-black border-[#E5E5E5]'
                }`}>
                  {activeWcag.ratingText}
                </span>
              </div>

              <div className="text-5xl font-black font-mono mt-4 text-black tracking-tight">
                {activeRatio.toFixed(2)} : 1
              </div>

              <p className="text-xs text-[#666] mt-2 font-mono">
                Bg: <span className="font-bold text-black">{currentBgHex.toUpperCase()}</span> vs Text: <span className="font-bold text-black">{currentTextHex.toUpperCase()}</span>
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 mt-6 pt-4 border-t border-[#E5E5E5] text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[#444]">AA Normal Text (≥ 4.5:1)</span>
                {activeWcag.aaNormal ? (
                  <span className="flex items-center gap-1 text-black font-bold"><Check className="w-3.5 h-3.5" /> PASS</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#888] font-bold"><X className="w-3.5 h-3.5" /> FAIL</span>
                )}
              </div>

              <div className="flex items-center justify-between font-mono">
                <span className="text-[#444]">AA Large Text (≥ 3.0:1)</span>
                {activeWcag.aaLarge ? (
                  <span className="flex items-center gap-1 text-black font-bold"><Check className="w-3.5 h-3.5" /> PASS</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#888] font-bold"><X className="w-3.5 h-3.5" /> FAIL</span>
                )}
              </div>

              <div className="flex items-center justify-between font-mono">
                <span className="text-[#444]">AAA Enhanced Text (≥ 7.0:1)</span>
                {activeWcag.aaaNormal ? (
                  <span className="flex items-center gap-1 text-black font-bold"><Check className="w-3.5 h-3.5" /> PASS</span>
                ) : (
                  <span className="flex items-center gap-1 text-[#888] font-bold"><X className="w-3.5 h-3.5" /> FAIL</span>
                )}
              </div>
            </div>
          </div>

          {/* Live Typography Preview Box */}
          <div 
            className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 border shadow-md"
            style={{ 
              backgroundColor: currentBgHex, 
              color: currentTextHex,
              borderColor: isLightColor(currentBgHex) ? '#00000020' : '#FFFFFF30'
            }}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-current font-bold">
                  Typography Sample
                </span>
                <span className="text-xs font-mono font-bold">
                  {currentTextHex.toUpperCase()} ON {currentBgHex.toUpperCase()}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black tracking-tight uppercase font-mono">
                Clarity and empathy through design.
              </h3>

              <p className="mt-3 text-sm sm:text-base opacity-90 leading-relaxed max-w-xl">
                Aesthetic excellence and web accessibility are complementary. High quality typography ensures all users experience your product seamlessly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-current/25">
              <button 
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer transition-transform active:scale-95"
                style={{ 
                  backgroundColor: currentTextHex, 
                  color: currentBgHex 
                }}
              >
                Sample Action Button
              </button>

              <span className="text-xs font-mono opacity-80 uppercase tracking-wider font-bold">
                16px Regular / 1.5 Leading
              </span>
            </div>
          </div>

        </div>

        {/* Full Contrast Cross-Matrix Grid */}
        <div className="bg-white border border-[#E5E5E5] p-6 overflow-x-auto shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-black uppercase tracking-wider font-mono">Cross-Matrix Inspector</h3>
              <p className="text-xs text-[#666]">Click any matrix intersection to test that color pair.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase">
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-black" /> AAA (≥7.0)</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#555]" /> AA (≥4.5)</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#999]" /> AA Large (≥3.0)</span>
              <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#DDD]" /> Fail (&lt;3.0)</span>
            </div>
          </div>

          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="p-3 text-left font-mono text-[#888] text-[10px] uppercase tracking-widest">
                  Bg ↓ / Text →
                </th>
                {simulatedColors.map((col) => (
                  <th key={col.id} className="p-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div 
                        className="w-5 h-5 border border-black/20" 
                        style={{ backgroundColor: col.simHex }}
                      />
                      <span className="font-mono text-[10px] text-[#666] font-bold">{col.hex.toUpperCase()}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {simulatedColors.map((bgCol) => (
                <tr key={bgCol.id} className="border-t border-[#E5E5E5]">
                  <td className="p-3 font-medium text-black">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-5 h-5 border border-black/20 shrink-0" 
                        style={{ backgroundColor: bgCol.simHex }}
                      />
                      <span className="font-mono text-xs font-bold text-black">{bgCol.name}</span>
                    </div>
                  </td>

                  {simulatedColors.map((textCol) => {
                    const isSelf = bgCol.id === textCol.id;
                    const ratio = getContrastRatio(bgCol.hex, textCol.hex);
                    const isSelected = selectedPair.bg.id === bgCol.id && selectedPair.text.id === textCol.id;

                    let badgeClass = 'bg-[#F5F5F5] text-[#888] border-[#E5E5E5]';
                    if (ratio >= 7.0) badgeClass = 'bg-black text-white border-black font-bold';
                    else if (ratio >= 4.5) badgeClass = 'bg-[#444] text-white border-[#444] font-semibold';
                    else if (ratio >= 3.0) badgeClass = 'bg-[#888] text-white border-[#888]';

                    if (isSelf) {
                      return (
                        <td key={textCol.id} className="p-2 text-center text-[#CCC] font-mono">
                          —
                        </td>
                      );
                    }

                    return (
                      <td key={textCol.id} className="p-2 text-center">
                        <button
                          onClick={() => setSelectedPair({ bg: bgCol, text: textCol })}
                          className={`w-full py-2 px-1 border font-mono text-xs transition-all cursor-pointer ${badgeClass} ${
                            isSelected ? 'ring-2 ring-black ring-offset-2 scale-105' : 'hover:scale-105'
                          }`}
                        >
                          {ratio.toFixed(1)}:1
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Color Blindness Simulation Preview Strip */}
        {deficiency !== 'none' && (
          <div className="bg-white border border-black p-6 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-black" />
              <h4 className="text-sm font-bold text-black uppercase font-mono tracking-wider">
                Simulated Perception: {deficiencies.find((d) => d.id === deficiency)?.label}
              </h4>
            </div>
            <p className="text-xs text-[#666] mb-4">
              {deficiencies.find((d) => d.id === deficiency)?.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {simulatedColors.map((c) => (
                <div key={c.id} className="p-3 bg-[#F5F5F5] border border-[#E5E5E5] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#888] uppercase tracking-widest">
                    <span>Base vs Sim</span>
                  </div>
                  <div className="flex h-10 border border-[#DDD]">
                    <div className="flex-1" style={{ backgroundColor: c.hex }} title="Original" />
                    <div className="flex-1" style={{ backgroundColor: c.simHex }} title="Simulated" />
                  </div>
                  <div className="font-mono text-xs text-black font-bold uppercase">{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

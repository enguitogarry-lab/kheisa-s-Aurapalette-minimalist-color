import React from 'react';
import { ColorItem } from '../types/palette';
import { isLightColor } from '../utils/colorUtils';
import { 
  Laptop, 
  Smartphone, 
  FileText, 
  ShoppingBag, 
  Moon, 
  Sun, 
  ArrowUpRight, 
  Play, 
  SkipForward, 
  SkipBack, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2,
  ShieldCheck,
  Star,
  Shuffle
} from 'lucide-react';

interface PreviewViewProps {
  colors: ColorItem[];
}

type PreviewLayout = 'saas' | 'mobile' | 'editorial' | 'ecommerce';

export const PreviewView: React.FC<PreviewViewProps> = ({ colors }) => {
  const [layout, setLayout] = React.useState<PreviewLayout>('saas');
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  // Role mapping
  const [roleMap, setRoleMap] = React.useState({
    bg: 0,
    surface: 1,
    primary: 2,
    accent: 3,
    text: colors.length - 1,
  });

  // Sync roleMap if color count changes
  React.useEffect(() => {
    setRoleMap({
      bg: 0 % colors.length,
      surface: 1 % colors.length,
      primary: 2 % colors.length,
      accent: 3 % colors.length,
      text: (colors.length - 1) % colors.length,
    });
  }, [colors.length]);

  const bgCol = colors[roleMap.bg]?.hex || '#ffffff';
  const surfaceCol = colors[roleMap.surface]?.hex || '#f4f4f5';
  const primaryCol = colors[roleMap.primary]?.hex || '#2563eb';
  const accentCol = colors[roleMap.accent]?.hex || '#f59e0b';
  const textCol = colors[roleMap.text]?.hex || '#09090b';

  const textOnPrimary = isLightColor(primaryCol) ? '#09090b' : '#ffffff';
  const textOnAccent = isLightColor(accentCol) ? '#09090b' : '#ffffff';
  const textOnSurface = isLightColor(surfaceCol) ? '#09090b' : '#ffffff';
  const textOnBg = isLightColor(bgCol) ? '#09090b' : '#ffffff';

  const shuffleRoles = () => {
    const indices = Array.from({ length: colors.length }, (_, i) => i).sort(() => Math.random() - 0.5);
    setRoleMap({
      bg: indices[0] % colors.length,
      surface: indices[1] % colors.length,
      primary: indices[2] % colors.length,
      accent: indices[3] % colors.length,
      text: indices[4 % colors.length] % colors.length,
    });
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5] text-black p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Control Bar for UI Preview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-4 sm:p-5">
          
          {/* Layout Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setLayout('saas')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                layout === 'saas'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#666] hover:text-black hover:bg-[#F5F5F5]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>SaaS Console</span>
            </button>

            <button
              onClick={() => setLayout('mobile')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                layout === 'mobile'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#666] hover:text-black hover:bg-[#F5F5F5]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Cards</span>
            </button>

            <button
              onClick={() => setLayout('editorial')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                layout === 'editorial'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#666] hover:text-black hover:bg-[#F5F5F5]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Bauhaus Poster</span>
            </button>

            <button
              onClick={() => setLayout('ecommerce')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                layout === 'ecommerce'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#666] hover:text-black hover:bg-[#F5F5F5]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>E-Commerce</span>
            </button>
          </div>

          {/* Quick Role Mapping & Lighting Mode */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={shuffleRoles}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border border-[#E5E5E5] transition-colors cursor-pointer"
              title="Shuffle which color acts as Primary, Surface, Background"
            >
              <Shuffle className="w-3.5 h-3.5 text-black" />
              <span>Remap Roles</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border border-[#E5E5E5] transition-colors cursor-pointer"
              title="Toggle preview frame lighting"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-black" />}
            </button>
          </div>
        </div>

        {/* Role Palette Legend Bar */}
        <div className="flex flex-wrap items-center gap-4 px-1 text-xs text-[#666]">
          <span className="font-bold uppercase tracking-widest text-[10px] text-[#999]">Applied Roles:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <div className="w-3.5 h-3.5 border border-black/20" style={{ backgroundColor: bgCol }} />
            <span>Background ({colors[roleMap.bg]?.name})</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <div className="w-3.5 h-3.5 border border-black/20" style={{ backgroundColor: surfaceCol }} />
            <span>Surface ({colors[roleMap.surface]?.name})</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <div className="w-3.5 h-3.5 border border-black/20" style={{ backgroundColor: primaryCol }} />
            <span>Primary Brand ({colors[roleMap.primary]?.name})</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <div className="w-3.5 h-3.5 border border-black/20" style={{ backgroundColor: accentCol }} />
            <span>Accent Highlight ({colors[roleMap.accent]?.name})</span>
          </div>
        </div>

        {/* Dynamic Mockup Viewport */}
        <div className="border border-[#E5E5E5] bg-white shadow-xl transition-all duration-300">
          
          {/* LAYOUT 1: SAAS DASHBOARD & LANDING HERO */}
          {layout === 'saas' && (
            <div 
              className="p-6 sm:p-12 transition-colors duration-300 min-h-[600px] flex flex-col justify-between"
              style={{ backgroundColor: isDarkMode ? '#0A0A0A' : bgCol, color: isDarkMode ? '#FFFFFF' : textOnBg }}
            >
              {/* SaaS Header Nav */}
              <div 
                className="flex items-center justify-between p-4 sm:p-5 border shadow-sm transition-all"
                style={{ 
                  backgroundColor: surfaceCol, 
                  borderColor: `${textOnSurface}25`,
                  color: textOnSurface 
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 flex items-center justify-center font-bold text-sm shadow-sm"
                    style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                  >
                    <div className="w-3 h-3 bg-current rotate-45" />
                  </div>
                  <span className="font-bold text-sm tracking-tighter uppercase font-mono">CHROMA.OS</span>
                </div>

                <div className="hidden sm:flex items-center space-x-6 text-xs font-bold uppercase tracking-widest opacity-80">
                  <span className="cursor-pointer hover:opacity-100">Architecture</span>
                  <span className="cursor-pointer hover:opacity-100">Telemetry</span>
                  <span className="cursor-pointer hover:opacity-100">Tokens</span>
                  <span className="cursor-pointer hover:opacity-100">Specs</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-sm transition-transform active:scale-95 cursor-pointer"
                    style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                  >
                    Launch Console
                  </button>
                </div>
              </div>

              {/* Hero Banner Section */}
              <div className="my-10 max-w-3xl">
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 border"
                  style={{ 
                    backgroundColor: `${accentCol}20`, 
                    color: isLightColor(bgCol) ? '#000000' : accentCol,
                    borderColor: `${accentCol}60` 
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Geometric Balance Theme Specification</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase">
                  Structured interfaces that balance form and purpose.
                </h1>

                <p className="mt-4 text-sm sm:text-base opacity-85 max-w-xl leading-relaxed">
                  Calibrated luminance scales, mathematical contrast ratios, and direct design token synchronizations.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button 
                    className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
                    style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                  >
                    <span>Start Free Trial</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button 
                    className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest border transition-colors cursor-pointer"
                    style={{ 
                      backgroundColor: surfaceCol, 
                      borderColor: `${textOnSurface}30`,
                      color: textOnSurface 
                    }}
                  >
                    Documentation
                  </button>
                </div>
              </div>

              {/* Dashboard Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  className="p-6 border shadow-sm transition-all"
                  style={{ 
                    backgroundColor: surfaceCol, 
                    borderColor: `${textOnSurface}20`,
                    color: textOnSurface 
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                    <span>Active Telemetry</span>
                    <TrendingUp className="w-4 h-4" style={{ color: primaryCol }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold mt-2 tracking-tight">
                    128,490
                  </div>
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: primaryCol }}>
                    +24.8% vs last cycle
                  </div>
                </div>

                <div 
                  className="p-6 border shadow-sm transition-all"
                  style={{ 
                    backgroundColor: surfaceCol, 
                    borderColor: `${textOnSurface}20`,
                    color: textOnSurface 
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                    <span>Contrast Compliance</span>
                    <ShieldCheck className="w-4 h-4" style={{ color: accentCol }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold mt-2 tracking-tight">
                    99.4%
                  </div>
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-wider font-bold" style={{ color: accentCol }}>
                    WCAG AAA Verified
                  </div>
                </div>

                <div 
                  className="p-6 border shadow-sm transition-all"
                  style={{ 
                    backgroundColor: surfaceCol, 
                    borderColor: `${textOnSurface}20`,
                    color: textOnSurface 
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-70">
                    <span>Synchronized Tokens</span>
                    <CheckCircle2 className="w-4 h-4" style={{ color: primaryCol }} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold mt-2 tracking-tight">
                    64 Tokens
                  </div>
                  <div className="mt-2 text-[10px] font-mono uppercase tracking-wider opacity-70">
                    Figma / Tailwind / JSON
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* LAYOUT 2: MOBILE APP CARDS */}
          {layout === 'mobile' && (
            <div 
              className="p-6 sm:p-12 transition-colors duration-300 min-h-[600px] flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? '#0A0A0A' : bgCol }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                
                {/* Mobile Phone Mockup: Music Player */}
                <div 
                  className="w-full max-w-sm mx-auto p-6 border shadow-2xl flex flex-col justify-between aspect-[9/16]"
                  style={{ 
                    backgroundColor: surfaceCol, 
                    borderColor: `${textOnSurface}25`,
                    color: textOnSurface 
                  }}
                >
                  {/* Status bar */}
                  <div className="flex justify-between items-center text-xs font-mono font-bold opacity-60">
                    <span>09:41</span>
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-current rotate-45" />
                      <div className="w-2 h-2 bg-current" />
                    </div>
                  </div>

                  {/* Album Cover Art */}
                  <div 
                    className="w-full aspect-square my-6 flex flex-col items-center justify-center p-6 shadow-md relative overflow-hidden"
                    style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                  >
                    <div className="w-12 h-12 border-2 border-current rotate-45 mb-4 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 -rotate-45" />
                    </div>
                    <span className="text-xs uppercase font-mono tracking-widest font-bold">
                      Harmonic Balance
                    </span>
                  </div>

                  {/* Song Title & Heart */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-base tracking-tight uppercase font-mono">Nordic Drift</h3>
                        <p className="text-xs uppercase tracking-widest opacity-70">Chroma Ensemble</p>
                      </div>
                      <button 
                        className="p-2 transition-colors cursor-pointer"
                        style={{ backgroundColor: `${accentCol}25`, color: accentCol }}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Progress Slider */}
                    <div className="mt-4 space-y-1.5">
                      <div className="w-full h-1 bg-black/10">
                        <div 
                          className="h-full"
                          style={{ width: '68%', backgroundColor: primaryCol }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono opacity-60 font-bold">
                        <span>02:45</span>
                        <span>-01:18</span>
                      </div>
                    </div>

                    {/* Player Controls */}
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <button className="p-2 opacity-70 hover:opacity-100 cursor-pointer">
                        <SkipBack className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-3.5 shadow-lg transition-transform active:scale-90 cursor-pointer"
                        style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                      >
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </button>
                      <button className="p-2 opacity-70 hover:opacity-100 cursor-pointer">
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Phone Mockup: Habit / Focus Widget */}
                <div 
                  className="w-full max-w-sm mx-auto p-6 border shadow-2xl flex flex-col justify-between aspect-[9/16]"
                  style={{ 
                    backgroundColor: surfaceCol, 
                    borderColor: `${textOnSurface}25`,
                    color: textOnSurface 
                  }}
                >
                  <div className="flex justify-between items-center text-xs font-mono font-bold opacity-60">
                    <span>09:41</span>
                    <span className="uppercase tracking-widest">CHROMA.GRID</span>
                  </div>

                  <div className="my-auto space-y-4">
                    <div 
                      className="p-6 shadow-sm"
                      style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold opacity-80">
                        Daily Metric
                      </span>
                      <h4 className="text-xl font-black mt-1 uppercase font-mono">Deep Focus</h4>
                      <div className="mt-4 flex items-center justify-between text-xs font-mono font-bold">
                        <span>4.5 Hours Logged</span>
                        <span>90% Complete</span>
                      </div>
                    </div>

                    {/* Streak Item */}
                    <div 
                      className="p-4 border flex items-center justify-between"
                      style={{ borderColor: `${textOnSurface}25`, backgroundColor: `${accentCol}15` }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 flex items-center justify-center font-bold font-mono"
                          style={{ backgroundColor: accentCol, color: textOnAccent }}
                        >
                          14
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">Day Streak</div>
                          <div className="text-[10px] opacity-70 font-mono">Active Sprint</div>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold font-mono" style={{ color: accentCol }}>
                        +250 XP
                      </span>
                    </div>

                    {/* Action Item */}
                    <button 
                      className="w-full py-3.5 font-bold text-xs uppercase tracking-widest shadow-md transition-transform active:scale-95 cursor-pointer"
                      style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                    >
                      Resume Session
                    </button>
                  </div>

                  <div className="text-center text-[10px] opacity-50 font-mono uppercase tracking-widest font-bold">
                    AuraPalette Mobile Specs
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* LAYOUT 3: EDITORIAL SWISS & BAUHAUS POSTER */}
          {layout === 'editorial' && (
            <div 
              className="p-8 sm:p-16 transition-colors duration-300 min-h-[600px] flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: bgCol, color: textOnBg }}
            >
              {/* Swiss Layout Grid Line */}
              <div className="flex items-start justify-between border-b-2 pb-6" style={{ borderColor: primaryCol }}>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest block font-bold">
                    Nr. 04 / Typographic Studies
                  </span>
                  <h2 className="text-4xl sm:text-7xl font-black tracking-tighter uppercase mt-2">
                    Form Follows Function
                  </h2>
                </div>
                <div 
                  className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center font-mono font-black text-2xl shadow-inner shrink-0"
                  style={{ backgroundColor: accentCol, color: textOnAccent }}
                >
                  84
                </div>
              </div>

              {/* Center Asymmetric Shapes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10 items-center">
                <div 
                  className="h-48 p-6 flex flex-col justify-between border"
                  style={{ backgroundColor: primaryCol, color: textOnPrimary, borderColor: `${textOnPrimary}30` }}
                >
                  <span className="font-mono text-xs uppercase font-bold tracking-widest">Contrast & Space</span>
                  <p className="text-sm font-medium leading-snug">
                    "Color is a power which directly influences the soul." — Wassily Kandinsky
                  </p>
                </div>

                <div 
                  className="h-48 p-6 flex flex-col justify-between border"
                  style={{ backgroundColor: surfaceCol, color: textOnSurface, borderColor: `${textOnSurface}30` }}
                >
                  <span className="font-mono text-xs uppercase font-bold tracking-widest">Golden Ratio</span>
                  <div className="text-3xl font-black font-mono">1.618</div>
                  <p className="text-xs opacity-70 font-mono">Calculated luminance distribution.</p>
                </div>

                <div 
                  className="h-48 p-6 flex flex-col justify-between border"
                  style={{ backgroundColor: accentCol, color: textOnAccent, borderColor: `${textOnAccent}30` }}
                >
                  <span className="font-mono text-xs uppercase font-bold tracking-widest">Primary Accent</span>
                  <p className="text-sm font-bold">
                    Aesthetic balance achieved through calibrated chroma saturation.
                  </p>
                </div>
              </div>

              {/* Bottom Swiss Specs */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t font-mono text-xs opacity-70 font-bold uppercase tracking-widest" style={{ borderColor: `${textOnBg}30` }}>
                <span>GRID: 12-COLUMN ASYMMETRIC</span>
                <span>TYPEFACE: HELVETICA NEUE / GEIST</span>
                <span>PALETTE HARMONY: VERIFIED</span>
              </div>
            </div>
          )}

          {/* LAYOUT 4: E-COMMERCE PRODUCT CARD */}
          {layout === 'ecommerce' && (
            <div 
              className="p-6 sm:p-12 transition-colors duration-300 min-h-[600px] flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? '#0A0A0A' : bgCol }}
            >
              <div 
                className="max-w-md w-full p-6 sm:p-8 border shadow-2xl transition-all"
                style={{ 
                  backgroundColor: surfaceCol, 
                  borderColor: `${textOnSurface}25`,
                  color: textOnSurface 
                }}
              >
                {/* Product Image Stage */}
                <div 
                  className="w-full aspect-[4/3] relative overflow-hidden flex items-center justify-center p-8 shadow-inner border"
                  style={{ backgroundColor: bgCol, borderColor: `${textOnSurface}20` }}
                >
                  <div 
                    className="w-32 h-32 rotate-12 shadow-2xl flex items-center justify-center transition-transform hover:rotate-0 duration-300"
                    style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                  >
                    <div className="w-12 h-12 border-2 border-current rotate-45" />
                  </div>

                  <span 
                    className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest"
                    style={{ backgroundColor: accentCol, color: textOnAccent }}
                  >
                    New Season
                  </span>
                </div>

                {/* Product Info */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider opacity-60 font-bold">
                      Studio Nordique
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold" style={{ color: accentCol }}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.9 (128 reviews)</span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black mt-1 tracking-tight uppercase font-mono">
                    København Minimalist Ceramic
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm opacity-80 leading-relaxed">
                    Handcrafted stoneware featuring calibrated matte glazes that accent any architectural living space.
                  </p>

                  {/* Swatch Picker on Product Card */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Colorways:</span>
                    <div className="flex items-center gap-1.5">
                      {colors.slice(0, 5).map((c, i) => (
                        <div 
                          key={c.id} 
                          className={`w-5 h-5 border cursor-pointer transition-transform hover:scale-110 ${
                            i === 2 ? 'ring-2 ring-black ring-offset-2' : 'border-black/20'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-6 pt-4 border-t flex items-center justify-between gap-4" style={{ borderColor: `${textOnSurface}20` }}>
                    <div>
                      <span className="text-[9px] font-mono uppercase opacity-60 block font-bold tracking-widest">Price</span>
                      <span className="text-2xl font-bold font-mono">$185.00</span>
                    </div>

                    <button 
                      className="px-6 py-3 font-bold text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
                      style={{ backgroundColor: primaryCol, color: textOnPrimary }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

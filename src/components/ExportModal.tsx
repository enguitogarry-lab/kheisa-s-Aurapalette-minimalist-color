import React, { useState } from 'react';
import { ColorItem } from '../types/palette';
import { generateExportCode, isLightColor } from '../utils/colorUtils';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  FileJson, 
  FileImage, 
  Code 
} from 'lucide-react';

interface ExportModalProps {
  colors: ColorItem[];
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
}

type ExportType = 'tailwind' | 'css' | 'scss' | 'json' | 'svg' | 'swift' | 'png';

export const ExportModal: React.FC<ExportModalProps> = ({
  colors,
  isOpen,
  onClose,
  onCopy,
}) => {
  if (!isOpen) return null;

  const [activeType, setActiveType] = useState<ExportType>('tailwind');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const exportCode = activeType !== 'png' ? generateExportCode(colors, activeType as any) : '';

  const handleCopyCode = () => {
    onCopy(exportCode, `${activeType.toUpperCase()} Code`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const handleDownloadFile = () => {
    if (activeType === 'png') {
      downloadPngCard();
      return;
    }

    let extension = 'txt';
    let mimeType = 'text/plain';

    switch (activeType) {
      case 'tailwind':
      case 'swift':
        extension = activeType === 'swift' ? 'swift' : 'js';
        break;
      case 'css':
        extension = 'css';
        mimeType = 'text/css';
        break;
      case 'scss':
        extension = 'scss';
        break;
      case 'json':
        extension = 'json';
        mimeType = 'application/json';
        break;
      case 'svg':
        extension = 'svg';
        mimeType = 'image/svg+xml';
        break;
    }

    const blob = new Blob([exportCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chroma-palette-theme.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPngCard = () => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Architectural White canvas background
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, width, height);

    // Inner White Card
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 40, width - 80, height - 80);

    // Header text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('CHROMA.GRID // THEME SPECIFICATION', 80, 105);

    ctx.fillStyle = '#888888';
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('GEOMETRIC BALANCE COLOR PALETTE', 80, 135);

    // Swatches strip
    const startX = 80;
    const startY = 170;
    const totalWidth = width - 160;
    const cardHeight = 340;
    const swatchW = totalWidth / colors.length;

    colors.forEach((c, idx) => {
      const x = startX + idx * swatchW;
      
      // Color fill
      ctx.fillStyle = c.hex;
      ctx.fillRect(x, startY, swatchW, cardHeight);

      // Contrast text
      const isLight = isLightColor(c.hex);
      ctx.fillStyle = isLight ? '#000000' : '#FFFFFF';

      // HEX Label
      ctx.font = 'bold 22px monospace';
      ctx.fillText(c.hex.toUpperCase(), x + 20, startY + cardHeight - 65);

      // Color Name
      ctx.font = 'bold 14px monospace';
      ctx.fillText(c.name.toUpperCase(), x + 20, startY + cardHeight - 35);
    });

    // Branding in corner
    ctx.fillStyle = '#888888';
    ctx.font = '12px monospace';
    ctx.fillText('Generated with CHROMA.GRID — AuraPalette', 80, height - 60);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'chroma-grid-palette.png';
    a.click();
  };

  const tabs: { id: ExportType; label: string; icon: React.ReactNode }[] = [
    { id: 'tailwind', label: 'Tailwind CSS', icon: <FileCode className="w-4 h-4" /> },
    { id: 'css', label: 'CSS Variables', icon: <Code className="w-4 h-4" /> },
    { id: 'scss', label: 'SCSS / Sass', icon: <FileCode className="w-4 h-4" /> },
    { id: 'json', label: 'JSON Tokens', icon: <FileJson className="w-4 h-4" /> },
    { id: 'svg', label: 'SVG Vector', icon: <FileImage className="w-4 h-4" /> },
    { id: 'swift', label: 'SwiftUI', icon: <Code className="w-4 h-4" /> },
    { id: 'png', label: 'PNG Image Card', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-black w-full max-w-2xl shadow-2xl overflow-hidden text-black flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-lg font-black text-black uppercase font-mono tracking-tight flex items-center gap-2">
              <Download className="w-5 h-5 text-black" />
              Export Design Tokens
            </h2>
            <p className="text-xs text-[#666] mt-0.5">
              Production-ready multi-format theme configurations for your codebase.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#F5F5F5] text-[#666] hover:text-black hover:bg-[#EAEAEA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Row */}
        <div className="flex items-center gap-1.5 px-6 pt-4 overflow-x-auto no-scrollbar border-b border-[#E5E5E5] pb-3">
          {tabs.map((tab) => {
            const isActive = activeType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-[#666] hover:text-black hover:bg-[#F5F5F5]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Swatch Mini Strip */}
          <div className="h-10 flex border border-black/20 shadow-inner">
            {colors.map((c) => (
              <div
                key={c.id}
                className="flex-1 flex items-center justify-center text-[10px] font-mono font-bold"
                style={{ backgroundColor: c.hex, color: isLightColor(c.hex) ? '#000' : '#fff' }}
              >
                {c.hex.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Code Viewer or PNG Preview */}
          {activeType === 'png' ? (
            <div className="bg-[#F5F5F5] p-6 border border-[#E5E5E5] text-center space-y-4">
              <div className="max-w-md mx-auto aspect-[16/9] border border-black p-4 bg-white flex flex-col justify-between shadow-lg">
                <div className="text-left">
                  <div className="text-sm font-black uppercase font-mono text-black">CHROMA.GRID Theme Spec</div>
                  <div className="text-[10px] text-[#888] font-mono">1200 x 630 PNG Card</div>
                </div>
                <div className="flex h-20 my-auto border border-[#E5E5E5]">
                  {colors.map((c) => (
                    <div key={c.id} className="flex-1" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
                <div className="text-right text-[10px] font-mono text-[#888] uppercase">Geometric Balance</div>
              </div>
              <p className="text-xs text-[#666]">
                Exports a high-resolution 1200x630 swatch card ready for presentations and portfolios.
              </p>
            </div>
          ) : (
            <div className="relative">
              <pre className="p-4 bg-[#111111] text-[#EEEEEE] font-mono text-xs overflow-x-auto max-h-72 leading-relaxed border border-black">
                <code>{exportCode}</code>
              </pre>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-between gap-3">
          <span className="text-xs text-[#888] font-mono font-bold uppercase">
            {colors.length} Active Tokens
          </span>

          <div className="flex items-center gap-2">
            {activeType !== 'png' && (
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border border-[#E5E5E5] transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
              </button>
            )}

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{activeType === 'png' ? 'Download PNG Card' : 'Download File'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

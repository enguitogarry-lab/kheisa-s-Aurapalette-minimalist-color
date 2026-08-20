import React, { useState } from 'react';
import { ColorItem } from '../types/palette';
import { isLightColor } from '../utils/colorUtils';
import { X, Copy, Check, Share2, Link as LinkIcon, Code } from 'lucide-react';

interface ShareModalProps {
  colors: ColorItem[];
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  colors,
  isOpen,
  onClose,
  onCopy,
}) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Encode colors into URL hash parameter
  const hexHash = colors.map((c) => c.hex.replace('#', '')).join('-');
  const shareUrl = `${window.location.origin}${window.location.pathname}#colors=${hexHash}`;
  const embedIframe = `<iframe src="${shareUrl}" width="800" height="400" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    onCopy(shareUrl, 'Shareable URL');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  const handleCopyEmbed = () => {
    onCopy(embedIframe, 'Embed Code');
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-black w-full max-w-lg shadow-2xl overflow-hidden text-black flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-black" />
            <div>
              <h2 className="text-base font-black text-black uppercase font-mono tracking-tight">Share Palette Link</h2>
              <p className="text-xs text-[#666]">Permanent URL hash link containing all color definitions.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#F5F5F5] text-[#666] hover:text-black hover:bg-[#EAEAEA] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Swatch Mini Strip */}
          <div className="h-12 flex border border-black/20 shadow-inner">
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

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#999] uppercase tracking-widest flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-black" />
              Direct URL Permalink
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-mono text-black focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 shadow-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Embed Snippet */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#999] uppercase tracking-widest flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-black" />
              Embed Widget Code
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={embedIframe}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-mono text-[#666] focus:outline-none select-all"
              />
              <button
                onClick={handleCopyEmbed}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border border-[#E5E5E5] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmbed ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E5E5E5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

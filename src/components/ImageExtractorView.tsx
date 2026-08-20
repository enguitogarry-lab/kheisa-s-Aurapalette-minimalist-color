import React, { useRef, useState, useEffect } from 'react';
import chroma from 'chroma-js';
import { ColorItem } from '../types/palette';
import { extractColorsFromImage, generateId, isLightColor } from '../utils/colorUtils';
import { getColorName } from '../utils/colorNames';
import { 
  UploadCloud, 
  Pipette, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Image as ImageIcon,
  Plus
} from 'lucide-react';

interface ImageExtractorViewProps {
  onApplyExtracted: (colors: ColorItem[]) => void;
  onAddSingleColor: (color: ColorItem) => void;
  onCopy: (text: string, label: string) => void;
}

interface InspirationPhoto {
  id: string;
  title: string;
  category: string;
  url: string;
}

const INSPIRATION_PHOTOS: InspirationPhoto[] = [
  {
    id: 'scandi-interior',
    title: 'Nordic Architectural Loft',
    category: 'Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'kyoto-zen',
    title: 'Kyoto Bamboo Sanctuary',
    category: 'Botanical',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'tokyo-cyber',
    title: 'Shinjuku Neon Twilight',
    category: 'Cyberpunk',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'desert-dunes',
    title: 'Mojave Desert Golden Hour',
    category: 'Nature',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'bauhaus-abstract',
    title: 'Minimalist Color Block Mural',
    category: 'Art & Design',
    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'mediterranean-coast',
    title: 'Amalfi Coast Azure & Terracotta',
    category: 'Coastal',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
  },
];

export const ImageExtractorView: React.FC<ImageExtractorViewProps> = ({
  onApplyExtracted,
  onAddSingleColor,
  onCopy,
}) => {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(INSPIRATION_PHOTOS[0].url);
  const [extractedHexes, setExtractedHexes] = useState<string[]>([]);
  const [pickedColor, setPickedColor] = useState<{ hex: string; name: string; x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Process image extraction when image source changes
  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = currentImageSrc;

    img.onload = () => {
      imageElementRef.current = img;
      renderImageToCanvas(img);
      const colors = extractColorsFromImage(img, 5);
      setExtractedHexes(colors);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setExtractedHexes(['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']);
    };
  }, [currentImageSrc]);

  const renderImageToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxWidth = 800;
    const maxHeight = 450;
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;

    const ratio = Math.min(maxWidth / w, maxHeight / h);
    canvas.width = w * ratio;
    canvas.height = h * ratio;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = chroma(pixel[0], pixel[1], pixel[2]).hex().toLowerCase();
      setPickedColor({
        hex,
        name: getColorName(hex),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleCanvasClick = () => {
    if (pickedColor) {
      onCopy(pickedColor.hex.toUpperCase(), pickedColor.name);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyToMainGenerator = () => {
    const newItems: ColorItem[] = extractedHexes.map((hex, idx) => ({
      id: generateId(),
      hex: hex.toLowerCase(),
      name: getColorName(hex),
      isLocked: false,
      role: idx === 0 ? 'background' : idx === 1 ? 'surface' : idx === 2 ? 'primary' : idx === 3 ? 'secondary' : 'accent',
    }));
    onApplyExtracted(newItems);
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-[#F5F5F5] text-black p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2 font-mono">
              <ImageIcon className="w-5 h-5 text-black" />
              Image Tone Extraction & Eyedropper
            </h2>
            <p className="text-xs text-[#666] mt-1 max-w-2xl">
              Extract cohesive palettes from any photo using clustering algorithms, or click anywhere on the image with the interactive pipette.
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Preset Photo Grid */}
        <div>
          <label className="text-xs font-bold text-[#999] uppercase tracking-widest block mb-2">
            Inspiration Presets:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {INSPIRATION_PHOTOS.map((photo) => {
              const isSelected = currentImageSrc === photo.url;
              return (
                <button
                  key={photo.id}
                  onClick={() => setCurrentImageSrc(photo.url)}
                  className={`group relative overflow-hidden aspect-[4/3] border text-left transition-all cursor-pointer ${
                    isSelected ? 'border-black ring-2 ring-black scale-[1.02]' : 'border-[#E5E5E5] hover:border-black'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                    <span className="text-[10px] font-bold text-white leading-tight line-clamp-1 uppercase font-mono">{photo.title}</span>
                    <span className="text-[9px] text-[#CCC] font-mono">{photo.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Canvas & Eyedropper Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Canvas Image Container */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="lg:col-span-2 bg-white border border-[#E5E5E5] p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px] shadow-sm"
          >
            <div className="relative cursor-crosshair inline-block overflow-hidden shadow-lg border border-[#E5E5E5]">
              <canvas
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setPickedColor(null);
                }}
                onClick={handleCanvasClick}
                className="max-w-full h-auto block"
              />

              {/* Floating Magnifier / Pipette Tooltip */}
              {isHovering && pickedColor && (
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 z-30 flex flex-col items-center"
                  style={{ left: pickedColor.x, top: pickedColor.y }}
                >
                  <div className="bg-black text-white border border-black p-2 shadow-2xl flex items-center gap-2 text-xs">
                    <div 
                      className="w-6 h-6 border border-white"
                      style={{ backgroundColor: pickedColor.hex }}
                    />
                    <div>
                      <div className="font-mono font-bold text-white text-[11px]">{pickedColor.hex.toUpperCase()}</div>
                      <div className="text-[9px] uppercase tracking-wider text-[#AAA]">{pickedColor.name}</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-black transform rotate-45 -mt-1" />
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#666]">
              <Pipette className="w-3.5 h-3.5 text-black" />
              <span>Click on any pixel to copy tone or inspect</span>
            </div>
          </div>

          {/* Extracted Swatches & Actions Panel */}
          <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between space-y-6 shadow-sm">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-black uppercase font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  Dominant Palette
                </h3>
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-black" />}
              </div>
              <p className="text-xs text-[#666] mb-4">
                5 balanced tones clustered from highlights, shadows, and midtones.
              </p>

              {/* Swatch List */}
              <div className="space-y-2">
                {extractedHexes.map((hex, idx) => {
                  const name = getColorName(hex);
                  const isLight = isLightColor(hex);
                  return (
                    <div
                      key={idx}
                      onClick={() => onCopy(hex.toUpperCase(), name)}
                      className="p-3.5 flex items-center justify-between border border-black/10 shadow-sm transition-transform hover:scale-[1.01] cursor-pointer group"
                      style={{ backgroundColor: hex }}
                    >
                      <div className={isLight ? 'text-black' : 'text-white'}>
                        <div className="font-mono font-bold text-sm tracking-tight">{hex.toUpperCase()}</div>
                        <div className="text-xs uppercase tracking-widest font-semibold opacity-80">{name}</div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddSingleColor({
                              id: generateId(),
                              hex: hex.toLowerCase(),
                              name,
                              isLocked: false,
                              role: idx === 2 ? 'primary' : 'neutral',
                            });
                          }}
                          className={`p-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                            isLight ? 'bg-black text-white' : 'bg-white text-black'
                          }`}
                          title="Add to current workspace"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
              {pickedColor && (
                <button
                  onClick={() => {
                    onAddSingleColor({
                      id: generateId(),
                      hex: pickedColor.hex,
                      name: pickedColor.name,
                      isLocked: false,
                      role: 'accent',
                    });
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-widest bg-[#F5F5F5] hover:bg-[#EAEAEA] text-black border border-[#E5E5E5] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Picked ({pickedColor.hex.toUpperCase()})</span>
                </button>
              )}

              <button
                onClick={applyToMainGenerator}
                className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-zinc-800 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <span>Apply Extracted Theme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

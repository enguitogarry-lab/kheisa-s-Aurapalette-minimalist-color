import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ColorItem, HarmonyType, ActiveTab, ColorFormat, Palette } from './types/palette';
import { generatePalette, generateId } from './utils/colorUtils';
import { getColorName } from './utils/colorNames';
import { CURATED_PALETTES } from './data/curatedPalettes';

import { Header } from './components/Header';
import { GeneratorView } from './components/GeneratorView';
import { PreviewView } from './components/PreviewView';
import { ContrastMatrixView } from './components/ContrastMatrixView';
import { ImageExtractorView } from './components/ImageExtractorView';
import { CuratedLibraryView } from './components/CuratedLibraryView';
import { GradientStudioView } from './components/GradientStudioView';

import { ColorInspectorModal } from './components/ColorInspectorModal';
import { ExportModal } from './components/ExportModal';
import { ShareModal } from './components/ShareModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { Toast } from './components/Toast';

// Geometric Balance default palette
const INITIAL_PALETTE: ColorItem[] = [
  { id: '1', hex: '#264653', name: 'Charcoal Blue', isLocked: false, role: 'background' },
  { id: '2', hex: '#2a9d8f', name: 'Persian Green', isLocked: false, role: 'surface' },
  { id: '3', hex: '#e9c46a', name: 'Saffron Ochre', isLocked: false, role: 'primary' },
  { id: '4', hex: '#f4a261', name: 'Sandy Peach', isLocked: false, role: 'accent' },
  { id: '5', hex: '#e76f51', name: 'Burnt Sienna', isLocked: false, role: 'text' },
];

export default function App() {
  const [colors, setColors] = useState<ColorItem[]>(INITIAL_PALETTE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [harmony, setHarmony] = useState<HarmonyType>('aesthetic');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');

  // Modals & Drawers state
  const [inspectorColor, setInspectorColor] = useState<ColorItem | null>(null);
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [shareOpen, setShareOpen] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(false);

  // History & Favorites
  const [history, setHistory] = useState<Palette[]>([]);
  const [favorites, setFavorites] = useState<Palette[]>(() => {
    try {
      const saved = localStorage.getItem('aurapalette_favorites');
      return saved ? JSON.parse(saved) : [CURATED_PALETTES[0], CURATED_PALETTES[1]];
    } catch {
      return [CURATED_PALETTES[0]];
    }
  });

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; submessage?: string } | null>(null);

  const showToast = (message: string, submessage?: string) => {
    setToast({ message, submessage });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurapalette_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Parse URL hash for shared palettes on load
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('colors=')) {
        const hexStr = hash.split('colors=')[1];
        if (hexStr) {
          const hexParts = hexStr.split('-');
          if (hexParts.length >= 2) {
            const parsedColors: ColorItem[] = hexParts.map((h, idx) => {
              const fullHex = h.startsWith('#') ? h : `#${h}`;
              return {
                id: generateId(),
                hex: fullHex.toLowerCase(),
                name: getColorName(fullHex),
                isLocked: false,
                role: idx === 0 ? 'background' : idx === 1 ? 'surface' : idx === 2 ? 'primary' : idx === 3 ? 'accent' : 'text',
              };
            });
            setColors(parsedColors);
            showToast('Loaded shared theme from URL!', `${parsedColors.length} swatches imported`);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update hash when colors change (optional smooth sync)
  const syncUrlHash = (currentColors: ColorItem[]) => {
    const hash = currentColors.map((c) => c.hex.replace('#', '')).join('-');
    window.history.replaceState(null, '', `#colors=${hash}`);
  };

  // Core Generate function
  const handleGenerate = useCallback(() => {
    setColors((prev) => {
      const nextColors = generatePalette(prev.length, harmony, prev);
      
      // Push to session history
      const newHistoryItem: Palette = {
        id: generateId(),
        title: `${nextColors[2]?.name || 'Theme'} Grid`,
        colors: nextColors,
        tags: [harmony],
        createdAt: Date.now(),
      };

      setHistory((prevHistory) => [newHistoryItem, ...prevHistory.slice(0, 29)]);
      syncUrlHash(nextColors);
      return nextColors;
    });
  }, [harmony]);

  // Keyboard shortcut listener (Spacebar, L, E, S, H)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleGenerate();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setColors((prev) => {
          const allLocked = prev.every((c) => c.isLocked);
          return prev.map((c) => ({ ...c, isLocked: !allLocked }));
        });
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setExportOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGenerate]);

  // Copy to clipboard with toast
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label}`, text);
  };

  // Swatch manipulation
  const handleAddColor = () => {
    if (colors.length >= 8) return;
    const newColor: ColorItem = {
      id: generateId(),
      hex: '#e2e8f0',
      name: getColorName('#e2e8f0'),
      isLocked: false,
      role: 'neutral',
    };
    const updated = [...colors, newColor];
    setColors(updated);
    syncUrlHash(updated);
  };

  const handleRemoveColor = (id: string) => {
    if (colors.length <= 3) return;
    const updated = colors.filter((c) => c.id !== id);
    setColors(updated);
    syncUrlHash(updated);
  };

  const handleUpdateColors = (updated: ColorItem[]) => {
    setColors(updated);
    syncUrlHash(updated);
  };

  const handleApplyNewPalette = (newColors: ColorItem[]) => {
    setColors(newColors);
    syncUrlHash(newColors);
    setActiveTab('generator');
    showToast('Theme applied to workspace');
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.8 },
      colors: newColors.map((c) => c.hex),
    });
  };

  const handleAddSingleColor = (color: ColorItem) => {
    if (colors.length >= 8) {
      // Replace last unlocked color
      const lastUnlockedIdx = colors.map((c, i) => ({ ...c, idx: i })).reverse().find((c) => !c.isLocked)?.idx;
      if (lastUnlockedIdx !== undefined) {
        const next = [...colors];
        next[lastUnlockedIdx] = color;
        setColors(next);
        syncUrlHash(next);
        showToast(`Added ${color.name} to palette`);
        return;
      }
      showToast('Maximum 8 swatches reached');
      return;
    }
    const updated = [...colors, color];
    setColors(updated);
    syncUrlHash(updated);
    showToast(`Added ${color.name} to palette`, color.hex.toUpperCase());
  };

  const handleToggleFavorite = (palette: Palette) => {
    const exists = favorites.some((f) => f.id === palette.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== palette.id));
      showToast('Removed from favorites', palette.title);
    } else {
      setFavorites([palette, ...favorites]);
      showToast('Saved to favorites', palette.title);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-black flex flex-col font-sans selection:bg-black selection:text-white">
      
      {/* Geometric Balance Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        harmony={harmony}
        setHarmony={setHarmony}
        colorFormat={colorFormat}
        setColorFormat={setColorFormat}
        onGenerate={handleGenerate}
        onOpenExport={() => setExportOpen(true)}
        onOpenShare={() => setShareOpen(true)}
        onToggleHistory={() => setHistoryOpen(!historyOpen)}
        onToggleFavorites={() => setFavoritesOpen(!favoritesOpen)}
        historyCount={history.length}
        favoritesCount={favorites.length}
      />

      {/* Main Active Tab Viewport */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'generator' && (
          <GeneratorView
            colors={colors}
            colorFormat={colorFormat}
            onGenerate={handleGenerate}
            onUpdateColors={handleUpdateColors}
            onOpenInspector={(col) => setInspectorColor(col)}
            onCopy={handleCopy}
            onAddColor={handleAddColor}
            onRemoveColor={handleRemoveColor}
          />
        )}

        {activeTab === 'preview' && (
          <PreviewView colors={colors} />
        )}

        {activeTab === 'contrast' && (
          <ContrastMatrixView colors={colors} />
        )}

        {activeTab === 'extractor' && (
          <ImageExtractorView
            onApplyExtracted={handleApplyNewPalette}
            onAddSingleColor={handleAddSingleColor}
            onCopy={handleCopy}
          />
        )}

        {activeTab === 'library' && (
          <CuratedLibraryView
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onApplyPalette={handleApplyNewPalette}
            onCopy={handleCopy}
          />
        )}

        {activeTab === 'gradients' && (
          <GradientStudioView colors={colors} onCopy={handleCopy} />
        )}
      </main>

      {/* Modals & Drawers */}
      <ColorInspectorModal
        color={inspectorColor}
        isOpen={Boolean(inspectorColor)}
        onClose={() => setInspectorColor(null)}
        onUpdateColor={(updated) => {
          setColors((prev) => {
            const next = prev.map((c) => (c.id === updated.id ? updated : c));
            syncUrlHash(next);
            return next;
          });
          setInspectorColor(updated);
        }}
        onCopy={handleCopy}
      />

      <ExportModal
        colors={colors}
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        onCopy={handleCopy}
      />

      <ShareModal
        colors={colors}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onCopy={handleCopy}
      />

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onApplyPalette={handleApplyNewPalette}
        onClearHistory={() => setHistory([])}
      />

      <FavoritesDrawer
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        onApplyPalette={handleApplyNewPalette}
        onRemoveFavorite={(id) => setFavorites(favorites.filter((f) => f.id !== id))}
        onCopy={handleCopy}
      />

      {/* Sleek Toast Feedback */}
      <Toast message={toast?.message || null} submessage={toast?.submessage} />

    </div>
  );
}

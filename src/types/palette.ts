export type HarmonyType =
  | 'random'
  | 'aesthetic'
  | 'analogous'
  | 'monochromatic'
  | 'triadic'
  | 'complementary'
  | 'split-complementary'
  | 'warm-editorial'
  | 'nordic-minimal'
  | 'cyberpunk-neon'
  | 'earthy-botanical'
  | 'pastel-dream'
  | 'luxury-noir'
  | 'japanese-wabi'
  | 'sunset-dusk'
  | 'swiss-bauhaus';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'oklch';

export type VisionDeficiency =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export interface ColorItem {
  id: string;
  hex: string;
  name: string;
  isLocked: boolean;
  role?: 'primary' | 'secondary' | 'accent' | 'background' | 'surface' | 'neutral' | 'text';
}

export interface Palette {
  id: string;
  title: string;
  description?: string;
  colors: ColorItem[];
  tags: string[];
  createdAt: number;
  harmonyType?: HarmonyType;
  isFavorite?: boolean;
}

export type ActiveTab = 
  | 'generator' 
  | 'preview' 
  | 'contrast' 
  | 'extractor' 
  | 'library' 
  | 'gradients';

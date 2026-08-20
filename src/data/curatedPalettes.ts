import { Palette } from '../types/palette';
import { getColorName } from '../utils/colorNames';

interface RawCurated {
  id: string;
  title: string;
  description: string;
  hexes: string[];
  tags: string[];
  likes: number;
}

const RAW_PALETTES: RawCurated[] = [
  {
    id: 'nordic-mist',
    title: 'Nordic Mist & Pine',
    description: 'Crisp scandinavian minimalism blending deep spruce with cool porcelain tones.',
    hexes: ['#0f172a', '#1e3a5f', '#476a6f', '#a3c1ad', '#f4f7f6'],
    tags: ['Minimal', 'Nordic', 'Cool', 'Architecture'],
    likes: 342,
  },
  {
    id: 'editorial-terracotta',
    title: 'Editorial Terracotta',
    description: 'High-end magazine aesthetic with sunbaked earth, toasted ochre, and warm alabaster.',
    hexes: ['#2b1810', '#6e3826', '#c96a4b', '#e2a37f', '#faf4ee'],
    tags: ['Editorial', 'Warm', 'Earthy', 'Branding'],
    likes: 519,
  },
  {
    id: 'tokyo-cyber-night',
    title: 'Tokyo Cyber Night',
    description: 'High contrast electric neon palette for cutting-edge web & dark mode apps.',
    hexes: ['#09090b', '#7928ca', '#ff0080', '#00dfd8', '#f4f4f5'],
    tags: ['Cyberpunk', 'Neon', 'Dark Mode', 'Tech'],
    likes: 488,
  },
  {
    id: 'matcha-atelier',
    title: 'Matcha & Oat Atelier',
    description: 'Gentle botanical greens paired with soothing oat milk creams.',
    hexes: ['#1c2826', '#3e5c46', '#709775', '#c2d8b9', '#f7f6f0'],
    tags: ['Botanical', 'Soft', 'Minimal', 'Wellness'],
    likes: 412,
  },
  {
    id: 'swiss-bauhaus',
    title: 'Swiss Bauhaus 1928',
    description: 'Bold iconic primary trio balanced by sharp anthracite and pure paper white.',
    hexes: ['#121212', '#e63946', '#1d3557', '#fcbf49', '#f8f9fa'],
    tags: ['Bauhaus', 'Graphic', 'Classic', 'Poster'],
    likes: 380,
  },
  {
    id: 'obsidian-champagne',
    title: 'Obsidian & Champagne',
    description: 'Ultra-luxurious dark theme with metallic gold and velvet shadows.',
    hexes: ['#0a0a0c', '#1f1e24', '#7c6843', '#d4af37', '#fdfbf7'],
    tags: ['Luxury', 'Dark Mode', 'Gold', 'Fashion'],
    likes: 620,
  },
  {
    id: 'sunset-in-malibu',
    title: 'Sunset in Malibu',
    description: 'Radiant twilight gradient with violet dusk, amber glow, and peach horizon.',
    hexes: ['#1e1b4b', '#6b21a8', '#db2777', '#f97316', '#ffedd5'],
    tags: ['Gradient', 'Warm', 'Vibrant', 'Social'],
    likes: 531,
  },
  {
    id: 'kyoto-wabi-sabi',
    title: 'Kyoto Wabi-Sabi',
    description: 'Subtle, understated neutrals inspired by weathered wood and stone gardens.',
    hexes: ['#282624', '#57524d', '#8a8279', '#c4bcb3', '#eee9e0'],
    tags: ['Japanese', 'Minimal', 'Neutral', 'Organic'],
    likes: 298,
  },
  {
    id: 'pastel-sorbet-cloud',
    title: 'Pastel Sorbet Cloud',
    description: 'Dreamy confectionary palette with periwinkle, lilac, and cotton candy hues.',
    hexes: ['#2d2b55', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#fffffc'],
    tags: ['Pastel', 'Playful', 'Soft', 'GenZ'],
    likes: 375,
  },
  {
    id: 'mediterranean-coast',
    title: 'Mediterranean Coast',
    description: 'Deep cobalt sea, sunlit terracotta walls, and warm olive leaves.',
    hexes: ['#0f3057', '#00587a', '#008891', '#e7e7de', '#ee6c4d'],
    tags: ['Coastal', 'Fresh', 'Travel', 'Vibrant'],
    likes: 310,
  },
  {
    id: 'desert-dune-resort',
    title: 'Desert Dune Sanctuary',
    description: 'Warm sandy gradients and sunlit sage brush tones for modern interiors.',
    hexes: ['#292524', '#78716c', '#b45309', '#d97706', '#fef3c7'],
    tags: ['Earthy', 'Warm', 'Interior', 'Editorial'],
    likes: 265,
  },
  {
    id: 'neo-brutalist-punch',
    title: 'Neo-Brutalist Punch',
    description: 'High energy lime, ultra blue, and pitch black borders for loud modern apps.',
    hexes: ['#000000', '#2563eb', '#a3e635', '#f43f5e', '#ffffff'],
    tags: ['Brutalist', 'Bold', 'Modern', 'UI Kit'],
    likes: 440,
  },
  {
    id: 'monochrome-slate',
    title: 'Monochrome Slate Spec',
    description: 'Pure tonal precision with perfectly balanced lightness increments.',
    hexes: ['#09090b', '#27272a', '#52525b', '#a1a1aa', '#fafafa'],
    tags: ['Monochrome', 'Minimal', 'SaaS', 'Clean'],
    likes: 492,
  },
  {
    id: 'copenhagen-studio',
    title: 'Copenhagen Studio',
    description: 'Cobalt pop against muted warm stone, birch veneer, and chalk whites.',
    hexes: ['#18181b', '#2563eb', '#a8a29e', '#e7e5e4', '#fafaf9'],
    tags: ['Scandinavian', 'Minimal', 'Editorial', 'Product'],
    likes: 389,
  },
  {
    id: 'vintage-polaroid-84',
    title: 'Vintage Polaroid 1984',
    description: 'Faded film tones with warm cyan, burnt mustard, and sepia shadows.',
    hexes: ['#1f2421', '#216869', '#49a078', '#9cc5a1', '#dce1e3'],
    tags: ['Vintage', 'Film', 'Muted', 'Retro'],
    likes: 320,
  },
  {
    id: 'aurora-borealis',
    title: 'Aurora Borealis',
    description: 'Nocturnal arctic sky with deep teal, glowing emerald, and ice violet.',
    hexes: ['#050814', '#0d324d', '#148386', '#79e7a9', '#f0fff4'],
    tags: ['Nature', 'Gradient', 'Dark', 'Vibrant'],
    likes: 410,
  },
];

export const CURATED_PALETTES: Palette[] = RAW_PALETTES.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  tags: item.tags,
  createdAt: Date.now() - Math.floor(Math.random() * 10000000),
  likes: item.likes,
  colors: item.hexes.map((hex, idx) => ({
    id: `c-${item.id}-${idx}`,
    hex: hex.toLowerCase(),
    name: getColorName(hex),
    isLocked: false,
    role: idx === 0 ? 'background' : idx === 1 ? 'surface' : idx === 2 ? 'primary' : idx === 3 ? 'secondary' : 'accent',
  })),
}));

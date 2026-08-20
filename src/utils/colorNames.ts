// Curated designer color name dictionary for quick and aesthetic naming
interface NamedColor {
  hex: string;
  name: string;
}

export const COLOR_NAMES: NamedColor[] = [
  // Neutrals & Whites
  { hex: '#ffffff', name: 'Pure White' },
  { hex: '#fafafa', name: 'Alabaster' },
  { hex: '#f8fafc', name: 'Ghost White' },
  { hex: '#f4f4f5', name: 'Paper White' },
  { hex: '#f1f5f9', name: 'Porcelain' },
  { hex: '#e2e8f0', name: 'Morning Mist' },
  { hex: '#cbd5e1', name: 'Pebble Gray' },
  { hex: '#94a3b8', name: 'Slate Fog' },
  { hex: '#64748b', name: 'Cool Slate' },
  { hex: '#475569', name: 'Graphite' },
  { hex: '#334155', name: 'Charcoal Smoke' },
  { hex: '#1e293b', name: 'Deep Slate' },
  { hex: '#0f172a', name: 'Midnight Navy' },
  { hex: '#000000', name: 'Absolute Black' },
  { hex: '#121212', name: 'Obsidian Velvet' },
  { hex: '#18181b', name: 'Onyx Dark' },
  { hex: '#27272a', name: 'Carbon Black' },
  { hex: '#3f3f46', name: 'Anthracite' },
  { hex: '#71717a', name: 'Zinc Ash' },
  { hex: '#a1a1aa', name: 'Silver Sand' },
  { hex: '#d4d4d8', name: 'Platinum Frost' },

  // Warm Neutrals & Earthy Tones
  { hex: '#fdfbf7', name: 'Linen Cream' },
  { hex: '#fbf7ee', name: 'Rice Paper' },
  { hex: '#f7f1e5', name: 'Warm Oatmeal' },
  { hex: '#ede4d3', name: 'Sandstone' },
  { hex: '#d9cdb8', name: 'Desert Dune' },
  { hex: '#c8b69b', name: 'Weathered Oak' },
  { hex: '#a69076', name: 'Khaki Clay' },
  { hex: '#80684f', name: 'Raw Umber' },
  { hex: '#544230', name: 'Roasted Espresso' },
  { hex: '#2e2116', name: 'Smoked Walnut' },
  { hex: '#3d2b1f', name: 'Bistre Brown' },
  { hex: '#7b3f00', name: 'Cinnamon Bark' },
  { hex: '#a0522d', name: 'Sienna Clay' },
  { hex: '#c17a52', name: 'Terracotta Hearth' },
  { hex: '#d98b68', name: 'Desert Coral' },
  { hex: '#e8a588', name: 'Peach Clay' },
  { hex: '#f7d6c8', name: 'Tuscan Blush' },

  // Reds & Pinks
  { hex: '#ef4444', name: 'Crimson Radiant' },
  { hex: '#dc2626', name: 'Vibrant Scarlet' },
  { hex: '#b91c1c', name: 'Cardinal Red' },
  { hex: '#991b1b', name: 'Ruby Wine' },
  { hex: '#7f1d1d', name: 'Burgundy Shadow' },
  { hex: '#450a0a', name: 'Black Cherry' },
  { hex: '#f43f5e', name: 'Rose Petal' },
  { hex: '#e11d48', name: 'Wild Raspberry' },
  { hex: '#be123c', name: 'Cranberry Velvet' },
  { hex: '#fb7185', name: 'Coral Rose' },
  { hex: '#fda4af', name: 'Ballet Pink' },
  { hex: '#ffe4e6', name: 'Blush Frost' },
  { hex: '#ec4899', name: 'Hot Dahlia' },
  { hex: '#db2777', name: 'Electric Berry' },
  { hex: '#be185d', name: 'Magenta Silk' },
  { hex: '#f472b6', name: 'Candy Orchid' },
  { hex: '#fbcfe8', name: 'Soft Peony' },

  // Oranges & Warm Ambers
  { hex: '#f97316', name: 'Tangerine Sunset' },
  { hex: '#ea580c', name: 'Burnt Persimmon' },
  { hex: '#c2410c', name: 'Rust Ochre' },
  { hex: '#9a3412', name: 'Spice Mahogany' },
  { hex: '#fb923c', name: 'Golden Apricot' },
  { hex: '#fdba74', name: 'Warm Marmalade' },
  { hex: '#fed7aa', name: 'Cantaloupe Cream' },
  { hex: '#ffedd5', name: 'Bisque Glow' },

  // Yellows & Gold
  { hex: '#eab308', name: 'Saffron Gold' },
  { hex: '#ca8a04', name: 'Mustard Velvet' },
  { hex: '#a16207', name: 'Antique Brass' },
  { hex: '#713f12', name: 'Bronze Amber' },
  { hex: '#facc15', name: 'Sunlight Bloom' },
  { hex: '#fde047', name: 'Daffodil' },
  { hex: '#fef08a', name: 'Lemon Custard' },
  { hex: '#fef9c3', name: 'Buttercream' },
  { hex: '#f59e0b', name: 'Amber Honey' },
  { hex: '#d97706', name: 'Goldenrod' },
  { hex: '#b45309', name: 'Warm Topaz' },

  // Greens & Botanicals
  { hex: '#22c55e', name: 'Fresh Meadow' },
  { hex: '#16a34a', name: 'Emerald Forest' },
  { hex: '#15803d', name: 'Clover Leaf' },
  { hex: '#166534', name: 'Deep Pine' },
  { hex: '#14532d', name: 'Evergreen Night' },
  { hex: '#4ade80', name: 'Spring Pistachio' },
  { hex: '#86efac', name: 'Mint Sprout' },
  { hex: '#bbf7d0', name: 'Dewy Sage' },
  { hex: '#dcfce7', name: 'Matcha Foam' },
  { hex: '#10b981', name: 'Jade Coast' },
  { hex: '#059669', name: 'Malachite' },
  { hex: '#047857', name: 'Botanical Teal' },
  { hex: '#065f46', name: 'Nordic Spruce' },
  { hex: '#064e3b', name: 'Dark Rainforest' },
  { hex: '#34d399', name: 'Seafoam Mint' },
  { hex: '#6ee7b7', name: 'Celadon Jade' },
  { hex: '#84cc16', name: 'Lime Zest' },
  { hex: '#65a30d', name: 'Olive Grove' },
  { hex: '#4d7c0f', name: 'Moss Stone' },
  { hex: '#3f6212', name: 'Deep Olive' },
  { hex: '#a3e635', name: 'Chartreuse Sun' },
  { hex: '#bef264', name: 'Wasabi Glaze' },
  { hex: '#8ba888', name: 'Muted Sage' },
  { hex: '#5b7065', name: 'Eucalyptus Leaf' },
  { hex: '#384d48', name: 'Forest Shadow' },
  { hex: '#c5d8cd', name: 'Faded Tea' },

  // Cyans & Teals
  { hex: '#06b6d4', name: 'Cyan Oasis' },
  { hex: '#0891b2', name: 'Aegean Teal' },
  { hex: '#0e7490', name: 'Deep Lagoon' },
  { hex: '#155e75', name: 'Nordic Fjord' },
  { hex: '#164e63', name: 'Abyssal Blue' },
  { hex: '#22d3ee', name: 'Aqua Shimmer' },
  { hex: '#67e8f9', name: 'Glacial Ice' },
  { hex: '#a5f3fc', name: 'Crystal Stream' },
  { hex: '#cffafe', name: 'Vapor Wave' },
  { hex: '#14b8a6', name: 'Turquoise Jewel' },
  { hex: '#0d9488', name: 'Oceanic Depth' },
  { hex: '#0f766e', name: 'Bermuda Pine' },
  { hex: '#115e59', name: 'Midnight Cypress' },
  { hex: '#2dd4bf', name: 'Sea Glass' },
  { hex: '#5eead4', name: 'Pale Aquamarine' },

  // Blues & Indigos
  { hex: '#3b82f6', name: 'Azure Horizon' },
  { hex: '#2563eb', name: 'Royal Sapphire' },
  { hex: '#1d4ed8', name: 'Cobalt Velvet' },
  { hex: '#1e40af', name: 'Deep Ultramarine' },
  { hex: '#1e3a8a', name: 'Midnight Harbor' },
  { hex: '#172554', name: 'Cosmic Void' },
  { hex: '#60a5fa', name: 'Sky Cerulean' },
  { hex: '#93c5fd', name: 'Summer Sky' },
  { hex: '#bfdbfe', name: 'Cornflower Foam' },
  { hex: '#dbeafe', name: 'Arctic Whisper' },
  { hex: '#6366f1', name: 'Electric Indigo' },
  { hex: '#4f46e5', name: 'Iris Blossom' },
  { hex: '#4338ca', name: 'Night Violet' },
  { hex: '#3730a3', name: 'Deep Twilight' },
  { hex: '#312e81', name: 'Space Indigo' },
  { hex: '#818cf8', name: 'Periwinkle Dream' },
  { hex: '#a5b4fc', name: 'Lavender Mist' },
  { hex: '#c7d2fe', name: 'Cloud Periwinkle' },

  // Purples & Violets
  { hex: '#8b5cf6', name: 'Vibrant Amethyst' },
  { hex: '#7c3aed', name: 'Imperial Violet' },
  { hex: '#6d28d9', name: 'Royal Purple' },
  { hex: '#5b21b6', name: 'Deep Plum' },
  { hex: '#4c1d95', name: 'Midnight Velvet' },
  { hex: '#2e1065', name: 'Dark Nebula' },
  { hex: '#a78bfa', name: 'Soft Lilac' },
  { hex: '#c4b5fd', name: 'Thistle Bloom' },
  { hex: '#ddd6fe', name: 'Heather Silk' },
  { hex: '#ede9fe', name: 'Wisteria Breeze' },
  { hex: '#a855f7', name: 'Neon Orchid' },
  { hex: '#9333ea', name: 'Purple Mirage' },
  { hex: '#7e22ce', name: 'Deep Mulberry' },
  { hex: '#6b21a8', name: 'Blackcurrant' },
  { hex: '#c084fc', name: 'Pastel Iris' },
  { hex: '#d8b4fe', name: 'Moonlit Lavender' },
  { hex: '#d946ef', name: 'Fuchsia Glow' },
  { hex: '#c026d3', name: 'Vivid Magenta' },
  { hex: '#a21caf', name: 'Dark Dahlia' },
  { hex: '#86198f', name: 'Wine Velvet' },
  { hex: '#e879f9', name: 'Orchid Blossom' },
  { hex: '#f0abfc', name: 'Cotton Candy' },

  // Editorial & Signature Tones
  { hex: '#2a9d8f', name: 'Persian Green' },
  { hex: '#e76f51', name: 'Burnt Sienna' },
  { hex: '#f4a261', name: 'Sandy Ochre' },
  { hex: '#e9c46a', name: 'Sunlit Brass' },
  { hex: '#264653', name: 'Charcoal Lagoon' },
  { hex: '#e63946', name: 'Imperial Crimson' },
  { hex: '#f1faee', name: 'Honeydew Silk' },
  { hex: '#a8dadc', name: 'Glacier Blue' },
  { hex: '#457b9d', name: 'Steel Cerulean' },
  { hex: '#1d3557', name: 'Prussian Blue' },
  { hex: '#003049', name: 'Deep Prussian' },
  { hex: '#d62828', name: 'Rich Venetian' },
  { hex: '#f77f00', name: 'Amber Sunrise' },
  { hex: '#fcbf49', name: 'Tuscan Ochre' },
  { hex: '#eae2b7', name: 'Vanilla Custard' },
  { hex: '#5f0f40', name: 'Blackberry Tart' },
  { hex: '#9a031e', name: 'Vintage Ruby' },
  { hex: '#fb8b24', name: 'Marigold Spark' },
  { hex: '#e36414', name: 'Spiced Terracotta' },
  { hex: '#0f4c5c', name: 'Deep Beryl' },
  { hex: '#3d5a80', name: 'Washed Denim' },
  { hex: '#98c1d9', name: 'Powder Blue' },
  { hex: '#e0fbfc', name: 'Ice Water' },
  { hex: '#ee6c4d', name: 'Burnished Coral' },
  { hex: '#293241', name: 'Gunmetal Slate' }
];

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex.length === 3 
    ? cleanHex.split('').map(c => c + c).join('') 
    : cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

export function getColorName(hex: string): string {
  try {
    const [r1, g1, b1] = hexToRgb(hex);
    let minDistance = Infinity;
    let closestName = 'Custom Shade';

    for (const item of COLOR_NAMES) {
      const [r2, g2, b2] = hexToRgb(item.hex);
      // Weighted Euclidean distance for human perception
      const rmean = (r1 + r2) / 2;
      const r = r1 - r2;
      const g = g1 - g2;
      const b = b1 - b2;
      const distance = Math.sqrt(
        (((512 + rmean) * r * r) >> 8) +
        4 * g * g +
        (((767 - rmean) * b * b) >> 8)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestName = item.name;
      }
    }

    return closestName;
  } catch {
    return 'Custom Color';
  }
}

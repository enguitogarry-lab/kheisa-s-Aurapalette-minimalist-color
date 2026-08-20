import chroma from 'chroma-js';
import { ColorItem, ColorFormat, HarmonyType, VisionDeficiency } from '../types/palette';
import { getColorName } from './colorNames';

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Convert HEX to various formats
export function formatColor(hex: string, format: ColorFormat): string {
  try {
    const c = chroma(hex);
    switch (format) {
      case 'hex':
        return hex.toUpperCase();
      case 'rgb': {
        const [r, g, b] = c.rgb();
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      }
      case 'hsl': {
        const [h, s, l] = c.hsl();
        return `hsl(${isNaN(h) ? 0 : Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }
      case 'cmyk': {
        const [cVal, mVal, yVal, kVal] = c.cmyk();
        return `cmyk(${Math.round(cVal * 100)}%, ${Math.round(mVal * 100)}%, ${Math.round(yVal * 100)}%, ${Math.round(kVal * 100)}%)`;
      }
      case 'oklch': {
        const [l, chromaVal, h] = c.oklch();
        return `oklch(${Math.round(l * 100)}% ${chromaVal.toFixed(3)} ${isNaN(h) ? 0 : Math.round(h)})`;
      }
      default:
        return hex.toUpperCase();
    }
  } catch {
    return hex.toUpperCase();
  }
}

// Determine if a color is light or dark (for text contrast on swatch)
export function isLightColor(hex: string): boolean {
  try {
    return chroma(hex).luminance() > 0.45;
  } catch {
    return true;
  }
}

// Calculate WCAG 2.1 Contrast Ratio between two colors
export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const lum1 = chroma(hex1).luminance();
    const lum2 = chroma(hex2).luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  } catch {
    return 1;
  }
}

// WCAG Compliance level
export function getWcagLevel(ratio: number): {
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  ratingText: string;
} {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
    ratingText: ratio >= 7 ? 'AAA (Great)' : ratio >= 4.5 ? 'AA (Good)' : ratio >= 3.0 ? 'AA Large' : 'Fail (Low)',
  };
}

// Generate 10-step tints & shades scale for a given color
export function generateShadeScale(hex: string): { step: number; hex: string; isBase: boolean }[] {
  try {
    const base = chroma(hex);
    // Create scale from light tint (95% lightness) to dark shade (10% lightness)
    const scale = chroma.scale(['#ffffff', base, '#000000'])
      .domain([0, 0.5, 1])
      .mode('lab');

    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const points = [0.08, 0.16, 0.26, 0.36, 0.44, 0.50, 0.60, 0.70, 0.80, 0.88, 0.94];

    return steps.map((step, idx) => {
      const isBase = step === 500;
      const stepHex = isBase ? hex : scale(points[idx]).hex();
      return { step, hex: stepHex, isBase };
    });
  } catch {
    return [{ step: 500, hex, isBase: true }];
  }
}

// Simulate Color Blindness (Brettel & Machado matrices approximation)
export function simulateVisionDeficiency(hex: string, type: VisionDeficiency): string {
  if (type === 'none') return hex;
  try {
    const [r, g, b] = chroma(hex).rgb();
    
    let rSim = r, gSim = g, bSim = b;

    switch (type) {
      case 'protanopia': // Red-blind
        rSim = 0.56667 * r + 0.43333 * g + 0.0 * b;
        gSim = 0.55833 * r + 0.44167 * g + 0.0 * b;
        bSim = 0.0 * r + 0.24167 * g + 0.75833 * b;
        break;
      case 'deuteranopia': // Green-blind
        rSim = 0.625 * r + 0.375 * g + 0.0 * b;
        gSim = 0.700 * r + 0.300 * g + 0.0 * b;
        bSim = 0.0 * r + 0.300 * g + 0.700 * b;
        break;
      case 'tritanopia': // Blue-blind
        rSim = 0.95 * r + 0.05 * g + 0.0 * b;
        gSim = 0.0 * r + 0.43333 * g + 0.56667 * b;
        bSim = 0.0 * r + 0.475 * g + 0.525 * b;
        break;
      case 'achromatopsia': // Monochromacy / Grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        rSim = gray;
        gSim = gray;
        bSim = gray;
        break;
    }

    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
    return chroma(clamp(rSim), clamp(gSim), clamp(bSim)).hex();
  } catch {
    return hex;
  }
}

// Generate an aesthetically tuned single color
function generateHarmoniousColor(baseHue: number, satRange: [number, number], lightRange: [number, number]): string {
  const hue = (baseHue + 360) % 360;
  const sat = satRange[0] + Math.random() * (satRange[1] - satRange[0]);
  const light = lightRange[0] + Math.random() * (lightRange[1] - lightRange[0]);
  return chroma.hsl(hue, sat, light).hex();
}

// Core intelligent color generation engine
export function generatePalette(
  count: number = 5,
  harmony: HarmonyType = 'aesthetic',
  existingColors: ColorItem[] = []
): ColorItem[] {
  const result: ColorItem[] = [];
  const baseHue = Math.floor(Math.random() * 360);

  // Generate target hex values based on chosen harmony rule
  const generatedHexes: string[] = [];

  switch (harmony) {
    case 'aesthetic': {
      // Modern designer harmony: 1 light background, 1 dark accent, 1 primary vibrant, 1 soft secondary, 1 neutral muted
      const primaryHue = baseHue;
      const accentHue = (baseHue + 180 + (Math.random() * 40 - 20)) % 360;
      const secondaryHue = (baseHue + 35 + (Math.random() * 20 - 10)) % 360;
      
      const colors = [
        generateHarmoniousColor(primaryHue, [0.05, 0.15], [0.94, 0.98]), // Clean bright background / linen
        generateHarmoniousColor(secondaryHue, [0.25, 0.45], [0.70, 0.85]), // Soft pastel tone
        generateHarmoniousColor(primaryHue, [0.65, 0.85], [0.45, 0.60]), // Core vibrant brand color
        generateHarmoniousColor(accentHue, [0.55, 0.80], [0.50, 0.65]), // Complementary pop accent
        generateHarmoniousColor(primaryHue + 20, [0.15, 0.35], [0.12, 0.22]), // Deep obsidian / dark anchor
      ];
      generatedHexes.push(...colors);
      break;
    }

    case 'analogous': {
      // 30-40 degrees spread
      const step = 25;
      for (let i = 0; i < count; i++) {
        const h = (baseHue + (i - Math.floor(count / 2)) * step + 360) % 360;
        const s = 0.35 + (i % 2) * 0.35;
        const l = 0.25 + (i / (count - 1)) * 0.55;
        generatedHexes.push(chroma.hsl(h, s, l).hex());
      }
      break;
    }

    case 'monochromatic': {
      // Same hue, varying saturation and lightness
      for (let i = 0; i < count; i++) {
        const s = 0.25 + (i % 3) * 0.25;
        const l = 0.15 + (i / (count - 1)) * 0.72;
        generatedHexes.push(chroma.hsl(baseHue, s, l).hex());
      }
      break;
    }

    case 'triadic': {
      // 120 degrees apart
      const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      for (let i = 0; i < count; i++) {
        const h = hues[i % 3];
        const s = 0.45 + (i % 2) * 0.35;
        const l = 0.30 + (i / count) * 0.50;
        generatedHexes.push(chroma.hsl(h, s, l).hex());
      }
      break;
    }

    case 'complementary': {
      // Opposite hues
      const oppHue = (baseHue + 180) % 360;
      for (let i = 0; i < count; i++) {
        const h = i % 2 === 0 ? baseHue : oppHue;
        const s = 0.40 + (i * 0.1);
        const l = 0.20 + (i / (count - 1)) * 0.65;
        generatedHexes.push(chroma.hsl(h, s, l).hex());
      }
      break;
    }

    case 'split-complementary': {
      const hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360];
      for (let i = 0; i < count; i++) {
        const h = hues[i % 3];
        const s = 0.45 + Math.random() * 0.35;
        const l = 0.25 + (i / count) * 0.55;
        generatedHexes.push(chroma.hsl(h, s, l).hex());
      }
      break;
    }

    case 'warm-editorial': {
      // Terracotta, Ochre, Sand, Warm Charcoal, Cream
      const warmHues = [25, 40, 15, 35, 10];
      const warmPalettes = [
        ['#2b2118', '#634832', '#c17a52', '#e8b288', '#fbf5ed'],
        ['#1c1917', '#44403c', '#d97706', '#f59e0b', '#fef3c7'],
        ['#31111d', '#782a3b', '#c25953', '#e8a598', '#fcf6f5'],
        ['#1e293b', '#0f766e', '#f59e0b', '#fbbf24', '#f8fafc'],
        ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
      ];
      const chosen = warmPalettes[Math.floor(Math.random() * warmPalettes.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'nordic-minimal': {
      // Ice blues, slate, pine, crisp fog, mist
      const nordicSets = [
        ['#0f172a', '#334155', '#64748b', '#cbd5e1', '#f8fafc'],
        ['#1e293b', '#2e4c48', '#5b8276', '#a4c2b7', '#f1f7f5'],
        ['#13222e', '#29435c', '#537d99', '#a2c2d6', '#f0f6fa'],
        ['#191919', '#3e4444', '#829399', '#d0d7d9', '#ffffff'],
      ];
      const chosen = nordicSets[Math.floor(Math.random() * nordicSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'cyberpunk-neon': {
      // Electric pink, cyan, purple, lime, deep carbon
      const cyberSets = [
        ['#09090b', '#7928ca', '#ff0080', '#00dfd8', '#f4f4f5'],
        ['#0d0221', '#0f084b', '#26408b', '#a6cfd5', '#c2e7d9'],
        ['#050505', '#ff0055', '#00f0ff', '#ffe600', '#ffffff'],
        ['#120e29', '#8a2be2', '#00ffff', '#ff1493', '#39ff14'],
      ];
      const chosen = cyberSets[Math.floor(Math.random() * cyberSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'earthy-botanical': {
      // Forest deep, sage, eucalyptus, moss, linen
      const botanicalSets = [
        ['#1c2826', '#496f5d', '#86a873', '#bbdbb4', '#f3f7f0'],
        ['#14281d', '#355834', '#6e885b', '#c2b89b', '#f5f3e9'],
        ['#20322b', '#3d5a49', '#7f9f80', '#d8e2dc', '#ffe5d9'],
        ['#283618', '#606c38', '#dda15e', '#bc6c25', '#fefae0'],
      ];
      const chosen = botanicalSets[Math.floor(Math.random() * botanicalSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'pastel-dream': {
      const pastelSets = [
        ['#3d3b4f', '#b8b8d1', '#ffc6ff', '#bdb2ff', '#a0c4ff'],
        ['#2b2d42', '#ffd6ff', '#e7c6ff', '#c8b6ff', '#b8c0ff'],
        ['#4a4e69', '#f28482', '#f5cac3', '#84a59d', '#f7ede2'],
        ['#545b62', '#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d'],
      ];
      const chosen = pastelSets[Math.floor(Math.random() * pastelSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'luxury-noir': {
      const noirSets = [
        ['#0a0a0a', '#171717', '#c6a85b', '#e6cf8b', '#fafafa'],
        ['#0d0d0d', '#262626', '#9a7b56', '#d4af37', '#ffffff'],
        ['#111827', '#1f2937', '#9333ea', '#e9d5ff', '#ffffff'],
        ['#000000', '#1c1917', '#854d0e', '#ca8a04', '#fef08a'],
      ];
      const chosen = noirSets[Math.floor(Math.random() * noirSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'japanese-wabi': {
      const wabiSets = [
        ['#2c2a29', '#5c544e', '#8c827a', '#c7bfb5', '#ede8e1'],
        ['#24201d', '#594a42', '#997b66', '#d8b18a', '#f5ebe0'],
        ['#2b2d2f', '#4e5d59', '#8a9a86', '#cbd2c0', '#f4f6f0'],
        ['#362b28', '#634b46', '#a1786c', '#dfb2a9', '#faeae6'],
      ];
      const chosen = wabiSets[Math.floor(Math.random() * wabiSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'sunset-dusk': {
      const sunsetSets = [
        ['#1d1135', '#401e52', '#762857', '#b53f5a', '#f77f00'],
        ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000'],
        ['#2b1055', '#7597de', '#f5b041', '#eb5757', '#ffffff'],
        ['#140152', '#22007c', '#49117c', '#8c0068', '#ff4365'],
      ];
      const chosen = sunsetSets[Math.floor(Math.random() * sunsetSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'swiss-bauhaus': {
      const bauhausSets = [
        ['#121212', '#d90429', '#00509d', '#ffb703', '#f8f9fa'],
        ['#000000', '#e63946', '#1d3557', '#f1faee', '#a8dadc'],
        ['#1a1a1a', '#e63946', '#fcbf49', '#2a9d8f', '#f4f1de'],
        ['#101010', '#eb3b5a', '#2d98da', '#f7b731', '#f5f6fa'],
      ];
      const chosen = bauhausSets[Math.floor(Math.random() * bauhausSets.length)];
      generatedHexes.push(...chosen);
      break;
    }

    case 'random':
    default: {
      for (let i = 0; i < count; i++) {
        const randHue = Math.floor(Math.random() * 360);
        const randSat = 0.35 + Math.random() * 0.55;
        const randLight = 0.15 + (i / count) * 0.7;
        generatedHexes.push(chroma.hsl(randHue, randSat, randLight).hex());
      }
      break;
    }
  }

  // Adjust count if needed
  while (generatedHexes.length < count) {
    const h = (baseHue + generatedHexes.length * 45) % 360;
    generatedHexes.push(chroma.hsl(h, 0.6, 0.5).hex());
  }

  // Merge with existing locked colors
  for (let i = 0; i < count; i++) {
    const existing = existingColors[i];
    if (existing && existing.isLocked) {
      result.push(existing);
    } else {
      const hex = generatedHexes[i % generatedHexes.length].toLowerCase();
      result.push({
        id: existing ? existing.id : generateId(),
        hex,
        name: getColorName(hex),
        isLocked: false,
        role: getSuggestedRole(i, count),
      });
    }
  }

  return result;
}

// Assign suggested design token roles to palette colors
export function getSuggestedRole(index: number, total: number): ColorItem['role'] {
  if (total === 5) {
    const roles: ColorItem['role'][] = ['background', 'surface', 'primary', 'secondary', 'accent'];
    return roles[index] || 'neutral';
  }
  if (index === 0) return 'background';
  if (index === 1) return 'surface';
  if (index === 2) return 'primary';
  if (index === 3) return 'accent';
  return 'neutral';
}

// Extract dominant colors from an Image Element using HTML5 canvas sampling & k-means clustering
export function extractColorsFromImage(imgElement: HTMLImageElement, colorCount: number = 5): string[] {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

    // Resize for high-performance sampling
    const maxDim = 150;
    let width = imgElement.naturalWidth || imgElement.width || 300;
    let height = imgElement.naturalHeight || imgElement.height || 300;

    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(imgElement, 0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height).data;
    const pixelSamples: [number, number, number][] = [];

    // Sample pixels with stride
    for (let i = 0; i < imgData.length; i += 16) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      const a = imgData[i + 3];

      // Skip fully transparent or near extreme blowout
      if (a < 128) continue;
      pixelSamples.push([r, g, b]);
    }

    if (pixelSamples.length === 0) {
      return ['#1e293b', '#3b82f6', '#10b981', '#f59e0b', '#f8fafc'];
    }

    // Simple k-means clustering to pick distinct color centroids
    const centroids: [number, number, number][] = [];
    // Seed centroids spread across sample
    const step = Math.floor(pixelSamples.length / colorCount);
    for (let k = 0; k < colorCount; k++) {
      centroids.push([...pixelSamples[k * step]]);
    }

    // 4 iterations of K-means
    for (let iter = 0; iter < 4; iter++) {
      const clusters: [number, number, number][][] = Array.from({ length: colorCount }, () => []);
      
      for (const p of pixelSamples) {
        let minDist = Infinity;
        let bestCluster = 0;
        for (let c = 0; c < centroids.length; c++) {
          const cr = centroids[c];
          const dist = (p[0] - cr[0]) ** 2 + (p[1] - cr[1]) ** 2 + (p[2] - cr[2]) ** 2;
          if (dist < minDist) {
            minDist = dist;
            bestCluster = c;
          }
        }
        clusters[bestCluster].push(p);
      }

      // Update centroids
      for (let c = 0; c < centroids.length; c++) {
        if (clusters[c].length > 0) {
          const sum = clusters[c].reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1], acc[2] + val[2]], [0, 0, 0]);
          centroids[c] = [
            Math.round(sum[0] / clusters[c].length),
            Math.round(sum[1] / clusters[c].length),
            Math.round(sum[2] / clusters[c].length)
          ];
        }
      }
    }

    // Sort extracted colors by luminance for elegant palette ordering
    const hexColors = centroids.map(c => chroma(c[0], c[1], c[2]).hex());
    return hexColors.sort((a, b) => chroma(a).luminance() - chroma(b).luminance());
  } catch (err) {
    console.error('Extraction error:', err);
    return ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];
  }
}

// Generate Export Snippets
export function generateExportCode(palette: ColorItem[], format: 'css' | 'tailwind' | 'scss' | 'json' | 'svg' | 'swift'): string {
  const sanitize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  switch (format) {
    case 'css': {
      const vars = palette.map((c, i) => `  --color-${sanitize(c.name || `swatch-${i + 1}`)}: ${c.hex.toUpperCase()};`).join('\n');
      return `/* AuraPalette Theme CSS Variables */\n:root {\n${vars}\n}`;
    }

    case 'tailwind': {
      const entries = palette.map((c, i) => `        '${sanitize(c.name || `tone-${i + 1}`)}': '${c.hex.toUpperCase()}',`).join('\n');
      return `// tailwind.config.js / tailwind.config.ts\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries}\n      }\n    }\n  }\n};`;
    }

    case 'scss': {
      return palette.map((c, i) => `$color-${sanitize(c.name || `tone-${i + 1}`)}: ${c.hex.toUpperCase()};`).join('\n');
    }

    case 'json': {
      const obj = {
        name: 'AuraPalette Export',
        version: '1.0',
        tokens: palette.reduce((acc, c, i) => {
          acc[sanitize(c.name || `color_${i + 1}`)] = {
            value: c.hex.toUpperCase(),
            type: 'color',
            name: c.name,
            rgb: chroma(c.hex).rgb(),
            hsl: chroma(c.hex).hsl().map(v => isNaN(v) ? 0 : Math.round(v)),
          };
          return acc;
        }, {} as Record<string, any>),
      };
      return JSON.stringify(obj, null, 2);
    }

    case 'swift': {
      const lines = palette.map((c, i) => {
        const [r, g, b] = chroma(c.hex).rgb();
        const varName = sanitize(c.name || `color${i + 1}`).replace(/-([a-z])/g, g => g[1].toUpperCase());
        return `    static let ${varName} = Color(red: ${(r / 255).toFixed(3)}, green: ${(g / 255).toFixed(3)}, blue: ${(b / 255).toFixed(3)})`;
      }).join('\n');
      return `import SwiftUI\n\nextension Color {\n${lines}\n}`;
    }

    case 'svg': {
      const width = 800;
      const height = 400;
      const swatchWidth = width / palette.length;
      const rects = palette.map((c, i) => {
        const x = i * swatchWidth;
        const textColor = isLightColor(c.hex) ? '#000000' : '#ffffff';
        return `
    <g transform="translate(${x}, 0)">
      <rect width="${swatchWidth}" height="${height}" fill="${c.hex.toUpperCase()}" />
      <text x="24" y="${height - 60}" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="${textColor}">${c.hex.toUpperCase()}</text>
      <text x="24" y="${height - 30}" font-family="system-ui, sans-serif" font-size="14" fill="${textColor}" opacity="0.8">${c.name}</text>
    </g>`;
      }).join('');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n  <style>text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }</style>\n${rects}\n</svg>`;
    }

    default:
      return '';
  }
}

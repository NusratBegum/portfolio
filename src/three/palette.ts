import type { Theme } from '../App';

/* The flamingo keeps its natural vertex colors; `birdTint` multiplies them.
   Companions get a slight haze tint so they read as distant. */
export const PALETTES = {
  light: {
    fog: '#e8e1d4',
    hemiSky: '#fff6e6',
    hemiGround: '#cbbca4',
    hemiIntensity: 2.0,
    keyColor: '#ffe9d2',
    keyIntensity: 2.6,
    rimColor: '#fff3e0',
    rimIntensity: 0.9,
    birdTint: '#ffffff',
    companionTint: '#e8d8cf',
    emissive: 0,
    cloud: '#fffdf4',
    cloudOpacity: 1,
    glow: '#ffe9c2',      // sun — crisp disc like the moon, warm
    glowOpacity: 0.95,
    glowScale: 9,
    stars: 0,
  },
  dark: {
    fog: '#0c0c0e',
    hemiSky: '#4a4a55',
    hemiGround: '#0a0a0c',
    hemiIntensity: 1.6,
    keyColor: '#ffd9c0',
    keyIntensity: 2.2,
    rimColor: '#8a9ac0',
    rimIntensity: 1.0,
    birdTint: '#ffffff',
    companionTint: '#b9aeb4',
    emissive: 0.16,
    cloud: '#1c1c22',
    cloudOpacity: 0.22,
    glow: '#e8ecf5',      // moon
    glowOpacity: 0.95,
    glowScale: 7,
    stars: 1,
  },
} satisfies Record<Theme, Record<string, string | number>>;

export type Palette = (typeof PALETTES)['light'];
export const paletteFor = (t: Theme): Palette => PALETTES[t] as Palette;

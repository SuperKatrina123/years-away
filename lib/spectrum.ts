import type { SpectrumProfile } from './types.ts';

const classProfiles: Record<string, Omit<SpectrumProfile, 'spectralClass'>> = {
  O: { baseColor: '#8bc5ff', secondaryColor: '#eaf6ff', bandIntensity: 0.98, lineDensity: 20, glowStrength: 0.95, noiseAmount: 0.15 },
  B: { baseColor: '#a4ccff', secondaryColor: '#f3f9ff', bandIntensity: 0.93, lineDensity: 18, glowStrength: 0.82, noiseAmount: 0.18 },
  A: { baseColor: '#d3e6ff', secondaryColor: '#ffffff', bandIntensity: 0.88, lineDensity: 16, glowStrength: 0.74, noiseAmount: 0.2 },
  F: { baseColor: '#f6f3ff', secondaryColor: '#fff7df', bandIntensity: 0.82, lineDensity: 14, glowStrength: 0.66, noiseAmount: 0.24 },
  G: { baseColor: '#ffe08d', secondaryColor: '#fff6d5', bandIntensity: 0.76, lineDensity: 13, glowStrength: 0.58, noiseAmount: 0.28 },
  K: { baseColor: '#ffb86f', secondaryColor: '#ffe3bc', bandIntensity: 0.7, lineDensity: 12, glowStrength: 0.54, noiseAmount: 0.31 },
  M: { baseColor: '#ff7b68', secondaryColor: '#ffd2c8', bandIntensity: 0.64, lineDensity: 11, glowStrength: 0.5, noiseAmount: 0.35 },
};

export function getSpectralClass(spectralType: string) {
  const spectralClass = spectralType.trim().charAt(0).toUpperCase();
  return spectralClass in classProfiles ? spectralClass : 'G';
}

export function getSpectrumProfile(spectralType: string) {
  const spectralClass = getSpectralClass(spectralType);
  return {
    spectralClass,
    ...classProfiles[spectralClass],
  };
}

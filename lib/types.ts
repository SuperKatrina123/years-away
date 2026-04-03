export interface BirthDateFormValues {
  name: string;
  birthDate: string;
}

export interface LocalStarRecord {
  id: string;
  properName: string;
  fallbackName: string;
  constellation: string;
  distanceLightYear: number;
  spectralType: string;
  magnitude: number;
  aliases: string[];
}

export interface MatchedStarSummary {
  id: string;
  name: string;
  constellation: string;
  distanceLightYear: number;
  spectralType: string;
  magnitude: number;
}

export interface StorySeed {
  distanceDelta: number;
}

export interface StarMatchRequestBody {
  birthDate: string;
  name?: string;
}

export interface StarMatchResponseBody {
  ageYears: number;
  star: MatchedStarSummary;
  storySeed: StorySeed;
}

export interface StarDetailResponseBody {
  id: string;
  name: string;
  constellation: string;
  distanceLightYear: number;
  spectralType: string;
  magnitude: number;
  aliases: string[];
  source: 'local';
}

export interface StarMatchViewModel {
  viewerName: string;
  ageYears: number;
  star: StarDetailResponseBody;
  storySeed: StorySeed;
}

export interface SpectrumProfile {
  spectralClass: string;
  baseColor: string;
  secondaryColor: string;
  bandIntensity: number;
  lineDensity: number;
  glowStrength: number;
  noiseAmount: number;
}

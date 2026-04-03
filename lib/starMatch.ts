import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateAgeYears } from './age.ts';
import { HttpError } from './errors.ts';
import type {
  LocalStarRecord,
  MatchedStarSummary,
  StarDetailResponseBody,
  StarMatchRequestBody,
  StarMatchResponseBody,
} from './types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.resolve(__dirname, '..', 'data', 'stars.json');

let cachedCatalog: LocalStarRecord[] | null = null;

function getCatalog() {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  cachedCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as LocalStarRecord[];
  return cachedCatalog;
}

function hasProperName(star: LocalStarRecord) {
  return star.properName.trim().length > 0;
}

function getDisplayName(star: LocalStarRecord) {
  return hasProperName(star) ? star.properName : star.fallbackName;
}

function toSummary(star: LocalStarRecord): MatchedStarSummary {
  return {
    id: star.id,
    name: getDisplayName(star),
    constellation: star.constellation,
    distanceLightYear: star.distanceLightYear,
    spectralType: star.spectralType,
    magnitude: star.magnitude,
  };
}

function compareByRanking(ageYears: number, left: LocalStarRecord, right: LocalStarRecord) {
  const distanceDelta = Math.abs(left.distanceLightYear - ageYears) - Math.abs(right.distanceLightYear - ageYears);
  if (distanceDelta !== 0) {
    return distanceDelta;
  }

  const properNameDelta = Number(hasProperName(right)) - Number(hasProperName(left));
  if (properNameDelta !== 0) {
    return properNameDelta;
  }

  const spectralTypeDelta = Number(Boolean(right.spectralType)) - Number(Boolean(left.spectralType));
  if (spectralTypeDelta !== 0) {
    return spectralTypeDelta;
  }

  return left.magnitude - right.magnitude;
}

export function matchStar(input: StarMatchRequestBody): StarMatchResponseBody {
  const catalog = getCatalog();

  if (!catalog.length) {
    throw new HttpError(500, 'Star catalog is empty.');
  }

  const ageYears = calculateAgeYears(input.birthDate);
  const bestMatch = [...catalog].sort((left, right) => compareByRanking(ageYears, left, right))[0];

  return {
    ageYears,
    star: toSummary(bestMatch),
    storySeed: {
      distanceDelta: Number(Math.abs(bestMatch.distanceLightYear - ageYears).toFixed(1)),
    },
  };
}

export function getStarDetails(id: string): StarDetailResponseBody {
  const star = getCatalog().find((entry) => entry.id === id);

  if (!star) {
    throw new HttpError(404, 'Star not found.');
  }

  return {
    id: star.id,
    name: getDisplayName(star),
    constellation: star.constellation,
    distanceLightYear: star.distanceLightYear,
    spectralType: star.spectralType,
    magnitude: star.magnitude,
    aliases: star.aliases,
    source: 'local',
  };
}

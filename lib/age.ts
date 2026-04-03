import { DateTime } from 'luxon';
import { HttpError } from './errors.ts';

export function calculateAgeYears(birthDate: string, referenceDate = DateTime.now()): number {
  if (!birthDate) {
    throw new HttpError(400, 'Birth date is required.');
  }

  const birth = DateTime.fromISO(birthDate, { zone: 'utc' }).startOf('day');

  if (!birth.isValid) {
    throw new HttpError(400, 'Birth date is invalid.');
  }

  const reference = referenceDate.startOf('day');

  if (birth > reference) {
    throw new HttpError(400, 'Birth date cannot be in the future.');
  }

  return Number(reference.diff(birth, 'years').years.toFixed(1));
}

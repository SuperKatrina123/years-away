import type { Request, Response } from 'express';
import { HttpError } from '../lib/errors.ts';
import { getStarDetails } from '../lib/starMatch.ts';

export async function getStarDetailsRoute(req: Request, res: Response) {
  try {
    const result = getStarDetails(req.params.id);
    res.json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Unexpected star details error.';
    res.status(status).json({ error: message });
  }
}

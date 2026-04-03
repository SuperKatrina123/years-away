import type { Request, Response } from 'express';
import { HttpError } from '../../lib/errors.ts';
import { matchStar } from '../../lib/starMatch.ts';
import type { StarMatchRequestBody } from '../../lib/types.ts';

export async function postStarMatch(req: Request, res: Response) {
  try {
    const body = req.body as StarMatchRequestBody;
    const result = matchStar(body);
    res.json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Unexpected star match error.';
    res.status(status).json({ error: message });
  }
}

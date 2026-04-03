import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getStarDetailsRoute } from '../api/star-details-route.ts';
import { postStarMatch } from '../api/star-match-route.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

dotenv.config({ path: path.join(rootDir, '.env.local') });
dotenv.config({ path: path.join(rootDir, '.env') });

const port = Number(process.env.PORT || 8787);

const app = express();

app.use(express.json());
app.post('/api/star-match', postStarMatch);
app.get('/api/star/:id/details', getStarDetailsRoute);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(express.static(distDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(distDir, 'index.html'), (error) => {
    if (!error) {
      return;
    }

    res.status(200).send('Years Away API server is running. Build the frontend with `npm run build` for production.');
  });
});

app.listen(port, () => {
  console.log(`Years Away server listening on http://localhost:${port}`);
});

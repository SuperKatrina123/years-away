![Years Away preview](./assets/preview.png)

# Years Away

Years Away is a poetic astronomy web app that turns a single birth date into a matched star, a spectrum-inspired visual, and a short story.

Instead of building a birth chart from location and exact sky coordinates, this project uses a different idea: find a star whose light-travel distance is approximately equal to the user's age today. The result is not presented as fate or cosmic certainty. It is framed as an astronomy-inspired keepsake built from approximate distance matching and a local star catalog.

## What It Does

The current MVP focuses on a very small but complete flow:

1. The user enters a required `birthDate` and an optional `name`.
2. The backend calculates age in years from the birth date to today.
3. The app looks up a local star catalog in [`data/stars.json`](./data/stars.json).
4. It ranks stars by closest light-year distance, then prefers readable names, available spectral types, and brighter stars.
5. The best match is returned to the client.
6. The frontend renders:
   - the matched star
   - core astronomy metadata
   - a stylized spectrum-inspired canvas based on spectral class
   - a short poetic story card

## Product Framing

Years Away is intentionally positioned as:

- matched by approximate light-travel distance
- inspired by stellar spectroscopy
- a poetic astronomy keepsake

It does not claim a strict scientific destiny model or a one-to-one cosmic truth.

## Core Architecture

The app is built around a local-first matching flow.

- `data/stars.json`
  Local processed star catalog used as the primary source of truth.
- `lib/age.ts`
  Converts `birthDate` into age in years.
- `lib/starMatch.ts`
  Loads the local catalog, ranks candidates, returns the best match, and serves star detail lookups.
- `lib/spectrum.ts`
  Maps stellar spectral classes such as `O/B/A/F/G/K/M` to visual parameters like color, glow, line density, and noise amount.
- `src/components/SpectrumCanvas.tsx`
  Draws the spectrum-inspired visual from local rendering logic instead of live astronomy data.
- `src/components/StarStoryCard.tsx`
  Displays the matched star and the narrative framing.
- `server/index.ts`
  Serves the API and the built frontend from the same Express server.

## API

### `POST /api/star-match`

Request:

```json
{
  "birthDate": "1998-08-16",
  "name": "Katrina"
}
```

Response:

```json
{
  "ageYears": 27.6,
  "star": {
    "id": "fomalhaut",
    "name": "Fomalhaut",
    "constellation": "Piscis Austrinus",
    "distanceLightYear": 25.1,
    "spectralType": "A3V",
    "magnitude": 1.16
  },
  "storySeed": {
    "distanceDelta": 2.5
  }
}
```

### `GET /api/star/:id/details`

Response:

```json
{
  "id": "fomalhaut",
  "name": "Fomalhaut",
  "constellation": "Piscis Austrinus",
  "distanceLightYear": 25.1,
  "spectralType": "A3V",
  "magnitude": 1.16,
  "aliases": [],
  "source": "local"
}
```

## Run Locally

**Prerequisites:** Node.js 20+ recommended

1. Install dependencies:
   `npm install`
2. Start the frontend dev app and API together:
   `npm run dev`
3. Open the frontend:
   `http://localhost:3000`
4. The API server runs on:
   `http://127.0.0.1:8787`

## Environment

Most of the MVP works from local data and does not require external services.

`.env.example` currently includes:

- `PORT`
- `GEMINI_API_KEY`

`GEMINI_API_KEY` is optional and should live only in `.env.local` when used.

## Project Structure

```text
api/
data/
lib/
server/
src/
```

## Status

The current version is an MVP focused on the main experience:

- birth date to age calculation
- age to star matching from a local catalog
- star to spectrum-inspired visualization
- result page with star metadata and story framing

Future work can expand the catalog, improve data provenance, add richer story generation, and introduce optional astronomy-data enrichment without changing the main matching model.

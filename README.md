# Suman Jha: Data Analyst Portfolio

A single-page portfolio built with React, TypeScript, Vite and Recharts.

## Folder guide

| Path | What it is |
|---|---|
| `src/data/content.ts` | **All website text** (projects, case studies, skills, experience, certifications). Edit here. |
| `src/components/` | Page sections (Hero, Projects, Analytics Lab, and so on) |
| `src/styles.css` | Colours and layout. The main colour is `--accent`. |
| `src/data/lab.json` | Chart data for the Analytics Lab (real aggregates from the project datasets) |
| `public/` | Photo, favicon, social-preview image, resume PDF |
| `public/Suman_Jha_Resume.pdf` | Your resume. The site's Resume buttons download this file |
| `data-build/build_data.py` | Script that regenerates `lab.json` from the project repositories |
| `_private/` | Your original photos. Never uploaded (git-ignored) |
| `DEPLOY_VERCEL.md` | Step-by-step deployment guide |

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to dist/
```

## Configuration

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Your live site address (link previews) |
| `VITE_WEB3FORMS_KEY` | Access key so the contact form emails you (see `DEPLOY_VERCEL.md`, Part 3) |

## Content notes

- WeatherRetail sales are **synthetic** (seeded generator) joined to real Open-Meteo weather. The site says so wherever it appears.
- The Olist marketplace data is a real public dataset.
- Purchase Order work is described at a high level. Company, client and volume details are confidential and not published.
- No performance numbers are claimed beyond what the repositories prove.

## Deploy

See **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)**.

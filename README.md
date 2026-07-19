# GameNightly

A game night scheduling app that helps groups find the best date for everyone.

## Features

- Create game night events
- Add invitees and share unique links
- Each person marks their available dates
- View combined availability to find the best date

## Tech Stack

- React 18 + Vite
- Express + SQLite (Node's built-in `node:sqlite`, no external database)
- Tailwind CSS
- Deployed on Railway (SQLite data on a persistent volume)

## Development

Requires Node 22.5+.

```bash
npm install
npm run build        # build the frontend once so the server has assets
node server/index.js # API + static server on :3000
npm run dev          # Vite dev server on :5173, proxies /api to :3000
```

The SQLite database is created automatically in `./data/` (or `$DATA_DIR`).

## Deployment (Railway)

The app runs as a single service: `npm run build` then `npm start`, which
serves the built frontend and the API from one Express process.

1. Attach a volume mounted at `/data`
2. Set the environment variable `DATA_DIR=/data`
3. Deploy with `railway up`

## Usage

1. Visit the homepage and create a new game night
2. Add your friends by name
3. Copy each person's unique link and share it with them
4. Each person clicks their link and selects available dates
5. View the combined availability on the calendar page

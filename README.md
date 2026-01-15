# GameNightly

A game night scheduling app that helps groups find the best date for everyone.

## Features

- Create game night events
- Add invitees and share unique links
- Each person marks their available dates
- View combined availability to find the best date

## Tech Stack

- React 18 + Vite
- Supabase (PostgreSQL database)
- Tailwind CSS
- Deployed on Netlify

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to the SQL Editor and run the contents of `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API

### 2. Configure Environment Variables

Create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install and Run

```bash
npm install
npm run dev
```

### 4. Deploy to Netlify

1. Push your code to GitHub
2. Connect the repo to Netlify
3. Add the environment variables in Netlify's dashboard
4. Deploy!

## Usage

1. Visit the homepage and create a new game night
2. Add your friends by name
3. Copy each person's unique link and share it with them
4. Each person clicks their link and selects available dates
5. View the combined availability on the calendar page

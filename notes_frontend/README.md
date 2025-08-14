# Notes Frontend (React + Supabase)

A minimalistic, light-themed notes application with a clean two-panel layout. The left sidebar lists/searches notes and allows creating new notes. The main panel lets you view, edit, and delete selected notes. Notes are stored in Supabase.

## Features

- Create new note
- Edit existing note (title and content)
- Delete note (with confirmation)
- Search notes by title or content (case-insensitive)
- View all notes ordered by last updated
- Minimalist, responsive two-panel layout
- Light theme with brand colors:
  - Primary: `#1976d2`
  - Secondary: `#424242`
  - Accent: `#ffab00`

## Getting Started

1) Install dependencies

```
cd simple-notes-manager-7125-7143/notes_frontend
npm install
```

2) Configure environment variables

Copy `.env.example` to `.env` and set your Supabase credentials:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
REACT_APP_SUPABASE_KEY=YOUR_ANON_PUBLIC_API_KEY
```

3) Run the app

```
npm start
```

App runs at http://localhost:3000

## Supabase Setup

- Create a project at https://supabase.com
- Add the `notes` table using the SQL in `assets/supabase.md`
- For a quick demo, you can disable RLS or add permissive policies (see `assets/supabase.md`). Do not use permissive policies for production.

Expected table schema:

```
notes (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

## Project Structure

```
src/
  components/
    Editor.js        # Main editor/view panel
    Sidebar.js       # Sidebar with search, list, and "New Note"
  services/
    notesService.js  # CRUD + search; Supabase operations
  supabaseClient.js  # Supabase client initialization
  App.js             # Root two-panel UI
  App.css            # Minimalist light theme and layout
  index.js
  index.css
```

## Notes on Configuration

- This app uses Create React App; environment variables must start with `REACT_APP_`.
- If Supabase is not configured, a banner will appear in the UI. CRUD operations require valid Supabase setup.
- The UI automatically refreshes notes after actions and sorts by `updated_at` desc.

## Scripts

- `npm start` - Run development server
- `npm run build` - Build production bundle
- `npm test` - Run tests

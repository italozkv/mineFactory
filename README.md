# MineFactory

MineFactory is a personal project management panel built for Minecraft mods, but designed to work with any kind of project.

It combines:

- React + Vite
- TailwindCSS
- Supabase
- Discord login
- Separate public and admin areas
- An admin roadmap board with a kanban-style workflow

## Overview

Public area:

- `/`
- `/projects`
- `/projects/:slug`

Admin area:

- `/admin/login`
- `/admin/dashboard`
- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/:id/edit`
- `/admin/projects/categories`
- `/admin/projects/tags`
- `/admin/roadmap`

## Features

Projects:

- full CRUD
- public or private visibility
- automatic slug generation
- logo and banner uploads
- tags, categories, loaders, and Minecraft versions
- public project page by slug

Categories and tags:

- full CRUD
- project counters
- custom tag colors
- preset creation shortcuts in the admin panel

Roadmap:

- create and edit tasks
- filters by project, status, priority, type, and category
- kanban board with four columns
- manual status changes
- bulk import through JSON
- optional project linking

## Requirements

- Node.js 20 or newer
- A Supabase project
- Discord provider enabled in Supabase Auth

## Environment Variables

Create a `.env` file at the project root using `.env.example` as a base:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_ADMIN_DISCORD_ID=YOUR_DISCORD_USER_ID
```

## Supabase

The migrations live in:

- `supabase/migrations/20260630140000_minefactory_projects.sql`
- `supabase/migrations/20260630152000_public_projects_without_published.sql`
- `supabase/migrations/20260630170000_create_roadmap_items.sql`

They create:

- `categories`
- `tags`
- `projects`
- `project_tags`
- `roadmap_items`
- Row Level Security policies
- automatic `updated_at` triggers
- a public `project-assets` storage bucket

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- The public website reads data from Supabase.
- The admin panel is the main place for managing content and structure.
- `src/data/mods.json` still exists as legacy content, but the active workflow now uses Supabase.
- The project includes `vercel.json` so it can be deployed as an SPA on Vercel.

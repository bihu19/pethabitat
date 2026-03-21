# PetHabitat - Pet-Friendly Places Map

## Project Overview
A bilingual (EN/TH) web application for discovering pet-friendly places in Thailand. Built with Next.js 16 (App Router), Supabase, Leaflet/OpenStreetMap, and deployed on Vercel.

## Tech Stack
- **Framework**: Next.js 16 (App Router, `src/app/`)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom PetHabitat design system
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Maps**: react-leaflet + OpenStreetMap (free), with Google Maps links for navigation
- **State**: Zustand for client state
- **i18n**: Custom context-based bilingual system (EN/TH)
- **Deployment**: Vercel

## Design System
- **Primary**: Orange (#9b4500, container: #ff8c42)
- **Secondary**: Green (#2c6a3b)
- **Tertiary**: Blue (#0060ac)
- **Fonts**: Plus Jakarta Sans (headlines), Be Vietnam Pro (body)
- **Border Radius**: 1rem default, 2rem lg, 3rem xl
- Uses Material Symbols Outlined for icons

## Project Structure
```
src/
  app/                    # Next.js App Router pages
    (auth)/               # Auth group (login, register)
    (main)/               # Main app group (explore, dashboard, places, pets)
    api/                  # API routes
  components/             # Shared React components
  lib/                    # Utilities (supabase client, i18n, types)
  messages/               # i18n translation files (en.json, th.json)
supabase/
  schema.sql              # Database schema
  seed.sql                # Seed data from Excel
```

## Key Conventions
- All place data comes from Supabase `places` table
- Google Maps links stored in `google_maps_url` field - used for "Get Directions" buttons
- Map display uses Leaflet with approximate coordinates per province
- Reviews are tied to both a `user_id` and a `place_id`
- Pet medical records support: vaccinations, checkups, medications
- Supabase Row Level Security (RLS) is used for data access control

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

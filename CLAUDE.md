# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build production application
- `npm run lint` - Run ESLint checks
- `npm start` - Start production server

### Database
- `npm run seed` - Seed database with initial content using Prisma
- Database migrations are handled through Prisma CLI

## Architecture Overview

### Tech Stack (Public Version)
- **Frontend**: Next.js 15 with React 19, Tailwind CSS 4, Framer Motion
- **Backend**: tRPC with Prisma ORM, PostgreSQL database
- **Mode**: Read-only public dashboard

### Key Architecture Patterns

#### tRPC API Layer
- All API routes go through tRPC (`src/server/api/`)
- Main router in `src/server/api/root.ts` exports `AppRouter` type
- Content operations in `src/server/api/routers/content.ts`
- Client configured in `src/app/providers.tsx` with React Query integration

#### Database Schema
- Single `ContentItem` model with enum `ContentType`
- Supports: youtube, article, reddit, twitter, spotify, soundcloud, movie, book
- Required fields: type, url, title, note, createdAt
- Optional: thumbnail, author, duration, location

#### Content Processing Pipeline
1. Metadata extraction via `/api/extract-metadata` (basic Open Graph only)
2. Database storage via tRPC mutations (admin-only)

#### Component Structure
- `ContentCard.tsx` - Display component for content items
- `ContentCardSkeleton.tsx` - Loading state component
- Card sizing logic in `components/cardSizes.ts`

### Development Patterns

#### Data Flow
1. Client calls tRPC procedures (read-only)
2. tRPC routes to content router methods
3. Prisma handles database operations
4. React Query manages caching and updates

#### Type Safety
- Zod schemas for validation
- tRPC provides end-to-end type safety
- Prisma generates type-safe database client

#### Environment Requirements
- PostgreSQL database (DATABASE_URL required)
- NEXT_PUBLIC_PUBLIC_MODE=true (automatically set)

### Important Implementation Details

#### Public Mode Configuration
- `src/config/public-mode.ts` is hardcoded to public mode
- All editing features are disabled
- Only viewing, searching, and filtering are available

#### Removed Features (vs Admin Version)
- No screenshot generation (Puppeteer removed)
- No add content functionality
- No CLI tools
- No S3 dependencies
- No admin scripts

#### Vercel Deployment Ready
- All serverless-incompatible dependencies removed
- Build process optimized for Vercel
- Environment variables: DATABASE_URL only
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev --turbopack` - Start development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 React application for an ADHD focus timer with forest backgrounds. The app uses TypeScript and Tailwind CSS v4.

### Key Components Structure

- **Main Timer Interface** (`app/page.tsx`): Central page containing timer state management, background video selection, audio control, and Google Analytics tracking
- **Circular Timer Component** (`components/ui/CircularTimer.tsx`): Interactive SVG-based timer with mouse hover effects, wave animations, and pause/resume functionality
- **Layout** (`app/layout.tsx`): Root layout with comprehensive SEO metadata, analytics integration (Vercel Analytics + Google Analytics), and structured data

### Core Features

1. **Timer System**: 60-segment circular timer (each segment = 1 minute) with visual feedback
2. **Audio Integration**: Background music (`/background.m4a`) with lazy loading and automatic pause on timer completion
3. **Video Backgrounds**: Random forest video selection from `/public` directory with responsive video containers
4. **Interactive Controls**: Mouse position-based time selection on outer ring, inner circle for pause/resume
5. **Analytics Tracking**: Google Analytics events for user interactions (preview, pause, resume)

### State Management

The application uses React hooks for state management:
- Timer state (running/paused/remaining seconds)
- Audio control with `useRef` for HTMLAudioElement
- Video selection and preview states
- Mouse interaction states for UI feedback

### Styling Architecture

- **Tailwind CSS v4** with PostCSS configuration
- Custom CSS-in-JS for video container styling
- Utility class composition with `clsx` and `tailwind-merge` in `lib/utils.ts`
- Responsive design with viewport-based sizing

### Public Assets

- Forest background videos: `forestvideosmall.mp4`, `forest2_small.mp4`, `forest3.mp4`
- Background audio: `background.m4a`
- SEO preview image: `preview.png`
- Various icons and logos in SVG format

### TypeScript Configuration

- Path aliasing: `@/*` maps to project root
- Global type definitions in `types/gtag.d.ts` for Google Analytics
- Strict TypeScript configuration with Next.js plugin integration
# SHITTS Engineering Documentation

## Overview
SHITTS (Style DNA Discovery) is a high-performance fashion discovery engine built with Next.js 15. It uses a gesture-driven UI to build a real-time "Style DNA" profile for users through the AIMAS intent engine.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Backend**: Firebase Admin SDK (Server-side), Firestore
- **AI**: Google Genkit + Gemini 1.5 Flash
- **Payments**: PayPal SDK, Ziina REST API
- **State**: React Context + LocalStorage Persistence

## Local Setup

### Prerequisites
- Node.js 20+
- npm or pnpm

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` based on `.env.example`.

### Development
```bash
npm run dev
```

## Architecture
The project follows a **Server Authority** model.
- `/src/app`: UI and Routing
- `/src/actions`: Server Actions (Entry points for UI)
- `/src/server`: Core business logic, Firebase Admin, Guards
- `/src/domain`: Type definitions and Zod schemas
- `/src/lib`: Shared utilities

## Deployment
1. Build the project: `npm run build`
2. Deploy to Firebase App Hosting or Vercel.

---
*Engineering-grade fashion discovery.*

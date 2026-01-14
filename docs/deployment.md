# SHITTS Configuration

## Build Settings
To fix the `ERESOLVE` error on Vercel, use the following Build Command in the Vercel Dashboard:

**Build Command**: `npm install --force && npm run build`
**Install Command**: `npm install --force`

## Environment Variables
Ensure all variables from `.env.example` are added to Vercel.

## Why the error happened?
Vercel's default `npm install` is strict about peer dependencies. Because we are using React 19 (RC/Stable) with Next.js 15, some older Radix UI components trigger a version conflict. Using `--force` tells npm to proceed with the build anyway.

# SHITTS | Your Daily Style Edit

**SHITTS** is a premium, high-impact 5-minute daily fashion curation app. Built for the modern style discoverer, it transforms shopping into a cinematic, gesture-driven discovery experience powered by the **AIMAS Intent Engine**.

## 🚀 Vision
In a world of endless, boring scrolls, SHITTS focuses on the "Daily 15"—a curated, high-impact selection of fashion pieces tailored to your specific "Style DNA." Every swipe matters. Every choice learns.

## 🧠 Core Systems

### 1. AIMAS (AI-driven Intent Management & Affinity System)
The heart of the app is a real-time mathematical engine that analyzes user behavior:
- **Intent Capture**: Every swipe is recorded as an intent (LIKE, DISLIKE, or DETAIL_VIEW).
- **Trait-Based Learning**: The system tracks affinity for specific traits (e.g., *minimalist*, *typography*, *vintage*) rather than just product IDs.
- **On-Time Math**: Every next screen is re-ranked in real-time based on the user's latest interaction.

### 2. Immersive Mobile UI
- **Full-Screen Experience**: Truly edge-to-edge photography with zero UI clutter.
- **Smart Depth Transition**: Background cards stay blurred and hidden until you swipe, ensuring a single-focus experience.
- **Ergonomic Design**: Action buttons (Undo, Info, Cart) are placed for natural thumb reach.

### 3. Gamified Discovery
- **Surprise Style Credits**: Earn $1-$5 in store credit by finding and claiming "Bonus Cards" hidden in your daily deck.
- **Style Persona**: The AI analyzes your Style DNA to assign you a catchy daily persona (e.g., *Minimalist Urbanite*, *Cyberpunk Pioneer*).

### 4. Enterprise-Ready Backend
- **Inventory**: Cloud-synced with **Google Firestore**.
- **Payments**: Integrated with **PayPal** and **Ziina** (UAE) for global and local transactions.
- **AI Engine**: Powered by **Google Gemini** via Genkit.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion-inspired logic
- **Database**: Firebase Firestore
- **AI**: Genkit + Gemini 1.5 Flash
- **Payments**: PayPal SDK + Ziina API

## 📦 Setup & Deployment

1. **Environment Variables**:
   Create a `.env.local` with the following:
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # Payments
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   ZIINA_API_KEY=...
   # AI
   GEMINI_API_KEY=...
   ```

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Build**:
   ```bash
   npm run build
   ```

---
*Created with focus on speed, style, and intelligence.*

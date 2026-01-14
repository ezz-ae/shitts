# SHITTS Architecture

## Core Principles
1. **Server Authority**: The UI does not make decisions about money, roles, or data integrity.
2. **Intent-Driven**: Every user gesture (Swipe, Detail View) is treated as a piece of data for the AIMAS system.
3. **Immutable Ledger**: All financial transactions must be recorded in a non-deletable ledger collection.

## Data Flow
1. **UI Layer**: Captures gestures and triggers Server Actions.
2. **Action Layer**: Validates session, checks roles, and calls Server Logic.
3. **Server Layer**: Communicates with Firestore via Firebase Admin SDK.
4. **AI Layer**: Generates recommendations based on the Intent History stored in the Server Layer.

## Security
- Direct client-side writes to Firestore are blocked by Security Rules.
- All sensitive operations (Checkout, Admin) are protected by server-side guards.

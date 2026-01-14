import { z } from 'zod';

const EnvSchema = z.object({
  // Firebase
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_SERVICE_ACCOUNT_KEY: z.string(),

  // Payments
  PAYPAL_CLIENT_ID: z.string(),
  PAYPAL_CLIENT_SECRET: z.string(),
  PAYPAL_WEBHOOK_ID: z.string().optional(), // Required for real signature verification
  ZIINA_API_KEY: z.string(),
  ZIINA_WEBHOOK_SECRET: z.string().optional(),

  // App
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string(),
});

export function validateEnv() {
  const result = EnvSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
    // In production, we want to crash if env is wrong
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
  } else {
    console.log('✅ Environment variables validated.');
  }
}

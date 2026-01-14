import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  let serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      // 1. Remove potential surrounding quotes from .env file
      let cleanKey = serviceAccountKey.trim();
      if ((cleanKey.startsWith("'") && cleanKey.endsWith("'")) ||
          (cleanKey.startsWith('"') && cleanKey.endsWith('"'))) {
        cleanKey = cleanKey.slice(1, -1);
      }
        
      const parsedKey = JSON.parse(cleanKey);
      
      // 2. Fix the private_key specifically for PEM format
      if (parsedKey.private_key) {
        // Some environments double-escape newlines (\\n instead of \n)
        // This regex aggressively converts the string "\n" into an actual line break
        parsedKey.private_key = parsedKey.private_key.replace(/\\n/g, '\n');
        
        // Ensure it has the correct PEM headers and footers if they got mangled
        if (!parsedKey.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
           parsedKey.private_key = `-----BEGIN PRIVATE KEY-----\n${parsedKey.private_key}`;
        }
        if (!parsedKey.private_key.includes('-----END PRIVATE KEY-----')) {
           parsedKey.private_key = `${parsedKey.private_key}\n-----END PRIVATE KEY-----\n`;
        }
      }

      admin.initializeApp({
        credential: admin.credential.cert(parsedKey),
      });
      console.log('✅ Firebase Admin Initialized Successfully');
    } catch (e) {
      console.error('❌ Firebase Admin Initialization Failed:', e);
      // Fallback for environments with pre-configured ADC
      if (!admin.apps.length) admin.initializeApp();
    }
  } else {
    admin.initializeApp();
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

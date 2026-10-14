import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import webpush from 'web-push';

// ─── Firebase Admin Init ─────────────────────────────────────────────────────
let firebaseApp: App | null = null;

export const initFirebase = () => {
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    console.warn('⚠️  Firebase credentials not set — FCM push disabled');
    return;
  }

  if (!getApps().length) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized');
  }
};

export const sendFCMNotification = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  if (!firebaseApp) return;
  try {
    await getMessaging().send({
      token,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } },
    });
  } catch (err) {
    console.error('FCM send error:', err);
  }
};

export const sendMultipleFCM = async (
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> => {
  if (!firebaseApp || tokens.length === 0) return;
  const chunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += 500) chunks.push(tokens.slice(i, i + 500));
  for (const chunk of chunks) {
    try {
      await getMessaging().sendEachForMulticast({
        tokens: chunk,
        notification: { title, body },
        data,
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default' } } },
      });
    } catch (err) {
      console.error('FCM multicast error:', err);
    }
  }
};

// ─── Web Push (VAPID) ────────────────────────────────────────────────────────
export const initWebPush = () => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn('⚠️  VAPID keys not set — Web Push disabled');
    return;
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@pulsops.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('✅ Web Push (VAPID) initialized');
};

export const sendWebPush = async (
  subscription: webpush.PushSubscription,
  title: string,
  body: string,
  data?: unknown
): Promise<void> => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, data })
    );
  } catch (err) {
    console.error('Web push error:', err);
  }
};

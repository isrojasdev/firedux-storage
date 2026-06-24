// Initializes firedux-storage once (client-side only).
// Import this from any Client Component that needs Firebase/Redux.
import { FireduxStorage, initializeFiredux, z } from "firedux-storage";

let initialized = false;

export function getStore() {
  if (!initialized) {
    initializeFiredux(
      {
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
      },
      {
        schemas: {
          todos: z.object({ title: z.string().min(1), status: z.enum(["pending", "completed"]) }),
        },
      }
    );
    initialized = true;
  }
  return FireduxStorage.store;
}

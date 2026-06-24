import { createApp } from "vue";
import { FireduxStorage, initializeFiredux, z } from "firedux-storage";
import App from "./App.vue";

initializeFiredux(
  {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
  },
  {
    schemas: {
      todos: z.object({ title: z.string().min(1), status: z.enum(["pending", "completed"]) }),
    },
  }
);

// Expose the Redux store so composables can subscribe to it
export const store = FireduxStorage.store;

createApp(App).mount("#app");

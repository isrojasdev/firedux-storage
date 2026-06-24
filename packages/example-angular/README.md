# example-angular — Angular 18

Demonstrates firedux-storage in an Angular 18 app using standalone components.
Features: real-time todos, add/delete, Google auth, Zod validation.

## Setup

Angular requires its own CLI tool — it does **not** share the yarn workspace install.

```sh
# 1. Install Angular CLI globally (one-time)
npm install -g @angular/cli

# 2. Install this example's dependencies
cd packages/example-angular
npm install

# 3. Fill in your Firebase credentials
# Edit src/environments/environment.ts — replace the empty strings:
```

```ts
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
  },
};
```

## Run

```sh
# From packages/example-angular/
ng serve
# → http://localhost:4200
```

## Key patterns shown

- `FireduxService` — injectable Angular service that initializes firedux-storage and exposes Redux state as RxJS `BehaviorSubject` (`todos$`, `user$`)
- `AppComponent` uses `AsyncPipe` with `| async` to subscribe to observables
- Redux store changes propagate via `store.subscribe()` → `BehaviorSubject.next()`

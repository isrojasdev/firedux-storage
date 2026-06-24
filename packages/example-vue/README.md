# example-vue — Vue 3 + Vite

Demonstrates firedux-storage in a Vue 3 app using Composition API.
Features: real-time todos, add/delete, Google auth, Zod validation.

## Setup

```sh
# 1. From repo root — install all workspace dependencies
yarn install

# 2. Create your .env with Firebase credentials
cp packages/example-vue/.env.example packages/example-vue/.env
# Edit .env with your Firebase project values
```

## Run

```sh
# From repo root
npm run dev:vue
# → http://localhost:5173
```

## Key patterns shown

- `useFiredux.js` — `useSelector(selector)` composable that bridges the Redux store into a Vue `ref`
- `onMounted` kicks off the real-time Firestore listener
- No additional state management library needed — firedux-storage is the store

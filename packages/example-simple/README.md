# example-simple — vanilla JS (Vite)

Demonstrates firedux-storage in a plain JavaScript app with no framework.
Features: real-time todos, add/delete, Google auth, Zod validation.

## Setup

```sh
# 1. From repo root — install all workspace dependencies
yarn install

# 2. Create your .env with Firebase credentials
cp packages/example-simple/.env.example packages/example-simple/.env
# Edit .env with your Firebase project values
```

## Run

```sh
# From repo root
npm run dev:simple
# → http://localhost:5173
```

## Key patterns shown

- `initializeFiredux` with a Zod schema
- `executeQueries` for real-time listener, add, delete, and Google auth
- `FireduxStorage.store.subscribe(render)` — manual re-render without a framework

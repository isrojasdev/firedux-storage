# example-nextjs — Next.js 15 App Router

Demonstrates firedux-storage in a Next.js app using the App Router.
Features: real-time todos, add/delete, Google auth, Zod validation.

## Setup

```sh
# 1. From repo root — install all workspace dependencies
yarn install

# 2. Create your .env.local with Firebase credentials
cp packages/example-nextjs/.env.example packages/example-nextjs/.env.local
# Edit .env.local with your Firebase project values
```

## Run

```sh
# From repo root
npm run dev:nextjs
# → http://localhost:3000
```

## Key patterns shown

- `src/lib/firedux.js` — singleton initializer (safe to call multiple times)
- `src/app/providers.jsx` — `FireduxProvider` wraps `react-redux <Provider>` as a Client Component
- `src/app/layout.jsx` — Server Component that renders the Provider shell
- `src/app/todos/TodoList.jsx` — `'use client'` component using `useSelector` and `executeQueries`

> **Note:** firedux-storage initializes only on the client side. Server Components cannot access the Redux store directly.

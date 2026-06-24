# firedux-storage

Firebase + Redux Toolkit in one library. No boilerplate.

Wraps Firestore, Firebase Auth, and Firebase Storage with a pre-configured Redux store. You call `executeQueries` — the library handles state management automatically.

## Installation

```sh
npm install firedux-storage
```

Firebase is a peer dependency:

```sh
npm install firebase
```

## Quick start

```js
import { initializeFiredux, executeQueries } from 'firedux-storage';

// 1. Initialize once (before any query)
initializeFiredux({
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
});

// 2. Run queries
const [result] = await executeQueries([
  { queryType: 'getCollectionData', collectionName: 'todos' },
]);

console.log(result.status); // 'succeeded'
console.log(result.result); // [{ id: '...', title: '...', ... }]
```

## API reference

### `initializeFiredux(config, options?)`

Initializes Firebase and the Redux store. Must be called once before any `executeQueries` call.

```js
initializeFiredux(firebaseConfig, {
  schemas: {
    todos: z.object({ title: z.string().min(1) }),
  },
});
```

| Parameter | Type | Description |
|---|---|---|
| `config` | `FirebaseConfig` | Your Firebase project config object |
| `options.schemas` | `Record<string, ZodSchema>` | Optional — Zod schemas per collection for write validation |

---

### `executeQueries(queryList)`

Executes one or more queries in parallel. Returns an array of results in the same order.

```js
const results = await executeQueries([
  { queryType: 'getCollectionData', collectionName: 'todos' },
  { queryType: 'signInGoogle' },
]);
```

Each result has shape `{ status: 'succeeded' | 'failed', result?, error? }`.

---

## Query types

### Firestore — reads

| `queryType` | Required params | Optional params |
|---|---|---|
| `getCollectionData` | `collectionName` | `whereCondition`, `limitCondition`, `orderByCondition`, `storeAs`, `keyReference` |
| `getDocumentById` | `collectionName`, `documentId` | `keyReference` |
| `obtainRealTime` | `collectionName` | `whereCondition`, `limitCondition`, `orderByCondition`, `storeAs`, `keyReference` |

```js
// Fetch a collection
await executeQueries([{ queryType: 'getCollectionData', collectionName: 'todos' }]);

// With filters
await executeQueries([{
  queryType: 'getCollectionData',
  collectionName: 'todos',
  whereCondition: ['status', '==', 'pending'],
  limitCondition: 10,
  orderByCondition: ['createdAt', 'desc'],
  storeAs: 'pendingTodos',
}]);

// Multiple where clauses
await executeQueries([{
  queryType: 'getCollectionData',
  collectionName: 'todos',
  whereCondition: [['status', '==', 'pending'], ['priority', '>', 1]],
}]);

// Real-time subscription
await executeQueries([{ queryType: 'obtainRealTime', collectionName: 'todos' }]);

// Single document
await executeQueries([{
  queryType: 'getDocumentById',
  collectionName: 'todos',
  documentId: 'abc123',
}]);
```

### Firestore — writes

| `queryType` | Required params |
|---|---|
| `addDocument` | `collectionName`, `documentData` |
| `updateDocument` | `collectionName`, `documentId`, `documentData` |
| `removeDocument` | `collectionName`, `documentId` |

```js
// Add
await executeQueries([{
  queryType: 'addDocument',
  collectionName: 'todos',
  documentData: { title: 'Buy milk', status: 'pending' },
}]);

// Update
await executeQueries([{
  queryType: 'updateDocument',
  collectionName: 'todos',
  documentId: 'abc123',
  documentData: { status: 'completed' },
}]);

// Delete
await executeQueries([{
  queryType: 'removeDocument',
  collectionName: 'todos',
  documentId: 'abc123',
}]);
```

### Auth

| `queryType` | Required params |
|---|---|
| `signInEmail` | `email`, `password` |
| `signUpEmail` | `email`, `password` |
| `signInGoogle` | — |
| `signInFacebook` | — |
| `signOut` | — |
| `resetPassword` | `email` |

```js
// Email sign-in
const [res] = await executeQueries([{
  queryType: 'signInEmail',
  email: 'user@example.com',
  password: 'secret',
}]);
// res.result → { uid, email, displayName, photoURL, emailVerified }

// Google / Facebook (opens popup)
await executeQueries([{ queryType: 'signInGoogle' }]);
await executeQueries([{ queryType: 'signInFacebook' }]);

// Sign out
await executeQueries([{ queryType: 'signOut' }]);

// Password reset email
await executeQueries([{ queryType: 'resetPassword', email: 'user@example.com' }]);
```

### Storage

| `queryType` | Required params |
|---|---|
| `uploadFile` | `file`, `fileName`, `folder` |
| `deleteFile` | `fileUrl` |

```js
// Upload
const [res] = await executeQueries([{
  queryType: 'uploadFile',
  file: fileObject,       // File | Blob
  fileName: 'avatar',
  folder: 'users',
}]);
// res.result → 'https://firebasestorage.googleapis.com/...'

// Delete by URL
await executeQueries([{
  queryType: 'deleteFile',
  fileUrl: 'https://firebasestorage.googleapis.com/...',
}]);
```

---

## Zod validation

Register Zod schemas when calling `initializeFiredux`. Validation runs automatically before `addDocument` and `updateDocument`. Reads are never validated.

```js
import { z, initializeFiredux } from 'firedux-storage';

initializeFiredux(firebaseConfig, {
  schemas: {
    todos: z.object({
      title: z.string().min(1),
      status: z.enum(['pending', 'completed']),
    }),
  },
});

// This will throw a validation error before hitting Firestore:
await executeQueries([{
  queryType: 'addDocument',
  collectionName: 'todos',
  documentData: { title: '', status: 'done' },   // fails schema
}]);
// result → { status: 'failed', error: '[firedux-storage] Validation failed...' }
```

Collections without a registered schema behave exactly as before — no schema, no validation. `z` is re-exported from `firedux-storage` so you don't need to install Zod separately.

---

## Redux state shape

The library manages a Redux store internally. You can access it via `FireduxStorage.store` if needed:

```js
import { FireduxStorage } from 'firedux-storage';

const state = FireduxStorage.store.getState();

state.firestore.collection['todos']   // { docs: [...], collectionName, whereCondition }
state.firestore.document              // single fetched document
state.firestore.status                // 'idle' | 'loading' | 'succeeded' | 'failed'
state.storage.url                     // download URL after file upload
state.storage.status
state.auth.user                       // { uid, email, displayName, photoURL, emailVerified } | null
state.auth.status
state.auth.error
```

`storeAs` controls the key under `state.firestore.collection`; defaults to `collectionName`.

---

## TypeScript

Type declarations are included — no `@types/` package needed.

```ts
import { initializeFiredux, executeQueries } from 'firedux-storage';
import type { QueryObject, QueryResult, FirebaseConfig } from 'firedux-storage';

const config: FirebaseConfig = { apiKey: '...', /* ... */ };
initializeFiredux(config);

const results: QueryResult[] = await executeQueries([
  { queryType: 'getCollectionData', collectionName: 'todos' },
]);
```

Available types: `FirebaseConfig`, `FireduxOptions`, `QueryType`, `QueryObject`, `QueryResult`, `AuthUser`.

---

## License

MIT

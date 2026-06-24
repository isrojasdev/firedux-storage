# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

> **Regla:** Toda implementación que cambie comportamiento observable debe tener entrada aquí antes del commit.
> Para cambios breaking, añadir subsección `### Migration` con pasos exactos.

---

## [1.1.3] — 2026-06-23

### Fixed
- `z` ya no es `undefined` al importar desde `firedux-storage` en entornos webpack/CRA.
  - **Causa:** rollup intentaba bundlear zod v4 (ESM nativo) en el bundle CJS y fallaba silenciosamente — `exports.z` existía pero sin valor asignado.
  - **Fix:** zod marcado como `external` en rollup. El CJS bundle ahora tiene `require("zod")` y el ESM bundle tiene `import { z } from "zod"`. Zod sigue en `dependencies` así que se instala automáticamente.
  - El warning de circular dependency en zod (durante el build) también desaparece.

---

## [1.1.2] — 2026-06-23

### Added
- **example-react**: Auth section (Google sign-in/sign-out via `signInGoogle`/`signOut`) + Zod schema para colección `todos` en `initializeFiredux`
- **example-simple**: Reescrito como Vite vanilla JS — real-time listener, add/delete, Google auth, Zod validation, `store.subscribe` para re-render
- **example-vue**: Nuevo ejemplo Vue 3 + Vite con Composition API — composable `useSelector` que bridge Redux → `ref` reactivo
- **example-angular**: Nuevo ejemplo Angular 18 — `FireduxService` que expone `todos$` / `user$` como `BehaviorSubject` (RxJS)
- **example-nextjs**: Nuevo ejemplo Next.js 15 App Router — `FireduxProvider` (Client Component) wrapping `react-redux Provider`, `'use client'` TodoList con `useSelector`

---

## [1.1.1] — 2026-06-23

### Changed
- README reescrito completamente con API completa:
  - Tabla de todos los `queryType` con parámetros requeridos/opcionales
  - Ejemplos para Firestore (reads y writes), Auth, Storage
  - Sección de validación con Zod
  - Sección de TypeScript (tipos disponibles)
  - Redux state shape documentada
  - Corregida inconsistencia: `deleteDocument` → `removeDocument`

---

## [1.1.0] — 2026-06-23

### Added
- **TypeScript support:** `dist/index.d.ts` generado automáticamente con `tsc --allowJs --emitDeclarationOnly`
- Tipos públicos: `FirebaseConfig`, `FireduxOptions`, `QueryType`, `QueryObject`, `QueryResult`, `AuthUser`
- `"types": "dist/index.d.ts"` en `package.json` — los consumidores TS tienen autocompletado sin instalar tipos extra
- JSDoc completo en `index.js`, `Queries.js` y `auth.js`
- Script `"build:types": "tsc"` para regenerar solo los tipos
- `tsconfig.json` en `packages/core`

### Usage (TypeScript)
```ts
import { initializeFiredux, executeQueries } from 'firedux-storage';
// Tipos inferidos automáticamente — no se necesita @types/firedux-storage
```

---

## [1.0.1] — 2026-06-23

### Added
- Vitest test suite: 42 tests across 6 files (`schemaRegistry`, `buildQueryParameters`, `executeQueries`, `auth`, `storage`, `realtime`)
- GitHub Actions workflow: runs tests on every push/PR to `main` and `develop`
- `vitest.config.js` in `packages/core`

---

## [1.0.0] — 2026-06-18

### Added
- **Auth — email/password:** `signInEmail`, `signUpEmail`, `resetPassword` via `executeQueries`
- **Auth — OAuth:** `signInGoogle`, `signInFacebook` via `executeQueries`
- **Auth — session:** `signOut` via `executeQueries`
- **Firebase Storage:** `uploadFile`, `deleteFile` via `executeQueries`
- `authSlice.js`: Redux slice with `state.auth.{ user, status, error }`
- `Storage.js` actions module following the existing `actions/ → slices/` pattern
- Auth user shape in store: `{ uid, email, displayName, photoURL, emailVerified }`

### Usage examples
```js
// Sign in
await executeQueries([{ queryType: 'signInEmail', email: 'user@example.com', password: '...' }]);
await executeQueries([{ queryType: 'signInGoogle' }]);

// Upload file
await executeQueries([{ queryType: 'uploadFile', file, fileName: 'avatar', folder: 'users' }]);

// Delete file
await executeQueries([{ queryType: 'deleteFile', fileUrl: 'https://...' }]);
```

### Redux state shape (complete)
```js
state.firestore.collection[storeAs]  // Firestore collections
state.firestore.document             // single document
state.firestore.status
state.storage.url                    // last upload download URL
state.storage.status
state.auth.user                      // { uid, email, displayName, photoURL, emailVerified }
state.auth.status
state.auth.error
```

---

## [0.9.0] — 2026-06-18

### Added
- **Zod validation layer** — register schemas per collection in `initializeFiredux`:
  ```js
  import { z, initializeFiredux } from 'firedux-storage';
  initializeFiredux(firebaseConfig, {
    schemas: {
      todos: z.object({ title: z.string().min(1), status: z.enum(['pending', 'completed']) }),
    },
  });
  ```
- Validation runs automatically before `addDocument` and `updateDocument`. Reads (`getCollectionData`, `obtainRealTime`, `getDocumentById`) and `removeDocument` are never validated.
- Backward compatible: collections without a registered schema behave exactly as before — no schema, no validation, no error.
- `z` re-exported from `firedux-storage` — consumers do not need to install `zod` separately.
- `schemaRegistry.js` singleton (`registerSchemas`, `getSchema`, `clearRegistry`).

### Error format
When validation fails, `executeQueries` rejects with a structured error:
```
[firedux-storage] Validation failed for collection "todos" (addDocument):
  - title: String must contain at least 1 character(s)
  - status: Invalid enum value. Expected 'pending' | 'completed', received 'done'
```
Each issue is on its own line, prefixed with the field path and Zod's message.

### Breaking change
`FireduxStorage` is now a **named export** instead of a default export. Update imports:
```js
// Before (0.8.x)
import FireduxStorage, { initializeFiredux } from 'firedux-storage';

// After (0.9.0)
import { FireduxStorage, initializeFiredux } from 'firedux-storage';
```
Named exports (`executeQueries`, `initializeFiredux`, `z`) are unchanged.

---

## [0.8.1] — 2025-03-13

### Fixed
- Fixed Rollup build configuration

### Changed
- Updated license to MIT

---

## [0.8.0] — 2025-03-12

### Added
- Firestore real-time sync via `obtainRealTime` (onSnapshot)
- Firestore CRUD: `addDocument`, `updateDocument`, `removeDocument`, `getCollectionData`, `getDocumentById`
- `executeQueries` as single public entry point for all Firestore operations
- Pre-configured Redux store (no boilerplate needed by consumer)
- `buildQueryParameters` utility: supports `where`, `limit`, `orderBy` conditions
- `resolveReferences` utility: auto-resolves Firestore DocumentReference fields
- Firebase Storage slice (`setFile`, `deleteFile`) — not yet wired into `executeQueries`
- Auth helpers (`singInWithGoogle`, `singInWithFacebook`) — not yet wired into store
- Rollup build: dual output CJS + ESM

---

## [0.3.1] — 2025-01-04

### Added
- Initial alpha release
- Basic project structure as yarn workspace monorepo
- `packages/core` as the publishable library
- `packages/example-react` as CRA demo

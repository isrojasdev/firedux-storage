# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Root (monorepo)
```sh
yarn install                        # install all workspace dependencies
npm run dev                         # watch-build core + start React example simultaneously
npm run dev:core                    # watch-build core only (rollup --watch)
npm run dev:react                   # start React example only
```

### packages/core
```sh
npm -w packages/core run build      # production build → dist/
npm -w packages/core run dev        # watch build
```

### packages/example-react
```sh
npm -w packages/example-react start # start CRA dev server
npm -w packages/example-react test  # run React tests (Jest / Testing Library)
```

There are no tests defined yet in `packages/core` (`npm test` exits 1 with a placeholder message).

## Architecture

This is a **yarn workspace monorepo**. The root `package.json` uses `npm -w` syntax for workspace commands (mix of yarn for install, npm for scripts).

### packages/core — the published library

The library wraps Firebase Firestore + Firebase Storage with a pre-configured Redux store, so consumers never write Redux boilerplate.

**Initialization flow (must happen before any query):**
```
initializeFiredux(firebaseConfig)
  └─ initializeFirebase(config)   → sets firebaseInstance.{app, db}
  └─ initializeStore()            → configureStore({ firestore, storage })
```

**Query flow — single public entry point:**
```
executeQueries([{ queryType, collectionName, ... }])
  └─ querySelector(query)
       ├─ obtainRealTime()    → RealTime.js  → onSnapshot → dispatches getCollectionRealTime thunk
       ├─ getCollectionData() → Database.js  → dispatches getCollection thunk
       ├─ getDocumentById()   → Database.js  → dispatches getDocument thunk
       ├─ addDocument()       → Database.js  → dispatches setDocument thunk
       ├─ updateDocument()    → Database.js  → dispatches editDocument thunk
       └─ removeDocument()    → Database.js  → dispatches deleteDocument thunk
```

There is a **two-layer adapter pattern**: `actions/` functions (the public-facing API called by `executeQueries`) dispatch Redux thunks defined in `slices/firestoreSlice.js`. Never call the slice thunks directly from outside.

**Redux state shape:**
```js
state.firestore.collection[storeAs]   // { docs: [...], collectionName, whereCondition }
state.firestore.document              // single fetched document
state.firestore.status                // "idle" | "loading" | "succeeded" | "failed"
state.storage.url                     // download URL after file upload
state.storage.status
state.auth.user                       // { uid, email, displayName, photoURL, emailVerified } | null
state.auth.status
state.auth.error
```

`storeAs` (optional query param) controls the key under `state.firestore.collection`; defaults to `collectionName`.

**Utilities:**
- `utils/buildQueryParameters.js` — assembles Firestore `query()` from `whereCondition` (single or array of conditions), `limitCondition`, `orderByCondition`
- `utils/resolveReferences.js` — auto-resolves Firestore `DocumentReference` fields listed in `keyReference` array

**Auth** (`slices/authSlice.js`, `actions/auth.js`) and **Storage** (`slices/storageSlice.js`, `actions/Storage.js`) are fully wired into `executeQueries`. Auth queryTypes: `signInEmail`, `signUpEmail`, `signInGoogle`, `signInFacebook`, `signOut`, `resetPassword`. Storage queryTypes: `uploadFile`, `deleteFile`.

### Build (packages/core)

Rollup outputs two formats:
- `dist/index.js` — CommonJS
- `dist/index.esm.js` — ESM

`redux` and `firebase` are **externalized** (peer dependencies, not bundled). `@reduxjs/toolkit` is bundled.

### packages/example-react

A Create React App demo wired to a live Firebase project. It imports `firedux-storage` via the `workspace:*` reference in `package.json`. Firebase config is read from `.env` (REACT_APP_* variables, not committed).

### Known inconsistency

The root `README.md` documents `deleteDocument` as a `queryType`, but the implementation uses `removeDocument`. Use `removeDocument` in code.

## Design Principles

- **`actions/` → `slices/` only:** All Firestore/Storage/Auth operations flow through functions in `actions/`, which dispatch Redux thunks defined in `slices/`. Thunks are never exported directly from slices or called from outside `actions/`.
- **Single public entry point:** `executeQueries` is the only function consumers call for data operations. Auth helpers (`singInWithGoogle`, etc.) are the exception — they are direct calls, not routed through `executeQueries` yet.
- **Backward compatibility:** New parameters are always optional with safe defaults. Any change that breaks existing call signatures requires a major version bump (`BREAKING CHANGE:` in commit message).
- **Validation on writes only:** The Zod schema layer (Fase 1) validates `documentData` before writes (`addDocument`, `updateDocument`). Reads are never validated.

## Versioning policy

This library follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`).

### When to bump each segment

| Bump | When | Example |
|------|------|---------|
| `patch` | Bugfixes, internal refactors, docs, tests — no API change | `0.9.0` → `0.9.1` |
| `minor` | New features that are backward compatible — existing calls still work | `0.9.0` → `0.10.0` |
| `major` | Breaking changes to `executeQueries` signature, `initializeFiredux` signature, Redux state shape, or any exported name | `0.x.x` → `1.0.0` |

### Special rules for this project

- **Pre-1.0 (`0.x.x`):** The library is in active feature development. Minor bumps (`0.x`) may include breaking changes but must be noted in CHANGELOG.
- **1.0.0:** Marks the library as feature-complete (all Firebase features wired: Firestore, Storage, Auth). This is the first stable public API.
- **Post-1.0:** Strict semver — no breaking changes without a major bump. If a change breaks any existing `executeQueries` call or `initializeFiredux` option, it requires `2.0.0`.
- **Deprecation before removal:** If an API needs to change post-1.0, log a `console.warn` deprecation notice in the minor release before removing it in the major.

### Commit format (Conventional Commits)

```
feat: add signInWithEmail queryType
fix: resolve references failing on empty keyReference array
chore: update rollup config
docs: add Zod usage examples to README
test: add auth.test.js with mocked Firebase
BREAKING CHANGE: rename removeDocument to deleteDocument in executeQueries
```

### CHANGELOG rule

**Every commit that changes observable behavior must update `CHANGELOG.md` first.** No exceptions for features, bugfixes, or API changes. Docs-only and chore commits (config tweaks, dependency bumps with no behavior change) may skip it.

For breaking changes, the CHANGELOG entry must include a `### Migration` subsection with exact steps (what to rename, what signatures changed, what to update in user code).

### Release steps

1. `npm -w packages/core run build`
2. Bump `version` in `packages/core/package.json`
3. Add versioned entry to `CHANGELOG.md` (move from Unreleased if needed)
4. Update `ROADMAP.md` (mark completed tasks `[x]`, update "Estado actual" and "Versión en npm")
5. Update `CLAUDE.md` → "Current phase" section if the phase changed
6. Commit: `chore: release vX.X.X`
7. Tag: `git tag vX.X.X`
8. `npm publish` from `packages/core/`

## Current phase

**Active phase:** Roadmap completo ✅ — mantenimiento y mejoras incrementales
See [ROADMAP.md](./ROADMAP.md) for full roadmap and task status.

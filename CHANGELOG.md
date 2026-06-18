# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

> **Regla:** Toda implementación que cambie comportamiento observable debe tener entrada aquí antes del commit.
> Para cambios breaking, añadir subsección `### Migration` con pasos exactos.

---

## [0.9.0] — 2026-06-18

### Added
- Zod validation layer: register schemas per collection via `initializeFiredux(config, { schemas: {} })`
- `validateDocument` runs before `addDocument` and `updateDocument`; reads are not validated
- Clear error format: `[firedux-storage] Validation failed for collection "X" (queryType):\n  - field: message`
- Re-export `z` from `firedux-storage` so consumers can import Zod without installing it separately
- `schemaRegistry.js` singleton (`getSchema`, `registerSchemas`, `clearRegistry`)
- Backward compatible: collections without a registered schema behave exactly as before

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

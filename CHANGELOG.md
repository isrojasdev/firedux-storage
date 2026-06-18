# Changelog

All notable changes to this project will be documented in this file.
Format: [Semantic Versioning](https://semver.org/) — `MAJOR.MINOR.PATCH`

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

---

## [Unreleased]

### Added
- `ROADMAP.md` — living roadmap document with phase tracking
- `CLAUDE.md` — guidance for Claude Code with architecture, design principles, versioning policy and release process
- Adopted Conventional Commits format
- Defined versioning policy: 1.0.0 targets feature-complete (Firestore + Storage + Auth)

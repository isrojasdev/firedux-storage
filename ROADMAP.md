# Firedux Storage — Roadmap

> Documento vivo. Actualizar conforme avancen las fases.
> Convenciones: `[ ]` pendiente · `[~]` en progreso · `[x]` completado

## Estado actual

**Fase activa:** FASE 4 — TypeScript (type declarations)
**Versión en npm:** 1.0.0 → próximo release: 1.0.1
**Próximo bump:** 1.0.1 (patch) — listo para publicar

---

## FASE 0 — Versioning y proceso de release ✅
**Objetivo:** Tener el proceso de releases bajo control antes de cambiar código.

- [x] Adoptar Conventional Commits (`feat:`, `fix:`, `chore:`, `BREAKING CHANGE:`)
- [x] Crear `CHANGELOG.md` con historial desde v0.8.1
- [x] Definir política de semver en CLAUDE.md
- [x] Documentar flujo de release en CLAUDE.md (`build → bump → publish`)
- [x] Añadir sección "Design Principles" a CLAUDE.md
- [x] Añadir sección "Current Phase" a CLAUDE.md

---

## FASE 1 — Capa de validación con Zod ✅
**Objetivo:** Validar datos antes de writes sin romper la API existente.
**Versión objetivo:** 0.9.0

- [x] Añadir `zod` a dependencies en `packages/core/package.json`
- [x] Crear `packages/core/src/schemas/schemaRegistry.js` (Map singleton)
- [x] Actualizar `initializeFiredux(config, options = {})` — aceptar `options.schemas`
- [x] Integrar validación en `querySelector` antes del switch (solo writes)
- [x] Formato de error claro: colección + queryType + issues de Zod
- [x] Verificar backward compatibility (sin schema = comportamiento actual)

---

## FASE 2 — Auth completo + Storage integrado ✅
**Objetivo:** Completar el feature set de Firebase. Primera versión estable con todas las features.
**Versión objetivo:** 1.0.0

- [x] Crear `packages/core/src/slices/authSlice.js`
- [x] Completar `actions/auth.js`: email/password, signOut, resetPassword
- [x] Integrar Auth (Google + Facebook) al Redux store
- [x] Añadir `authReducer` a `store.js`
- [x] Exponer Storage en `executeQueries` (`uploadFile`, `deleteFile` queryTypes)
- [x] Exponer Auth en `executeQueries` (`signInEmail`, `signInGoogle`, `signOut`, etc.)

---

## FASE 3 — Testing con Vitest ✅
**Objetivo:** Tests automáticos para cada feature, sin acceso a red.
**Versión objetivo:** 1.0.1

- [x] Instalar y configurar Vitest en `packages/core`
- [x] Añadir `"test": "vitest run"` en `packages/core/package.json`
- [x] `schemaRegistry.test.js`
- [x] `buildQueryParameters.test.js`
- [x] `executeQueries.test.js` (routing + validación Zod)
- [x] `realtime.test.js` (onSnapshot mockeado)
- [x] `storage.test.js`
- [x] `auth.test.js`
- [x] GitHub Actions: correr tests en cada PR (`.github/workflows/test.yml`)

---

## FASE 4 — TypeScript (type declarations)
**Objetivo:** Soporte de tipos para consumidores TS sin migrar el código a TS.
**Versión objetivo:** 1.1.0

- [ ] Crear `packages/core/tsconfig.json` (emitDeclarationOnly)
- [ ] Añadir `"types": "dist/index.d.ts"` en `packages/core/package.json`
- [ ] Anotar con JSDoc: `index.js`, `Queries.js`, `auth.js`
- [ ] Tipos clave: `FirebaseConfig`, `FireduxOptions`, `QueryObject`, `QueryType`

---

## FASE 5 — Documentación
**Objetivo:** README completo, sin inconsistencias, con todos los features.
**Versión objetivo:** 1.1.1

- [ ] Corregir inconsistencia: README dice `deleteDocument`, código usa `removeDocument`
- [ ] Actualizar README con API completa (auth, storage, db, Zod)
- [ ] Tabla de `queryType` con parámetros requeridos/opcionales
- [ ] Sección de uso con TypeScript
- [ ] Sección de validación con Zod

---

## FASE 6 — Ejemplos por framework
**Objetivo:** Ejemplo funcional para cada framework soportado.
**Versión objetivo:** 1.1.2

- [ ] `example-react` — completar con auth + storage + Zod validation
- [ ] `example-simple` — HTML vanilla completo
- [ ] `example-vue` — implementar desde el esqueleto existente
- [ ] `example-angular` — implementar desde el esqueleto existente
- [ ] `example-nextjs` — nuevo, demostrar SSR

---

## Tabla de versiones

| Fase | Descripción                    | Bump    | Versión |
|------|--------------------------------|---------|---------|
| 0    | Versioning + CHANGELOG         | —       | 0.8.1   |
| 1    | Zod validation layer           | minor   | 0.9.0   |
| 2    | Auth + Storage completo        | **major** | **1.0.0** |
| 3    | Testing (Vitest)               | patch   | 1.0.1   |
| 4    | TypeScript declarations        | minor   | 1.1.0   |
| 5    | Documentación                  | patch   | 1.1.1   |
| 6    | Framework examples             | patch   | 1.1.2   |

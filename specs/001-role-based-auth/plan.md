# Implementation Plan: Role-Based Access Login

**Branch**: `001-role-based-auth` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-role-based-auth/spec.md`

**Note**: This plan covers Phase 0 research and Phase 1 design artifacts for introducing
role-backed access control into the existing Laravel + React starter kit.

## Summary

Add persistent role-backed access control so only `admin` and `tech lead` users can enter the
application through the existing Fortify login flow. The design keeps the current Inertia-based
auth experience, adds normalized role storage in PostgreSQL, enforces role eligibility during
authentication and protected-route access, and propagates the user's role to the React frontend
for role-aware navigation and messaging.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7, React 19  
**Primary Dependencies**: Laravel 13, Laravel Fortify, Inertia.js, React 19, Tailwind CSS 4,
shadcn/ui, Wayfinder  
**Storage**: PostgreSQL  
**Testing**: PHPUnit feature tests, Laravel integration tests, ESLint, Prettier, TypeScript
checks  
**Target Platform**: Responsive internal web application for admin and tech lead users  
**Project Type**: Laravel + React web application  
**Performance Goals**: Authentication and role lookup complete within a single bounded user query
plus eager-loaded role data; no N+1 behavior on role-aware protected views  
**Constraints**: Secure by default, no N+1 queries, preserve existing Fortify login entry point,
responsive login states across mobile and desktop, single active approved role per user in this
feature scope  
**Scale/Scope**: Internal application with two approved roles, existing Fortify-authenticated user
base, PostgreSQL-backed relational access rules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Secure-by-Default Backend`: Pass. Access remains under Laravel Fortify and auth middleware.
  Role eligibility will be enforced during authentication and protected-route access using
  validation, policies or middleware, and explicit denial messaging.
- `Query-Efficient Data Access`: Pass. The design uses normalized role tables with eager loading
  of the active role relationship for auth/session sharing and protected screens. No list or
  dashboard access in scope requires unbounded reads.
- `Contract-Driven Full-Stack Delivery`: Pass. The login response, shared auth payload, protected
  route behavior, and role-aware frontend typing are documented together.
- `Responsive and Accessible Frontend`: Pass. Existing Inertia login UI is retained and updated
  with role-based denial states that must remain usable across supported breakpoints.
- `Quality Gates and Operational Readiness`: Pass. Planned verification includes auth feature
  tests, role-access tests, linting, formatting, and TypeScript checks.

## Project Structure

### Documentation (this feature)

```text
specs/001-role-based-auth/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- auth-role-access.md
`-- tasks.md
```

### Source Code (repository root)

```text
app/
|-- Actions/
|   `-- Fortify/
|-- Http/
|   |-- Controllers/
|   |-- Middleware/
|   `-- Requests/
|-- Models/
|-- Providers/
`-- Services/

database/
|-- factories/
|-- migrations/
`-- seeders/

resources/
`-- js/
    |-- components/
    |-- layouts/
    |-- pages/
    |-- routes/
    `-- types/

routes/
|-- web.php
`-- settings.php

tests/
|-- Feature/
`-- Unit/
```

**Structure Decision**: Use the existing Laravel application structure. Backend auth and role
logic stays in `app/`, persistence changes live in `database/`, route enforcement remains in
`routes/`, and login plus shared auth typing updates stay in `resources/js/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations are currently expected. No exception record is required.

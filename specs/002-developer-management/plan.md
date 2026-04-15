# Implementation Plan: Developer Management

**Branch**: `002-developer-management` | **Date**: 2026-04-16 | **Spec**: [spec.md](C:\Projects\engineer-monitor\specs\002-developer-management\spec.md)  
**Input**: Feature specification from `/specs/002-developer-management/spec.md`

## Summary

Add a protected developer management workspace where tech leads, with inherited admin access, can create, view, update, and delete developer roster records. The implementation will introduce a dedicated `Developer` domain model separate from authenticated `User` accounts, expose Laravel web routes and Inertia page props for a paginated roster table, and enforce least-privilege access plus duplicate-email validation across all mutating actions.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7  
**Primary Dependencies**: Laravel 13, Laravel Fortify, Inertia.js, React 19, Tailwind CSS 4, Wayfinder  
**Storage**: Laravel-supported relational database with SQLite in local/test by default  
**Testing**: PHPUnit 12 feature tests, Laravel integration assertions, ESLint, Prettier, TypeScript no-emit checks  
**Target Platform**: Internal web application for authenticated staff  
**Project Type**: Laravel + React Inertia web application  
**Performance Goals**: Paginated developer list loads within the user-facing 2 second success threshold, uses bounded queries for roster reads, and reflects successful mutations in the next rendered response without manual refresh  
**Constraints**: Secure-by-default privileged access, explicit role matrix, no duplicate developer emails, no N+1 queries, responsive table and form states across breakpoints, keyboard-accessible interactions, no user-account provisioning in this feature  
**Scale/Scope**: Internal roster management for a growing but bounded developer directory, initially focused on one management page with CRUD operations and paginated listing  
**Authorization Model**: `tech-lead` and `admin` can view and manage developers; `admin` inherits every `tech-lead` capability; admin-only user or role administration remains outside this feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Secure-by-Default Backend`: Enforce authenticated access with `auth`, `verified`, and `active-role` middleware plus a feature-specific gate or policy that allows `tech-lead` and `admin`. Use Form Requests for create/update validation, trim and normalize email input, reject duplicate emails, and flash success/error feedback through existing Inertia patterns. No new secrets are introduced. Audit-relevant coverage will come from authorization and mutation feature tests rather than bespoke logging unless the implementation reveals a compliance need.
- `Query-Efficient Data Access`: Serve the roster from a dedicated paginated query on the `developers` table with explicit ordering and bounded page size. No related-model fan-out is required for MVP, so N+1 risk is limited; query inspection during implementation should confirm list reads remain a single paginated select plus count query.
- `Contract-Driven Full-Stack Delivery`: Add a Laravel controller, request objects, routes, and Inertia page/component contract for developer listing and CRUD actions. The frontend will consume paginated developer props, validation errors, and flash messages on a dedicated page. Role-access matrix: `tech-lead` = view/add/edit/delete developers; `admin` = same inherited capabilities plus existing admin-only features outside this scope; all other users = no access.
- `Responsive and Accessible Frontend`: Verify the page at small, medium, and large breakpoints with stacked form layout, scroll-safe table container, visible empty/loading/error states, keyboard-reachable row actions, and confirmation flow for deletion. Unavailable actions must not render for unauthorized users because the route is not accessible to them.
- `Quality Gates and Operational Readiness`: Planned checks are targeted PHPUnit feature tests for authorization and CRUD flows, validation coverage for duplicate email and invalid role types, pagination/query-shape verification as needed during implementation, plus `npm run lint:check`, `npm run format:check`, `npm run types:check`, and `composer test`. Tests must explicitly prove `tech-lead` access, `admin` inherited access, and denial for unauthorized users.

## Project Structure

### Documentation (this feature)

```text
specs/002-developer-management/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- developer-management.md
`-- tasks.md
```

### Source Code (repository root)

```text
app/
|-- Http/
|   |-- Controllers/
|   |   `-- DeveloperController.php
|   `-- Requests/
|       |-- StoreDeveloperRequest.php
|       `-- UpdateDeveloperRequest.php
|-- Models/
|   `-- Developer.php
|-- Policies/
|   `-- DeveloperPolicy.php
`-- Providers/
    `-- AppServiceProvider.php

database/
|-- factories/
|   `-- DeveloperFactory.php
`-- migrations/
    `-- *_create_developers_table.php

resources/
`-- js/
    |-- components/
    |   `-- developers/
    |       |-- developer-form.tsx
    |       `-- developers-table.tsx
    |-- pages/
    |   `-- developers/
    |       `-- index.tsx
    `-- types/
        `-- developer.ts

routes/
`-- web.php

tests/
`-- Feature/
    `-- Developers/
        `-- DeveloperManagementTest.php
```

**Structure Decision**: Use the repository's existing Laravel + React Inertia structure. Keep privileged business rules in Laravel requests/policies/controllers, persist developer roster data in a dedicated Eloquent model and migration, and render the management experience from one Inertia page backed by reusable developer-specific components.

## Complexity Tracking

No constitution exceptions are required for this plan.

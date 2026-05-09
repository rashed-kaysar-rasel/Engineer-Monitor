# Implementation Plan: project-creation

**Branch**: `003-project-creation` | **Date**: 2026-04-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-project-creation/spec.md`

## Summary

Implement a new "Projects" page accessible to `techlead` and `admin` users, allowing them to create projects by providing a title, description, initial status, and selecting a project lead from active users.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7
**Primary Dependencies**: Laravel 13, React 19, Inertia.js, Tailwind CSS 4
**Storage**: SQLite (local/test), Relational DB (prod)
**Testing**: PHPUnit (Laravel feature tests), ESLint, TypeScript checks
**Target Platform**: Web Application
**Project Type**: Laravel + React web application
**Performance Goals**: <200ms p95 list loads, no N+1 queries, <1s page load for projects list and dropdowns
**Constraints**: Secure by default, responsive across breakpoints, semantic HTML
**Scale/Scope**: Multi-role operations (admin, techlead), standard pagination
**Authorization Model**: `admin` inherits all `techlead` capabilities. Creating projects is available to both `techlead` and `admin`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Secure-by-Default Backend`: We will use Laravel Form Requests for validation and Policies for authorization. CSRF protection and mass-assignment protection will be provided by default Laravel setup. The `ProjectPolicy` will explicitly permit `admin` and `techlead` to `create` projects.
- `Query-Efficient Data Access`: The list of available project leads will be fetched via a minimal select (`id`, `name`) restricted to active users to avoid unbounded reads. If the project list is displayed, it will be paginated and eager-load the `lead` relationship to prevent N+1 queries.
- `Contract-Driven Full-Stack Delivery`: The backend route `/projects` (GET for index, POST for store) and React/Inertia page `Projects/Index` will be aligned. Validations from `StoreProjectRequest` will map to frontend validation errors. Since both `admin` and `techlead` have access, the UI actions will be visible to both without role leaks.
- `Responsive and Accessible Frontend`: The `Projects/Index` and the creation form will use Tailwind CSS to remain responsive. Form inputs will have visible focus states, semantic HTML (`<form>`, `<label>`), and handle empty/loading states gracefully.
- `Quality Gates and Operational Readiness`: We will add PHPUnit feature tests to ensure `admin` and `techlead` can create projects, while regular users get a 403. Linting, formatting, and type checks will pass.

## Project Structure

### Documentation (this feature)

```text
specs/003-project-creation/
|-- plan.md              
|-- research.md          
|-- data-model.md        
|-- quickstart.md        
|-- contracts/           
`-- tasks.md             
```

### Source Code (repository root)

```text
app/
|-- Http/
|   |-- Controllers/
|   |   `-- ProjectController.php
|   `-- Requests/
|       `-- StoreProjectRequest.php
|-- Models/
|   `-- Project.php
|-- Policies/
|   `-- ProjectPolicy.php
|-- Services/
|   `-- ProjectService.php

resources/
`-- js/
    `-- Pages/
        `-- Projects/
            |-- Index.tsx
            `-- Partials/
                `-- CreateProjectForm.tsx

routes/
`-- web.php

tests/
`-- Feature/
    `-- ProjectCreationTest.php
```

**Structure Decision**: Selected standard Laravel + React web application structure, mapped to the specific components needed for project creation.

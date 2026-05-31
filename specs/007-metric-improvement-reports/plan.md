# Implementation Plan: Metric Improvement Reports

**Branch**: `007-metric-improvement-reports` | **Date**: 2026-05-22 | **Spec**: [spec.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/spec.md)
**Input**: Feature specification from `/specs/007-metric-improvement-reports/spec.md`

## Summary

Implement a new reporting module for Tech-leads and Admins to view and compare team performance metrics across weekly, monthly, or custom date ranges. The report aggregates bug counts (by project, severity, and status), feature shipments (by leadership and by developer), client complaints (by severity), and developer velocity (total points of completed shipments). Side-by-side comparison of Period A (older) and Period B (newer) will display percentage improvements or regressions (e.g. decrease in bugs, increase in shipments/velocity).

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7  
**Primary Dependencies**: Laravel 13, React 19, Inertia.js, Tailwind CSS 4, Lucide React  
**Storage**: SQLite (local/testing), PostgreSQL (production)  
**Testing**: PHPUnit feature tests, ESLint, TypeScript compiler check  
**Target Platform**: Web application (desktop and mobile responsive)  
**Project Type**: Laravel + React web application  
**Performance Goals**: Dashboard rendering in under 1.5s, eager-loaded queries with bounded result counts, database indexes on date columns.  
**Constraints**: Secure-by-default access control (Developer role blocked with 403 response), no N+1 query execution, responsive card layout.  
**Scale/Scope**: Aggregated metrics dashboard and period-over-period comparisons for tech-leads and admins.  
**Authorization Model**: Shared access for `admin` and `techlead` roles. Both roles have access to the Reports module, while `developer` has no access.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Secure-by-Default Backend`: Access to reports will be controlled via Laravel routing middleware (`can:view-reports`) or Policy gates, returning 403 Forbidden for unauthorized roles (`developer`). A dedicated `ReportPolicy` will check user roles.
- `Query-Efficient Data Access`: Queries will aggregate records directly in the database (`count`, `sum`, `groupBy`) rather than loading raw Eloquent collections in memory. All relationships (e.g. `project`, `developer`, `approver`) will be eager-loaded if needed, but direct aggregations are preferred.
- `Contract-Driven Full-Stack Delivery`: An API contract will define the structure of the `MetricReport` and `ComparisonResult` payloads. The backend will return Inertia props conforming to these types, and the React frontend will render them using clean grid cards.
- `Responsive and Accessible Frontend`: Standard grid columns (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`) will adjust elements cleanly across mobile and desktop. Hidden actions or unavailable states will not be rendered.
- `Quality Gates and Operational Readiness`: The implementation will be verified through automated tests (`ReportControllerTest.php`) validating both authorization and metric calculations. ESLint and TypeScript checking will run on pre-commit/pre-merge.

## Project Structure

### Documentation (this feature)

```text
specs/007-metric-improvement-reports/
|-- plan.md              # This file
|-- research.md          # Technical research decisions
|-- data-model.md        # Entities and structures
|-- quickstart.md        # Code integration samples
`-- contracts/           # API payload specifications
    `-- api.md
```

### Source Code

```text
app/
|-- Http/
|   |-- Controllers/
|   |   `-- ReportController.php
|   `-- Requests/
|       `-- GenerateReportRequest.php
|-- Policies/
|   `-- ReportPolicy.php
`-- Services/
    `-- ReportService.php

resources/
`-- js/
    `-- pages/
        `-- reports/
            `-- index.tsx

routes/
`-- web.php

tests/
`-- Feature/
    `-- ReportControllerTest.php
```

**Structure Decision**: Option 2 (Laravel + React web application) is selected, creating a controller, a service, a Request validator, Inertia page components, and a dedicated test suite.

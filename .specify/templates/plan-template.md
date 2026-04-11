# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See
`.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., PHP 8.3, TypeScript 5.7 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Laravel 13, React 19, Inertia, Tailwind or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., MySQL, PostgreSQL, SQLite or N/A]  
**Testing**: [e.g., PHPUnit, Laravel feature tests, ESLint, TypeScript checks or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., web application, mobile web, internal admin or NEEDS CLARIFICATION]  
**Project Type**: [e.g., Laravel + React web application or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., <200ms p95 list loads, bounded query counts or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., secure by default, no N+1 queries, responsive across breakpoints]  
**Scale/Scope**: [domain-specific, e.g., 10k users, admin dashboard, multi-role operations]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `Secure-by-Default Backend`: Identify authentication, authorization, validation, secret
  handling, and audit/logging impacts. Document the Laravel mechanism that enforces each one.
- `Query-Efficient Data Access`: Describe the expected query shape for lists, dashboards, and
  related-model access. State how N+1 risks are prevented and how large result sets are bounded.
- `Contract-Driven Full-Stack Delivery`: List the backend contract changes and the corresponding
  React/Inertia pages, components, or props affected by the change.
- `Responsive and Accessible Frontend`: State the target breakpoints, interaction modes, and
  loading/error/empty states that must be verified.
- `Quality Gates and Operational Readiness`: List the automated and manual checks required for the
  feature, including tests, linting, type checks, and any targeted security or performance
  validation.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
|-- plan.md              # This file (/speckit.plan command output)
|-- research.md          # Phase 0 output (/speckit.plan command)
|-- data-model.md        # Phase 1 output (/speckit.plan command)
|-- quickstart.md        # Phase 1 output (/speckit.plan command)
|-- contracts/           # Phase 1 output (/speckit.plan command)
`-- tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., app/Actions, resources/js/pages). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
|-- models/
|-- services/
|-- cli/
`-- lib/

tests/
|-- contract/
|-- integration/
`-- unit/

# [REMOVE IF UNUSED] Option 2: Laravel + React web application
app/
|-- Actions/
|-- Http/
|   |-- Controllers/
|   `-- Requests/
|-- Models/
|-- Policies/
`-- Services/

resources/
`-- js/
    |-- components/
    |-- hooks/
    |-- layouts/
    `-- pages/

routes/
tests/
|-- Feature/
`-- Unit/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
`-- [same as backend above]

ios/ or android/
`-- [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real directories
captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., extra abstraction layer] | [current need] | [why direct Laravel conventions were insufficient] |
| [e.g., caching or async workflow] | [specific problem] | [why synchronous or uncached flow is insufficient] |

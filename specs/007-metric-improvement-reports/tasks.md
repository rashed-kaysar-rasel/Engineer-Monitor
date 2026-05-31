# Tasks: Metric Improvement Reports

**Input**: Design documents from `/specs/007-metric-improvement-reports/`
**Prerequisites**: [plan.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/plan.md), [spec.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/spec.md), [research.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/research.md), [data-model.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/data-model.md), [contracts/api.md](file:///c:/Projects/engineer-monitor/specs/007-metric-improvement-reports/contracts/api.md)

**Tests**: Include tests whenever a story changes behavior, security, authorization, data loading, role access, or user-critical UI states.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and routing declaration.

- [x] T001 Define `/reports` route and reporting API endpoint in routes/web.php

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core authorization gates, backend skeleton files, and sidebar integration.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Implement `ReportPolicy` checking if user is admin or tech-lead in app/Policies/ReportPolicy.php
- [x] T003 Create `GenerateReportRequest` validator for date input checks in app/Http/Requests/GenerateReportRequest.php
- [x] T004 Create `ReportService` class skeleton in app/Services/ReportService.php
- [x] T005 Create `ReportController` handling response logic in app/Http/Controllers/ReportController.php
- [x] T006 [P] Add Reports menu link inside sidebar navigation for authorized roles in resources/js/components/app-sidebar.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Metrics Overview and Period Selection (Priority: P1) MVP

**Goal**: Tech-lead can view aggregated metrics for bugs, features, client complaints, and velocity over a selected period.

**Independent Test**: Navigate to `/reports`, select a custom range, and verify the rendered totals for bugs, features, complaints, and velocity match database queries.

### Tests for User Story 1

- [x] T007 [P] [US1] Write authorization tests and basic page render checks in tests/Feature/ReportControllerTest.php
- [x] T008 [P] [US1] Write database query unit tests for single period aggregations in tests/Feature/ReportControllerTest.php

### Implementation for User Story 1

- [x] T009 [US1] Implement single-period aggregation queries for bugs, features, complaints, and developer velocity in app/Services/ReportService.php
- [x] T010 [US1] Update ReportController to invoke the service and return single-period props in app/Http/Controllers/ReportController.php
- [x] T011 [P] [US1] Create React reports dashboard index page skeleton in resources/js/pages/reports/index.tsx
- [x] T012 [US1] Implement period selection controls (Weekly, Monthly, Custom) in resources/js/pages/reports/index.tsx
- [x] T013 [US1] Render single-period summary cards and detailed breakdown tables in resources/js/pages/reports/index.tsx

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Metric Improvement Comparison (Priority: P2)

**Goal**: Tech-lead can compare key metrics of two distinct periods (Period A vs Period B) side-by-side, displaying deltas and change indicators.

**Independent Test**: Select Period A and Period B, and verify comparison totals, delta percentages, and colored indicator badges.

### Tests for User Story 2

- [x] T014 [P] [US2] Write tests verifying comparison calculations and division-by-zero boundary safety in tests/Feature/ReportControllerTest.php

### Implementation for User Story 2

- [x] T015 [US2] Implement Period A vs Period B delta percentage calculations and improvement logic in app/Services/ReportService.php
- [x] T016 [US2] Update ReportController to support comparison mode parameters in app/Http/Controllers/ReportController.php
- [x] T017 [US2] Add Period A and Period B selector inputs on page in resources/js/pages/reports/index.tsx
- [x] T018 [US2] Render side-by-side metrics widgets and color-coded delta badges in resources/js/pages/reports/index.tsx
- [x] T019 [US2] Render a table of all developers with their individual points comparison and deltas in resources/js/pages/reports/index.tsx

**Checkpoint**: User Stories 1 and 2 work independently and together.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Quality checks, styling adjustments, and regression checks.

- [x] T020 [P] Run static analysis, linting, and formatting checks via composer and npm commands
- [x] T021 Run query performance inspections in app/Services/ReportService.php to ensure no N+1 query issues exist
- [x] T022 [P] Verify responsive card wrapping on mobile viewports in resources/js/pages/reports/index.tsx
- [x] T023 [P] Verify unauthorized developer access returns 403 Forbidden on the backend route

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Stories (Phases 3 and 4)**: Depend on Foundational phase completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No story dependencies.
- **User Story 2 (P2)**: Integrates comparison over the single-period foundation.

### Parallel Opportunities

- Foundational tasks marked [P] (T006) can run in parallel with controller/service setup.
- Tests (T007, T008) can be designed in parallel.
- Frontend component skeleton (T011) can be styled in parallel while backend queries are implemented.

---

## Parallel Example: User Story 1

```text
Task T007: "Write authorization tests and basic page render checks in tests/Feature/ReportControllerTest.php"
Task T011: "Create React reports dashboard index page skeleton in resources/js/pages/reports/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (blocks all stories).
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Verify User Story 1 independently.

### Incremental Delivery

1. Foundation ready.
2. Add User Story 1 -> Test independently -> Demo (MVP).
3. Add User Story 2 -> Test comparison deltas and developer table.
4. Verify responsiveness and role security gates.

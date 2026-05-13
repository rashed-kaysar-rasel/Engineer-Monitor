# Tasks: Bug Tracking

## Implementation Strategy

We will follow an incremental delivery approach, prioritizing the core recording functionality (P1) first. Each phase results in an independently testable increment of the feature.

## Phase 1: Setup

- [x] T001 Create migration for `bugs` table in `database/migrations/`
- [x] T002 Create migration for `bug_embeddings` table in `database/migrations/`
- [x] T003 Create `Bug` model with relationships and impact/status enums in `app/Models/Bug.php`
- [x] T004 Create `BugEmbedding` model in `app/Models/BugEmbedding.php`
- [x] T005 Create `BugFactory` in `database/factories/BugFactory.php`

## Phase 2: Foundational

- [x] T006 Implement `BugService` in `app/Services/BugService.php` with synchronous embedding generation logic
- [x] T007 Implement `BugPolicy` in `app/Policies/BugPolicy.php` to restrict access to `techlead` and `admin`
- [x] T008 Register `BugPolicy` in `app/Providers/AuthServiceProvider.php` (Auto-discovered)
- [x] T009 Define CRUD routes for bugs in `routes/web.php`

## Phase 3: User Story 1 - Recording a Bug (P1)

**Goal**: Tech leads can record a bug and have its embedding generated.
**Test Criteria**: Log a bug via the UI and verify it appears in the database with an associated embedding.

- [x] T010 [P] [US1] Create `StoreBugRequest` with validation rules in `app/Http/Requests/StoreBugRequest.php`
- [x] T011 [US1] Implement `index` and `store` methods in `app/Http/Controllers/BugController.php`
- [x] T012 [P] [US1] Create `BugIndex` page component in `resources/js/pages/bugs/index.tsx`
- [x] T013 [P] [US1] Create `BugCreate` page component in `resources/js/pages/bugs/partials/create-bug-modal.tsx`
- [x] T014 [US1] Create Feature Test for recording bugs in `tests/Feature/BugTrackingTest.php`

## Phase 4: User Story 2 - Resolving a Bug (P2)

**Goal**: Tech leads can mark a bug as resolved and assign a developer.
**Test Criteria**: Update a bug to "Resolved" with a developer and verify the record is updated.

- [x] T015 [P] [US2] Create `UpdateBugRequest` with conditional validation in `app/Http/Requests/UpdateBugRequest.php`
- [x] T016 [US2] Implement `edit` and `update` methods in `app/Http/Controllers/BugController.php`
- [x] T017 [P] [US2] Create `BugEdit` page component in `resources/js/pages/bugs/partials/edit-bug-modal.tsx`
- [x] T018 [US2] Add resolution logic to Feature Test in `tests/Feature/BugTrackingTest.php`

## Phase 5: User Story 3 - Visibility and AI Readiness (P3)

**Goal**: Bugs are visible and searchable, with embeddings ready for future analysis.
**Test Criteria**: Verify embedding content matches bug description and filters work in the index view.

- [x] T019 [US3] Implement filtering by project, impact, and status in `BugController@index`
- [x] T020 [US3] Verify vector storage integrity in `tests/Feature/BugTrackingTest.php`

## Phase 6: Polish & Integration

- [x] T021 Add "Bug Tracking" link to the application sidebar in `resources/js/components/app-sidebar.tsx`
- [ ] T022 Implement breadcrumbs for bug pages in `resources/js/pages/bugs/`
- [ ] T023 Run final linting and type checks (`php artisan lint`, `npm run type-check`)

## Dependencies

- [US1] depends on Phase 1 & 2.
- [US2] depends on [US1].
- [US3] depends on [US1].

## Parallel Execution Opportunities

- T010, T012, T013 can be implemented in parallel.
- T015 and T017 can be implemented in parallel.
- All Phase 1 tasks are independent.

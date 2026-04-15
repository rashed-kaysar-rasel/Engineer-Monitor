# Tasks: Developer Management

**Input**: Design documents from `/specs/002-developer-management/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include tests whenever a story changes behavior, security, authorization, data loading, role access, or user-critical UI states.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Laravel backend: `app/`, `database/`, `routes/`, `tests/`
- React/Inertia frontend: `resources/js/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature files and shared type surfaces that the implementation will use.

- [x] T001 Create the feature task scaffold and developer-specific directories in `app/Http/Controllers`, `app/Http/Requests`, `app/Models`, `app/Policies`, `database/factories`, `resources/js/components/developers`, `resources/js/pages/developers`, `resources/js/types`, and `tests/Feature/Developers`
- [x] T002 [P] Add developer route helper definitions for the new page actions in `resources/js/routes/` and any generated route export files used by the frontend
- [x] T003 [P] Define shared frontend developer types for page props, records, and capability flags in `resources/js/types/developer.ts` and update any relevant exports in `resources/js/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create the `developers` table migration with unique email and specialization constraints in `database/migrations/*_create_developers_table.php`
- [x] T005 [P] Implement the `Developer` Eloquent model with fillable fields, normalization helpers if needed, and query defaults in `app/Models/Developer.php`
- [x] T006 [P] Implement `DeveloperFactory` states for valid specialization values in `database/factories/DeveloperFactory.php`
- [x] T007 Implement authorization for shared tech-lead/admin developer management actions in `app/Policies/DeveloperPolicy.php` and register it in `app/Providers/AppServiceProvider.php`
- [x] T008 [P] Implement shared create/update validation rules for normalized developer input in `app/Http/Requests/StoreDeveloperRequest.php` and `app/Http/Requests/UpdateDeveloperRequest.php`
- [x] T009 Implement the base developer controller contract for paginated Inertia responses, flash feedback, and policy enforcement in `app/Http/Controllers/DeveloperController.php`
- [x] T010 Register authenticated, verified, active-role developer routes and policy middleware hooks in `routes/web.php`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Developer Records (Priority: P1) MVP

**Goal**: Let tech leads and admins create developer records with valid name, email, and specialization values.

**Independent Test**: Submit valid and invalid add requests and confirm successful records appear in the developer list while invalid and duplicate-email submissions are rejected with clear feedback.

### Tests for User Story 1

- [x] T011 [P] [US1] Add feature tests for authorized create access, unauthorized denial, and admin inherited access in `tests/Feature/Developers/DeveloperManagementTest.php`
- [x] T012 [P] [US1] Add feature tests for create validation, specialization enforcement, trimmed input, and duplicate-email protection in `tests/Feature/Developers/DeveloperManagementTest.php`

### Implementation for User Story 1

- [x] T013 [US1] Implement developer creation persistence, request normalization, and success/error flash handling in `app/Http/Controllers/DeveloperController.php`
- [x] T014 [P] [US1] Implement the add developer form UI with inline validation messaging in `resources/js/components/developers/developer-form.tsx`
- [x] T015 [US1] Integrate the add form into the developer management page with create capability gating in `resources/js/pages/developers/index.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Developer Directory (Priority: P2)

**Goal**: Show the current developer roster in a responsive, paginated data table with clear empty-state behavior.

**Independent Test**: Load the developer management page with and without seeded developer records and confirm authorized users see the paginated table, while unauthorized users cannot access it.

### Tests for User Story 2

- [x] T016 [P] [US2] Add feature tests for the `developers.index` page response, Inertia props, and unauthorized access denial in `tests/Feature/Developers/DeveloperManagementTest.php`
- [x] T017 [P] [US2] Add feature tests for empty-state rendering data, pagination metadata, and bounded roster ordering in `tests/Feature/Developers/DeveloperManagementTest.php`

### Implementation for User Story 2

- [x] T018 [US2] Implement the paginated developer listing query and Inertia page props in `app/Http/Controllers/DeveloperController.php`
- [x] T019 [P] [US2] Implement the responsive developer data table and empty-state UI in `resources/js/components/developers/developers-table.tsx`
- [x] T020 [US2] Compose the developer index page layout, capability props, and table integration in `resources/js/pages/developers/index.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Maintain Developer Records (Priority: P3)

**Goal**: Allow authorized users to edit and delete existing developer records while keeping the table accurate.

**Independent Test**: Update an existing developer with valid data, reject invalid or duplicate updates, delete a developer through confirmation, and confirm the table reflects both actions immediately.

### Tests for User Story 3

- [x] T021 [P] [US3] Add feature tests for authorized update and delete flows plus admin inherited access in `tests/Feature/Developers/DeveloperManagementTest.php`
- [x] T022 [P] [US3] Add feature tests for duplicate-email update rejection, missing-record handling, and delete confirmation expectations in `tests/Feature/Developers/DeveloperManagementTest.php`

### Implementation for User Story 3

- [x] T023 [US3] Implement developer update and delete controller actions with latest-state handling and flash feedback in `app/Http/Controllers/DeveloperController.php`
- [x] T024 [P] [US3] Extend the developer form component for edit mode and row-level submission flows in `resources/js/components/developers/developer-form.tsx`
- [x] T025 [P] [US3] Add editable row actions and delete confirmation UI in `resources/js/components/developers/developers-table.tsx`
- [x] T026 [US3] Integrate edit/delete state management and row refresh behavior in `resources/js/pages/developers/index.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T027 [P] Add focused query, authorization, and responsive regression notes to `specs/002-developer-management/quickstart.md`
- [x] T028 Verify developer management entry points and navigation visibility for authorized roles in `resources/js/components/nav-main.tsx`, `resources/js/components/app-sidebar.tsx`, or related navigation files
- [x] T029 [P] Run and document verification for `composer test`, `npm run lint:check`, `npm run format:check`, and `npm run types:check` against the developer management changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and benefits from US1 page composition, but remains independently testable with seeded data
- **User Story 3 (Phase 5)**: Depends on Foundational completion and builds on the shared page/table surfaces introduced in US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - this is the MVP slice
- **User Story 2 (P2)**: Can start after Foundational, but should integrate with the page shell created for US1
- **User Story 3 (P3)**: Can start after Foundational once the page and table surfaces from US1 and US2 exist

### Within Each User Story

- Write the feature tests for the story first and confirm they fail before implementation
- Complete backend contract changes before wiring the final frontend integration
- Finish the story and validate it independently before moving to the next priority

### Parallel Opportunities

- `T002` and `T003` can run in parallel during setup
- `T005`, `T006`, and `T008` can run in parallel during the foundational phase
- In US1, `T011` and `T012` can run in parallel, and `T014` can proceed once the contract is settled
- In US2, `T016` and `T017` can run in parallel, and `T019` can be developed alongside the backend listing work
- In US3, `T021` and `T022` can run in parallel, and `T024` and `T025` can run in parallel after the update/delete contract is clear

---

## Parallel Example: User Story 1

```text
Task: "Add feature tests for authorized create access, unauthorized denial, and admin inherited access in tests/Feature/Developers/DeveloperManagementTest.php"
Task: "Add feature tests for create validation, specialization enforcement, trimmed input, and duplicate-email protection in tests/Feature/Developers/DeveloperManagementTest.php"
Task: "Implement the add developer form UI with inline validation messaging in resources/js/components/developers/developer-form.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate add-developer behavior independently before expanding scope

### Incremental Delivery

1. Finish Setup and Foundational work
2. Deliver User Story 1 for developer creation
3. Deliver User Story 2 for directory visibility and pagination
4. Deliver User Story 3 for edit and delete maintenance
5. Finish with cross-cutting validation and navigation polish

### Parallel Team Strategy

1. One developer completes the shared foundational backend tasks
2. After foundation:
   - Developer A: User Story 1 backend/frontend create flow
   - Developer B: User Story 2 table and page presentation
   - Developer C: User Story 3 edit/delete interaction work

---

## Notes

- All tasks follow the required checklist format with task ID, optional parallel marker, story label where needed, and exact file paths
- `T011` through `T026` map directly to user stories for independent delivery and testing
- Keep admin inheritance and unauthorized access denial covered in tests across the feature
- Validate responsive behavior, keyboard access, and bounded list queries before closing the feature

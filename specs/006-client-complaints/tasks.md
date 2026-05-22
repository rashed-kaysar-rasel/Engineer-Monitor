# Tasks: Client Complaint Tracking

**Input**: Design documents from `/specs/006-client-complaints/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Includes test tasks verifying CRUD functionality, policy-based access restrictions for both techleads and developers, and verify embedding creation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Laravel + React web app**: `app/`, `resources/js/`, `routes/`, `tests/`, `database/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Define routes for client-complaints resource in routes/web.php
- [x] T002 [P] Create placeholder controller ClientComplaintController in app/Http/Controllers/ClientComplaintController.php

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database tables, model classes, policies, and services required before any user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create migration for client_complaints table in database/migrations/2026_05_22_000001_create_client_complaints_table.php
- [x] T004 Create migration for client_complaint_embeddings table in database/migrations/2026_05_22_000002_create_client_complaint_embeddings_table.php
- [x] T005 Create ClientComplaint model with relationships in app/Models/ClientComplaint.php
- [x] T006 Create ClientComplaintEmbedding model with relationships in app/Models/ClientComplaintEmbedding.php
- [x] T007 [P] Create ClientComplaintPolicy for role-based authorization check in app/Policies/ClientComplaintPolicy.php
- [x] T008 [P] Register ClientComplaintPolicy in app/Providers/AppServiceProvider.php
- [x] T009 Create ClientComplaintService to coordinate database operations and embedding generation in app/Services/ClientComplaintService.php

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Recording Client Complaints (Priority: P1) MVP

**Goal**: Enable Admin and Tech-lead roles to submit new client complaints with synchronous embedding generation and validation

**Independent Test**: Verify that a POST request to `/client-complaints` stores the complaint in the database, generates a vector embedding, and redirects back to the index view

### Tests for User Story 1

- [x] T010 [P] [US1] Create feature tests for recording complaints and checking embedding generation in tests/Feature/ClientComplaintTrackingTest.php
- [x] T011 [P] [US1] Create StoreClientComplaintRequest for input validation in app/Http/Requests/StoreClientComplaintRequest.php

### Implementation for User Story 1

- [x] T012 [US1] Implement store method with authorization check in app/Http/Controllers/ClientComplaintController.php
- [x] T013 [US1] Implement createComplaint and generateAndStoreEmbedding methods in app/Services/ClientComplaintService.php

**Checkpoint**: User Story 1 is fully functional and testable independently (MVP)

---

## Phase 4: User Story 2 - Viewing Client Complaints in a Datatable (Priority: P2)

**Goal**: Display complaints in a paginated datatable on the frontend, accessible to Admin, Tech-lead, and Developer roles, with a menu link in the left sidebar

**Independent Test**: Verify that all roles can view the datatable with pagination, and verify that the sidebar menu displays "Client Complain" correctly

### Tests for User Story 2

- [x] T014 [P] [US2] Update tests/Feature/ClientComplaintTrackingTest.php to cover index view permissions for developers (read-only) and tech-leads/admins (full access)

### Implementation for User Story 2

- [x] T015 [US2] Implement index method with pagination and project eager loading in app/Http/Controllers/ClientComplaintController.php
- [x] T016 [US2] Add "Client Complain" link to left sidebar in resources/js/components/app-sidebar.tsx
- [x] T017 [US2] Create React page with paginated datatable in resources/js/pages/client-complaints/index.tsx

**Checkpoint**: User Stories 1 and 2 are functional and testable together

---

## Phase 5: User Story 3 - Editing and Deleting Complaints (Priority: P3)

**Goal**: Allow Admin and Tech-lead roles to update details, change status to resolved/pending, and delete existing complaints

**Independent Test**: Verify that PUT and DELETE requests successfully update or remove records from the database respectively, and developers are blocked with 403 errors

### Tests for User Story 3

- [x] T018 [P] [US3] Update tests/Feature/ClientComplaintTrackingTest.php to cover updating, deleting, and role-based block tests
- [x] T019 [P] [US3] Create UpdateClientComplaintRequest for edit input validation in app/Http/Requests/UpdateClientComplaintRequest.php

### Implementation for User Story 3

- [x] T020 [US3] Implement update and destroy methods with authorization checks in app/Http/Controllers/ClientComplaintController.php
- [x] T021 [US3] Implement updateComplaint and deleteComplaint methods in app/Services/ClientComplaintService.php
- [x] T022 [US3] Add edit form and delete confirmation handling in resources/js/pages/client-complaints/index.tsx

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify styling across viewport breakpoints, run automated quality gates, and perform cleanup

- [x] T023 Run project tests using `composer test` and verify that all test suites pass
- [x] T024 Run code linting/formatting checks on backend PHP and frontend TypeScript files
- [x] T025 Run quickstart.md validation steps manually to ensure system operates correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phase 2. Can be implemented and verified first as the MVP.
- **User Story 2 (P2)**: Depends on Phase 2 (and reads database fields defined in US1, though it can display empty states independently).
- **User Story 3 (P3)**: Depends on Phase 2 and integrates with elements built in US1 and US2.

### Parallel Opportunities

- T002, T007, T008, T010, T011, T014, T018, and T019 can run in parallel with other setup or design tasks in their respective phases since they involve separate files (e.g. requests, tests, policies).
- Once Phase 2 (Foundational) is complete, frontend development (US2 - T016, T017) and backend development (US1 - T012, T013) can run in parallel.

---

## Parallel Example: User Story 1

```text
Task: "Create feature tests for recording complaints and checking embedding generation in tests/Feature/ClientComplaintTrackingTest.php"
Task: "Create StoreClientComplaintRequest for input validation in app/Http/Requests/StoreClientComplaintRequest.php"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - database structures and base service class)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run feature tests for creating complaints and verify database records & embeddings are successfully stored.

### Incremental Delivery

1. Setup + Foundational structures
2. Add User Story 1 (Recording Complaints - MVP)
3. Add User Story 2 (Datatable & Sidebar - read-only viewing)
4. Add User Story 3 (Edit & Delete - full management lifecycle)
5. Polish, linting, and final validations

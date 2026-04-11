# Tasks: Role-Based Access Login

**Input**: Design documents from `/specs/001-role-based-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/, quickstart.md

**Tests**: Tests are included because this feature changes authentication, authorization, shared
auth payloads, and user-critical UI states.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing
of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Laravel + React web app**: `app/`, `resources/js/`, `routes/`, `tests/`, `database/`
- Tasks below use the existing starter-kit layout captured in `plan.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare seed and type scaffolding used across all stories

- [ ] T001 Create approved role seeder in `database/seeders/RoleSeeder.php`
- [ ] T002 Update seed entrypoints for role setup in `database/seeders/DatabaseSeeder.php`
- [ ] T003 [P] Extend shared auth typing for role-aware pages in `resources/js/types/auth.ts` and `resources/js/types/global.d.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core persistence and access infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create roles table migration in `database/migrations/2026_04_12_000001_create_roles_table.php`
- [ ] T005 Create role assignments table migration in `database/migrations/2026_04_12_000002_create_role_assignments_table.php`
- [ ] T006 [P] Create `Role` and `RoleAssignment` models in `app/Models/Role.php` and `app/Models/RoleAssignment.php`
- [ ] T007 Update user role relationships and active-role helpers in `app/Models/User.php`
- [ ] T008 Implement role access lookup service in `app/Services/Auth/RoleAccessService.php`
- [ ] T009 Register active-role middleware in `app/Http/Middleware/EnsureUserHasActiveRole.php` and `bootstrap/app.php`
- [ ] T010 [P] Add role-aware factory states in `database/factories/UserFactory.php`
- [ ] T011 [P] Share eager-loaded role data with Inertia in `app/Http/Middleware/HandleInertiaRequests.php`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Admin Access Sign-In (Priority: P1) MVP

**Goal**: Allow approved admin users to sign in through the existing login flow and block users without an approved role

**Independent Test**: Create an admin account and an unassigned account, submit both through the existing login form, and verify only the admin reaches the protected dashboard

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Add admin login success and unauthorized denial tests in `tests/Feature/Auth/AuthenticationTest.php`
- [ ] T013 [P] [US1] Add protected dashboard access tests for approved and unassigned users in `tests/Feature/DashboardTest.php`

### Implementation for User Story 1

- [ ] T014 [US1] Enforce approved-role login eligibility in `app/Providers/FortifyServiceProvider.php`
- [ ] T015 [US1] Return clear unauthorized login messaging in `app/Providers/FortifyServiceProvider.php` and `resources/js/pages/auth/login.tsx`
- [ ] T016 [US1] Require active approved roles on protected web routes in `routes/web.php` and `app/Http/Middleware/EnsureUserHasActiveRole.php`
- [ ] T017 [US1] Surface admin role identity in authenticated UI in `resources/js/pages/dashboard.tsx` and `resources/js/components/nav-user.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Tech Lead Access Sign-In (Priority: P2)

**Goal**: Allow approved tech lead users to sign in through the same flow and receive consistent role-aware frontend behavior

**Independent Test**: Create a tech lead account, sign in through the current login form, and verify the authenticated experience identifies the user as a tech lead without changing the login path

### Tests for User Story 2

- [ ] T018 [P] [US2] Add tech lead login and missing-assignment tests in `tests/Feature/Auth/AuthenticationTest.php`
- [ ] T019 [P] [US2] Add shared auth payload assertions for tech lead users in `tests/Feature/DashboardTest.php`

### Implementation for User Story 2

- [ ] T020 [US2] Recognize tech lead assignments in the access service and shared auth payload in `app/Services/Auth/RoleAccessService.php` and `app/Http/Middleware/HandleInertiaRequests.php`
- [ ] T021 [US2] Render tech lead authorization states in `resources/js/pages/auth/login.tsx` and `resources/js/components/user-info.tsx`
- [ ] T022 [US2] Add role-aware dashboard and navigation presentation for tech leads in `resources/js/pages/dashboard.tsx` and `resources/js/components/nav-user.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Role-Controlled Access Management (Priority: P3)

**Goal**: Make stored role assignments the source of truth so access changes take effect on the next sign-in

**Independent Test**: Assign, revoke, and reactivate a user's approved role in persisted data, then verify sign-in behavior changes on the next login attempt

### Tests for User Story 3

- [ ] T023 [P] [US3] Add role assignment activation and revocation login tests in `tests/Feature/Auth/AuthenticationTest.php`
- [ ] T024 [P] [US3] Add role relationship and single-active-assignment tests in `tests/Unit/Models/RoleAssignmentTest.php`

### Implementation for User Story 3

- [ ] T025 [US3] Enforce single active assignment and revocation rules in `app/Models/RoleAssignment.php` and `database/migrations/2026_04_12_000002_create_role_assignments_table.php`
- [ ] T026 [US3] Add role authorization helpers for protected application areas in `app/Models/User.php` and `app/Providers/AppServiceProvider.php`
- [ ] T027 [US3] Persist approved role setup and assignment lifecycle support in `database/seeders/RoleSeeder.php`, `database/factories/UserFactory.php`, and `app/Services/Auth/RoleAccessService.php`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize verification, documentation, and performance/security checks across the feature

- [ ] T028 [P] Document PostgreSQL setup and role verification steps in `specs/001-role-based-auth/quickstart.md`
- [ ] T029 Review eager loading and query paths for auth role access in `app/Models/User.php`, `app/Services/Auth/RoleAccessService.php`, and `app/Http/Middleware/HandleInertiaRequests.php`
- [ ] T030 Run full validation and address regressions in `tests/Feature/Auth/AuthenticationTest.php`, `tests/Feature/DashboardTest.php`, `tests/Unit/Models/RoleAssignmentTest.php`, `resources/js/pages/auth/login.tsx`, and `resources/js/types/auth.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP slice
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the shared auth payload from US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and extends persisted role-control behavior used by US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational and delivers the first usable internal login gate
- **User Story 2 (P2)**: Depends on the same role-access infrastructure as US1 but remains independently testable once implemented
- **User Story 3 (P3)**: Depends on the persisted role model from Foundational and validates assignment lifecycle behavior used by prior stories

### Within Each User Story

- Tests covering story behavior and its main risk areas SHOULD be written and fail before implementation
- Models and shared access helpers before auth-flow wiring
- Backend access logic before frontend role presentation
- Story complete before moving to the next priority

### Parallel Opportunities

- `T003`, `T006`, `T010`, and `T011` can run in parallel after their prerequisites
- `T012` and `T013` can run in parallel in US1
- `T018` and `T019` can run in parallel in US2
- `T023` and `T024` can run in parallel in US3
- `T028` and `T029` can run in parallel during the polish phase

---

## Parallel Example: User Story 1

```text
Task: "T012 [US1] Add admin login success and unauthorized denial tests in tests/Feature/Auth/AuthenticationTest.php"
Task: "T013 [US1] Add protected dashboard access tests for approved and unassigned users in tests/Feature/DashboardTest.php"
```

## Parallel Example: User Story 2

```text
Task: "T018 [US2] Add tech lead login and missing-assignment tests in tests/Feature/Auth/AuthenticationTest.php"
Task: "T019 [US2] Add shared auth payload assertions for tech lead users in tests/Feature/DashboardTest.php"
```

## Parallel Example: User Story 3

```text
Task: "T023 [US3] Add role assignment activation and revocation login tests in tests/Feature/Auth/AuthenticationTest.php"
Task: "T024 [US3] Add role relationship and single-active-assignment tests in tests/Unit/Models/RoleAssignmentTest.php"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate admin sign-in and unauthorized denial behavior
5. Demo the internal login gate before expanding to other roles

### Incremental Delivery

1. Finish Setup + Foundational to establish role persistence and shared auth payloads
2. Deliver User Story 1 for admin login control
3. Deliver User Story 2 for tech lead parity and role-aware UI
4. Deliver User Story 3 for assignment lifecycle enforcement
5. Finish with polish, validation, and quickstart updates

### Suggested MVP Scope

- Phase 1: Setup
- Phase 2: Foundational
- Phase 3: User Story 1

---

## Notes

- All tasks use the required checklist format with checkbox, ID, labels where required, and exact file paths
- Total tasks: 30
- User Story task counts: US1 = 6, US2 = 5, US3 = 5
- Setup + Foundational task count: 11
- Polish task count: 3

---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/

**Tests**: Include tests whenever a story changes behavior, security, authorization, data
loading, or user-critical UI states.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Laravel + React web app**: `app/`, `resources/js/`, `routes/`, `tests/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting, formatting, and type-checking tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication and authorization framework
- [ ] T006 [P] Setup routing, middleware, and request validation structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management
- [ ] T010 [P] Establish query-loading strategy for core relationships to prevent N+1 access
- [ ] T011 [P] Define responsive layout primitives and breakpoint expectations for shared UI

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T012 [P] [US1] Contract or feature test for [endpoint/flow] in the appropriate test suite
- [ ] T013 [P] [US1] Authorization, validation, or query-behavior test for the story's risk area

### Implementation for User Story 1

- [ ] T014 [P] [US1] Create or update domain models/resources needed by the story
- [ ] T015 [US1] Implement the backend flow with explicit authorization, validation, and bounded
  data loading
- [ ] T016 [US1] Implement the frontend UI with responsive layouts and complete loading, empty,
  and error states
- [ ] T017 [US1] Add logging, telemetry, or audit coverage required for the story

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2

- [ ] T018 [P] [US2] Contract or feature test for [endpoint/flow] in the appropriate test suite
- [ ] T019 [P] [US2] Authorization, validation, query-behavior, or responsive-state test

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create or update domain models/resources needed by the story
- [ ] T021 [US2] Implement the backend flow with explicit authorization, validation, and bounded
  data loading
- [ ] T022 [US2] Implement the frontend UI with responsive layouts and complete loading, empty,
  and error states
- [ ] T023 [US2] Integrate with previously delivered stories without breaking independent
  testability

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3

- [ ] T024 [P] [US3] Contract or feature test for [endpoint/flow] in the appropriate test suite
- [ ] T025 [P] [US3] Authorization, validation, query-behavior, or responsive-state test

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create or update domain models/resources needed by the story
- [ ] T027 [US3] Implement the backend flow with explicit authorization, validation, and bounded
  data loading
- [ ] T028 [US3] Implement the frontend UI with responsive layouts and complete loading, empty,
  and error states

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Query inspection and regression verification for high-traffic paths
- [ ] TXXX Responsive and accessibility regression verification
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- User stories can then proceed in parallel (if staffed)
- Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other
  stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but
  should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but
  should be independently testable

### Within Each User Story

- Tests covering story behavior and its main risk areas SHOULD be written and fail before
  implementation
- Models/resources before service or action layers
- Backend contracts before frontend integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity
  allows)
- All tests for a user story marked [P] can run in parallel
- Models/resources within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```text
Task: "Contract or feature test for [endpoint/flow] in the appropriate test suite"
Task: "Authorization, validation, or query-behavior test for the story's risk area"
Task: "Create or update domain models/resources needed by the story"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo (MVP)
3. Add User Story 2 -> Test independently -> Deploy/Demo
4. Add User Story 3 -> Test independently -> Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   Developer A: User Story 1
   Developer B: User Story 2
   Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Verify security posture, query behavior, and responsive behavior before closing a story
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

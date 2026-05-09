# Implementation Tasks: project-creation

**Feature**: project-creation
**Branch**: 003-project-creation

## Dependencies & Execution Order

- **Phase 1**: Setup (Not required for this feature)
- **Phase 2**: Foundational (Must complete first)
- **Phase 3**: User Story 1 - Create a New Project
- **Phase 4**: User Story 2 - Manage Projects
- **Phase 5**: Polish & Cross-Cutting Concerns

## Implementation Strategy

We will deliver the MVP by implementing User Story 1 (Create a New Project) which encompasses the full stack slice from database to React UI. Next, we will add the datatable, edit, and delete functionality in Phase 4.

## Phase 1: Setup

*(No specific setup tasks required for this feature)*

## Phase 2: Foundational

**Goal**: Prepare the database schema and foundational backend classes.

- [X] T001 Create migration for `projects` table in `database/migrations/YYYY_MM_DD_HHMMSS_create_projects_table.php`
- [X] T002 [P] Create `Project` model with relationships in `app/Models/Project.php`
- [X] T003 Create `ProjectPolicy` to define authorization for `admin` and `techlead` in `app/Policies/ProjectPolicy.php`

## Phase 3: User Story 1 - Create a New Project

**Goal**: As a techlead, I want to create a new project by specifying a title and assigning a project lead, so that my team can begin tracking work.
**Independent Test Criteria**: Navigate to `/projects`, submit the project form with valid data, and confirm the new project is persisted and displayed.

- [X] T004 [US1] Create `StoreProjectRequest` with validation rules in `app/Http/Requests/StoreProjectRequest.php`
- [X] T005 [P] [US1] Create `ProjectService` for business logic in `app/Services/ProjectService.php`
- [X] T006 [US1] Implement `ProjectController` with `index` and `store` methods in `app/Http/Controllers/ProjectController.php`
- [X] T007 [US1] Register web routes for `/projects` in `routes/web.php`
- [X] T008 [P] [US1] Create `CreateProjectForm.tsx` React component in `resources/js/Pages/Projects/Partials/CreateProjectForm.tsx`
- [X] T009 [US1] Create `Index.tsx` React page component with a basic list in `resources/js/Pages/Projects/Index.tsx`

## Phase 4: User Story 2 - Manage Projects

**Goal**: As a techlead, I want to view all projects in a datatable and be able to edit or delete them.
**Independent Test Criteria**: Verify datatable displays projects, successfully edit an existing project, and successfully delete a project.

- [X] T010 [US2] Create `UpdateProjectRequest` with validation rules in `app/Http/Requests/UpdateProjectRequest.php`
- [X] T011 [US2] Update `ProjectPolicy` to authorize `update` and `delete` actions in `app/Policies/ProjectPolicy.php`
- [X] T012 [US2] Add `update` and `destroy` methods to `ProjectController` in `app/Http/Controllers/ProjectController.php`
- [X] T013 [US2] Register PUT/PATCH and DELETE routes for `/projects/{project}` in `routes/web.php`
- [X] T014 [P] [US2] Create `EditProjectModal.tsx` React component for editing in `resources/js/Pages/Projects/Partials/EditProjectModal.tsx`
- [X] T015 [US2] Update `Index.tsx` to include a rich datatable, edit actions, and delete confirmations in `resources/js/Pages/Projects/Index.tsx`

## Phase 5: Polish & Cross-Cutting Concerns

**Goal**: Ensure quality gates are met, tests pass, and code is formatted.

- [X] T016 Implement `ProjectCreationTest.php` to verify security and creation in `tests/Feature/ProjectCreationTest.php`
- [X] T017 Implement `ProjectManagementTest.php` to verify edit and delete functionality in `tests/Feature/ProjectManagementTest.php`
- [X] T018 Run PHPUnit tests, TypeScript type checks, and ESLint.

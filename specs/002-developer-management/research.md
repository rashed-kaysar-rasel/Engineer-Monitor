# Research: Developer Management

## Decision 1: Model developers as a dedicated roster entity instead of reusing authenticated users

- **Decision**: Introduce a dedicated `Developer` model and table for roster management.
- **Rationale**: The feature only captures name, email, and delivery specialization, and does not provision login credentials, verification state, or role assignments. Reusing `User` would incorrectly imply application access, force unrelated auth fields, and blur the distinction between internal operators and managed roster entries.
- **Alternatives considered**:
  - Reuse `User`: rejected because the existing `User` model represents authenticated accounts with password and role-assignment concerns that are out of scope for this feature.
  - Store developers as freeform JSON or settings data: rejected because CRUD, validation, uniqueness, and pagination are clearer and safer with a first-class relational entity.

## Decision 2: Expose developer management through authenticated web routes and one Inertia page

- **Decision**: Implement the feature as Laravel web routes returning an Inertia page and redirect-based CRUD responses rather than a separate API surface.
- **Rationale**: The existing application already uses Laravel controllers, Inertia page rendering, Wayfinder-generated form actions, shared auth props, and toast-style flash feedback. Staying inside that contract keeps validation, authorization, and rendered state aligned with current project patterns.
- **Alternatives considered**:
  - Build a standalone JSON API first: rejected because it adds an unnecessary contract layer for a single internal page and duplicates current Inertia flow.
  - Build modal-only CRUD from the dashboard: rejected because the feature has enough table, validation, and empty-state behavior to justify a dedicated page route.

## Decision 3: Authorize both tech leads and admins, with explicit inherited admin access

- **Decision**: Allow `tech-lead` and `admin` to access all developer roster actions, while all other roles or unapproved users are denied.
- **Rationale**: The constitution requires least privilege and explicit inherited admin access. The current codebase already distinguishes `admin` and `tech-lead`, and this feature does not introduce any admin-only action inside its scope.
- **Alternatives considered**:
  - Limit access to tech leads only: rejected because it violates the project's baseline rule that admin inherits every tech-lead capability.
  - Make create/update/delete admin-only: rejected because it conflicts with the user-facing purpose of the feature.

## Decision 4: Use paginated roster queries with explicit ordering and duplicate-email validation

- **Decision**: Serve the table from a paginated query ordered by newest or latest-updated records and enforce unique normalized email addresses on create and update.
- **Rationale**: The spec requires a data table that remains usable as the list grows and forbids duplicate emails. Pagination bounds reads and keeps the UI stable, while normalized uniqueness protects data integrity.
- **Alternatives considered**:
  - Load the full roster in one request: rejected because it creates unbounded reads as the directory grows.
  - Rely only on client-side duplicate checks: rejected because integrity must be enforced server-side.

## Decision 5: Keep the create/edit experience inline on the management page

- **Decision**: Render the add form and the editable roster table on the same page, with row-level edit and delete actions and a confirmation step before deletion.
- **Rationale**: The feature scope is narrow, and a single page minimizes navigation overhead for tech leads while still supporting responsive stacking on smaller screens.
- **Alternatives considered**:
  - Separate create and edit pages: rejected because it adds navigation complexity without improving clarity for this CRUD workflow.
  - Modal-only editing for every action: rejected because long validation feedback and mobile usability are usually easier to manage in-page for a simple internal tool.

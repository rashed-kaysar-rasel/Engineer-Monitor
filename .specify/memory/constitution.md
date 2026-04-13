<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- I. Secure-by-Default Backend -> I. Secure-by-Default Backend and Least-Privilege Access
- III. Contract-Driven Full-Stack Delivery -> III. Contract-Driven Full-Stack Delivery and Role Visibility
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- updated .specify/templates/plan-template.md
- updated .specify/templates/spec-template.md
- updated .specify/templates/tasks-template.md
- pending .specify/templates/commands/*.md (directory not present in this repository)
Follow-up TODOs:
- None
-->

# Engineer Monitor Constitution

## Core Principles

### I. Secure-by-Default Backend and Least-Privilege Access
Every backend change MUST preserve Laravel security defaults unless a reviewed exception is
documented in the implementation plan. Authentication, authorization, validation, CSRF
protection, mass-assignment protection, secret handling, and audit-relevant logging MUST be
addressed explicitly for every feature that touches protected data or privileged actions.
Controllers MUST delegate business rules to focused services, policies, actions, or query
layers rather than embedding unchecked logic inline. Access control MUST follow least privilege:
`admin` inherits every `techlead` capability, while `techlead` MUST NOT receive admin-only
capabilities unless the constitution itself is amended. Every privileged action MUST declare
which role can perform it and which enforcement point implements that rule. Rationale: web
application security is a baseline quality attribute, not a polish step.

### II. Query-Efficient Data Access
Backend data access MUST be designed to prevent N+1 queries and avoid unbounded reads. Laravel
features such as eager loading, constrained eager loading, aggregates, pagination, chunking,
caching, and database indexing MUST be used deliberately when access patterns warrant them. Any
feature that loads related records, dashboards, or lists MUST document expected query shape and
validate that query count and latency remain acceptable for the stated scope. Rationale:
predictable query behavior prevents avoidable latency, cost, and production instability.

### III. Contract-Driven Full-Stack Delivery and Role Visibility
Every feature MUST define the user-facing scenario, the backend contract, and the frontend data
consumption path before implementation begins. Laravel routes, requests, resources, policies,
and React/Inertia pages or components MUST evolve together so that validation, authorization,
and rendered state stay consistent. New ambiguity in payload shape, field meaning, or error
handling MUST be resolved in the spec or plan rather than deferred to implementation. Where a
feature differs by role, the spec and plan MUST include a role-access matrix that distinguishes
shared `admin`/`techlead` capabilities from `admin`-only capabilities, and the UI MUST avoid
presenting unavailable actions to `techlead` users. Rationale: React and Laravel changes fail
together when contracts are implicit, and role confusion creates security defects.

### IV. Responsive and Accessible Frontend
Frontend work MUST function across supported mobile and desktop breakpoints without horizontal
overflow, unusable hit targets, or content loss. Components and pages MUST preserve semantic
HTML, keyboard access, visible focus states, and sufficient contrast when customizing UI.
Loading, empty, error, and long-content states MUST be designed for responsive layouts rather
than assumed away. Rationale: a web application is incomplete if it only works on an ideal
viewport or input mode.

### V. Quality Gates and Operational Readiness
Changes MUST pass the project quality gates before merge: relevant automated tests, linting,
formatting, type checks, and a constitution review in the plan. Features affecting performance,
security, or data integrity MUST include targeted validation for the affected risk, such as
query inspection, authorization tests, or responsive verification. Complexity MAY be introduced
only when the plan records the simpler alternative and why it was rejected. Rationale: best
practice is enforced by repeatable gates, not intent alone.

## Engineering Standards

- The canonical stack is Laravel 13 on PHP 8.3 with Inertia, React 19, TypeScript, Tailwind, and
  the established UI/component tooling already present in the repository.
- Backend implementations MUST prefer framework conventions first: Form Requests for validation,
  Policies/Gates for authorization, Eloquent scopes or dedicated query objects for complex data
  retrieval, API resources or typed props for response shaping, and queued work for long-running
  operations.
- The baseline authorization model for this repository is two roles: `admin` and `techlead`.
  `admin` MUST be authorized for every capability granted to `techlead`, and any `admin`-only
  capability MUST be named explicitly in the relevant specification, plan, policy, and tests.
- Queries that back tables, dashboards, exports, or nested relationships MUST avoid `select *`
  when narrower selects are viable and MUST paginate, chunk, or stream where result size can
  grow materially.
- Sensitive configuration MUST remain in environment or secret storage and MUST NOT be hardcoded
  in controllers, components, tests, or seeded fixtures that are intended for production-like
  execution.
- Frontend features MUST preserve responsive behavior at small, medium, and large breakpoints,
  and MUST account for validation errors, slow network states, and empty datasets.
- New dependencies, architectural layers, or abstractions MUST be justified in the plan when
  they increase operational or maintenance cost.

## Delivery Workflow

- Specifications MUST describe user stories, edge cases, security considerations, data-loading
  expectations, and measurable outcomes for performance or responsiveness when relevant.
- Specifications for privileged workflows MUST include a role-access matrix covering `admin`,
  `techlead`, shared capabilities, and admin-only capabilities.
- Implementation plans MUST include a Constitution Check covering backend security posture,
  anti-N+1 strategy, contract changes, role hierarchy enforcement, responsive behavior, and
  verification steps.
- Tasks MUST include work for backend safeguards, query-performance validation, frontend
  responsiveness, role/policy enforcement, and the automated/manual checks needed to prove the
  story is complete.
- Code review MUST reject changes that introduce hidden authorization paths, unresolved N+1
  risks, undocumented payload changes, role leaks between `admin` and `techlead`, inaccessible
  interactions, or unverified responsive regressions.
- Release-ready work MUST leave the repository in a state where `composer test`, project linting,
  formatting checks, and relevant frontend type checks can be executed successfully.

## Governance

This constitution supersedes informal local practice for engineering decisions in this
repository. Amendments require a documented update to this file, explicit synchronization of any
affected templates under `.specify/templates/`, and a semantic version change justified by the
scope of the governance change. Compliance is reviewed during specification, planning, task
generation, implementation, and code review. Any exception MUST be time-bounded, documented in
the relevant plan or pull request, and approved by the responsible maintainers before merge.

Versioning policy:
- MAJOR: Removes a principle, materially weakens a gate, or redefines governance in a
  backward-incompatible way.
- MINOR: Adds a principle, adds a mandatory workflow section, or materially expands required
  delivery guidance.
- PATCH: Clarifies wording, fixes ambiguity, or tightens examples without changing governance
  intent.

Compliance review expectations:
- Every plan MUST record whether each core principle is satisfied or what justified exception is
  being requested.
- Every implementation and review MUST verify security, query behavior, contract consistency, and
  responsive behavior for the touched scope.
- Every privileged feature MUST verify that `techlead` cannot access admin-only capabilities and
  that `admin` retains access to all `techlead` capabilities.
- Unresolved constitution violations MUST block merge until corrected or formally excepted.

**Version**: 1.1.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-14

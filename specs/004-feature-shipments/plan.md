# Implementation Plan: Feature Shipments

**Branch**: `004-feature-shipments` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-feature-shipments/spec.md`

## Summary

Implement a "Feature Shipments" module for Tech Leads to record shipped features (with properties like size, points, developer, approver, and project). The system will asynchronously generate vector embeddings of the feature descriptions and store them using PostgreSQL `pgvector` for future Retrieval-Augmented Generation (RAG) capabilities.

## Technical Context

**Language/Version**: PHP 8.3, TypeScript 5.7  
**Primary Dependencies**: Laravel 13, React 19, Inertia, Tailwind CSS 4, OpenAI API (for embeddings), `pgvector-php`  
**Storage**: PostgreSQL (with pgvector) for production, SQLite for local/testing (mocking vectors).  
**Testing**: PHPUnit feature tests, TypeScript type checks.  
**Target Platform**: Web application.  
**Project Type**: Laravel + React web application.  
**Performance Goals**: <500ms paginated list loads; embedding generation must not block the main request thread.  
**Constraints**: Secure by default, no N+1 queries, responsive across breakpoints.  
**Scale/Scope**: Internal tool, low concurrent volume, but vector database queries should be optimized.  
**Authorization Model**: Admin inherits all tech-lead capabilities; both `admin` and `tech-lead` can view and create feature shipments.

## Constitution Check

*GATE: Passed*

- `Secure-by-Default Backend`: Only users with `admin` or `tech-lead` roles can access the routes. Handled via `FeatureShipmentPolicy`. Form Requests will be used to validate inputs.
- `Query-Efficient Data Access`: Eager loading will be used for `developer`, `approver`, and `project` relationships on the index view to prevent N+1 queries.
- `Contract-Driven Full-Stack Delivery`: The `FeatureShipmentController` will return Inertia responses with strongly typed props. The role-access matrix is simple (Admin/Tech-Lead have same access to this feature).
- `Responsive and Accessible Frontend`: React forms will use existing UI components to ensure accessibility and responsiveness. Errors from the API will be handled gracefully.
- `Quality Gates and Operational Readiness`: Comprehensive feature tests will verify the permissions, data persistence, and that the Job for embedding generation is correctly dispatched.

## Project Structure

### Documentation (this feature)

```text
specs/004-feature-shipments/
|-- plan.md              # This file
|-- research.md          # Phase 0 output
|-- data-model.md        # Phase 1 output
|-- quickstart.md        # Phase 1 output
|-- contracts/           # Phase 1 output
`-- tasks.md             # Phase 2 output (future)
```

### Source Code (repository root)

```text
app/
|-- Http/
|   |-- Controllers/FeatureShipmentController.php
|   `-- Requests/StoreFeatureShipmentRequest.php
|-- Jobs/
|   `-- GenerateFeatureEmbeddingJob.php
|-- Models/
|   |-- FeatureShipment.php
|   `-- FeatureEmbedding.php
|-- Policies/
|   `-- FeatureShipmentPolicy.php
`-- Services/
    `-- EmbeddingService.php

resources/
`-- js/
    `-- Pages/
        `-- FeatureShipments/
            |-- Index.tsx
            `-- Partials/
                `-- CreateFeatureShipmentModal.tsx

routes/
`-- web.php

tests/
`-- Feature/
    `-- FeatureShipmentTest.php
```

**Structure Decision**: Standard Laravel MVC + Services + Jobs. Components are placed in standard Inertia directories.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Asynchronous Queued Job | Embedding API is slow | Synchronous API calls would block the web request and degrade UX. |

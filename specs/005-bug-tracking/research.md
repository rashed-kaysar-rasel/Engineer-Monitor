# Research: Bug Tracking

## Decision: Embedding Generation

- **Decision**: Use a synchronous service call (`BugService`) for embedding generation upon bug creation or description update.
- **Rationale**: Ensures that a bug record always has its associated embedding before it's displayed or queried. This follows the synchronous pattern established in the refactored Feature Shipments module.
- **Alternatives considered**: 
    - Laravel Queues: Rejected to maintain simplicity and avoid infrastructure dependencies (Redis/database queue) in the initial version.
    - Scheduled Tasks: Rejected because it introduces a delay between bug creation and AI readiness.

## Decision: Data Storage & Vector Mocking

- **Decision**: Use PostgreSQL with `pgvector` for production. For local development and testing, use SQLite with a JSON-based "mock vector" column if `pgvector` isn't available, or simple float array storage.
- **Rationale**: Consistent with previous features (004-feature-shipments). SQLite doesn't natively support `vector` type, so mocking is necessary for CI/CD and local dev.
- **Alternatives considered**: 
    - Specialized Vector DB (Pinecone/Milvus): Rejected as it adds operational overhead for a relatively small dataset.

## Decision: Resolver Association

- **Decision**: The `developer_id` on a bug is strictly the resolver and is mandatory only when status is `Resolved`.
- **Rationale**: Per user clarification, the field is for the "developer who resolved the bug" and is only filled at resolution time.
- **Alternatives considered**: 
    - Assignment-based tracking: Rejected per user feedback (Option B chosen).

## Decision: Dashboard Scope

- **Decision**: The dashboard is excluded from the current implementation.
- **Rationale**: Per user clarification (Option B chosen), the dashboard is deferred to a future update.
- **Alternatives considered**: 
    - Simple count-based cards: Rejected to strictly follow user's scope decision.

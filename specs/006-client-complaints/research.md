# Research: Client Complaint Tracking

## Decision: Access Control Policy

- **Decision**: Allow `developer` users read-only access to view client complaints. Allow `admin` and `tech-lead` roles full CRUD permissions.
- **Rationale**: Keeps developers informed of client complaints to improve issue response and awareness, while restricting management capabilities (create, update, delete) to administrative and lead roles.
- **Alternatives considered**:
    - Complete exclusion of developers (Option A): Rejected to promote transparency within the team.
    - Full CRUD for developers (Option C): Rejected to prevent unauthorized deletion or modification of client-reported status.

## Decision: Project Association Constraint

- **Decision**: Make client complaints strictly project-bound. The `project_id` field in the `client_complaints` database schema will be non-nullable and enforce a foreign key constraint.
- **Rationale**: Ensures all client complaints are contextualized within a specific project. This simplifies filtering, ownership, and tracking, avoiding orphan or uncategorized complaints.
- **Alternatives considered**:
    - Optional project-bound complaints (Option B): Rejected as it creates ambiguity on who should handle the complaint or which project context it relates to.

## Decision: Vector Embeddings Generation

- **Decision**: Synchronously generate and store 3072-dimensional vector embeddings for client complaint descriptions in a `client_complaint_embeddings` table.
- **Rationale**: Follows the established pattern in Bug Tracking and Feature Shipments, utilizing `EmbeddingService` and `\Laravel\Ai\Embeddings`. Generating embeddings synchronously ensures that the vector data is immediately available for future similarity search, categorization, and AI-based reporting.
- **Alternatives considered**:
    - No Embeddings (Option A): Rejected because storing embeddings provides parity with other modules and sets up the system for future cross-module AI querying.
    - Asynchronous Queueing: Rejected to avoid setting up queue worker dependencies for local testing.

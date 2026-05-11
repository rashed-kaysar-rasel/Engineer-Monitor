# Feature Specification: Feature Shipments

**Feature Branch**: `004-feature-shipments`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "implement another module for the tech-lead called "Feature Shipments" to recort who shipped how much record. with data embeding so that in future we can use RAG to generate dynamicAI based data. Data Source: Features will be logged by the Tech Lead based. Attributes to Store: Feature ID, Feature Name, Shipped Date, Leadership (Who Approved), Assigned Developer, Project Name, T-shirt Size, Point... Future Use: The feature description and details about the shipped feature will be converted into vector embeddings for storing in the feature_embeddings table..."

## Clarifications

### Session 2026-05-10
- Q: Project & Leadership Relationships → A: Use foreign keys (`project_id` and `approver_id`) linking to the existing `projects` and `users` tables.
- Q: Feature ID Format → A: Integer format (strictly numerical tracking).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log a Feature Shipment (Priority: P1)

As a Tech Lead, I want to log a shipped feature with its details (name, size, points, developer, project, and approver) so that I can track team delivery performance.

**Why this priority**: Logging the shipments is the core data entry point without which no insights can be generated.

**Independent Test**: Can be fully tested by creating a new shipment record via the UI and verifying all fields are correctly saved to the database.

**Acceptance Scenarios**:

1. **Given** I am logged in as a Tech Lead, **When** I submit the "Log Shipment" form with valid details including size and developer, **Then** a new shipment record is saved and I see a success message.
2. **Given** I am logging a shipment, **When** I select a T-shirt size (e.g., "M"), **Then** the corresponding points (2) are automatically assigned or validated.

---

### User Story 2 - Generate AI Embeddings for Shipments (Priority: P2)

As a System Administrator or Background Process, I want to automatically generate and store vector embeddings for feature descriptions when a feature is logged, so that the AI model can later use this data for Retrieval-Augmented Generation (RAG).

**Why this priority**: Vector embeddings are necessary for future AI-based performance insights.

**Independent Test**: Can be fully tested by verifying that saving a new feature shipment triggers an embedding generation process that stores a vector in the `feature_embeddings` table.

**Acceptance Scenarios**:

1. **Given** a feature shipment is successfully saved, **When** the system processes the record, **Then** a vector embedding of its description is generated and saved to the database.
2. **Given** the embedding service is temporarily unavailable, **When** a feature is logged, **Then** the embedding generation is queued and retried later.

---

### Edge Cases

- What happens when a Tech Lead tries to log a feature for a developer or project that does not exist?
- How does the system handle failures from the external embedding API when generating vectors?
- Which actions are available to both `admin` and `techlead`, and which actions are restricted to `admin` only? (Assuming both can log and view shipments).
- What happens if the feature description is extremely long, exceeding the token limit for embedding models?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow Tech Leads and Admins to create "Feature Shipment" records.
- **FR-002**: System MUST capture the following attributes for each shipment: Feature ID, Feature Name, Shipped Date, Leadership (`approver_id` linking to User), Assigned Developer (`developer_id` linking to User), Project (`project_id` linking to Project), T-shirt Size ("S","M","L","XL","XXL","XXXL"), and Points.
- **FR-003**: System MUST automatically map T-shirt sizes to points (S:1, M:2, L:3, XL:5, XXL:7, XXXL:8).
- **FR-004**: System MUST store a detailed feature description for each shipment.
- **FR-005**: System MUST asynchronously or synchronously convert the feature details and description into vector embeddings upon creation or update.
- **FR-006**: System MUST store the vector embeddings in a `feature_embeddings` table alongside the feature reference and raw description.
- **FR-006a**: System MUST restrict the creation and viewing of feature shipments to `admin` and `tech-lead` roles.
- **FR-007**: System MUST provide a paginated list view of all logged feature shipments.

### Key Entities *(include if feature involves data)*

- **Feature Shipment**: Represents a completed unit of work. Key attributes: Feature ID (Integer), Name, Description, Shipped Date, Approver ID (User relation), Developer ID (User relation), Project ID (Project relation), T-shirt Size, Points.
- **Feature Embedding**: Represents the AI vector data. Key attributes: ID, Feature ID (reference), Feature Description (text), Embedding (vector data), Created At.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tech leads can log a feature shipment in under 1 minute.
- **SC-002**: 100% of successfully logged shipments have a corresponding vector embedding generated and stored.
- **SC-003**: Paginated list view of shipments loads in under 500ms.
- **SC-004**: Database vector extension correctly queries vector dimensions without performance degradation on standard CRUD operations.

## Assumptions

- System uses PostgreSQL with the `pgvector` extension for storing `VECTOR` data types in production. For local testing with SQLite, vector similarity operations will be mocked or skipped.
- The AI embedding model API details (e.g., OpenAI credentials) will be configured in the environment variables.
- "Feature ID" is strictly numerical (Integer), meaning it can map to external issue trackers only if they use numerical IDs (e.g., GitHub issue numbers) or acts as an internal numerical identifier.
- The system uses `admin` and `tech-lead`, where admin inherits every techlead capability.

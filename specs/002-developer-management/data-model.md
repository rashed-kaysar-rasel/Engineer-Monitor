# Data Model: Developer Management

## Entity: Developer

- **Purpose**: Represents a managed developer roster record that tech leads and admins can maintain without creating an authenticated application account.
- **Fields**:
  - `id`: Unique identifier
  - `name`: Developer display name
  - `email`: Unique contact email address for the roster
  - `specialization`: Delivery focus with allowed values `frontend`, `backend`, `fullstack`
  - `created_at`: Record creation timestamp
  - `updated_at`: Record last update timestamp
- **Validation Rules**:
  - `name` is required, trimmed, and stored as non-empty text within a reasonable application-defined length limit
  - `email` is required, trimmed, lowercased for uniqueness comparison, and must be a valid email format
  - `email` must be unique across all developer records
  - `specialization` is required and limited to `frontend`, `backend`, or `fullstack`
- **Indexes/Constraints**:
  - Primary key on `id`
  - Unique index on normalized `email`
  - Optional index on `specialization` only if future filtering requires it
- **State Transitions**:
  - `created`: record is added and visible in the directory
  - `updated`: editable fields change and the table reflects the latest saved state
  - `deleted`: record is permanently removed after explicit confirmation

## Entity: Developer Directory Page

- **Purpose**: Aggregates paginated developer records and page-level UI state for the Inertia response.
- **Fields**:
  - `developers`: Paginated collection of developer records for the current page
  - `filters`: Current pagination or future list controls, if any
  - `can`: Capability flags for create, update, and delete actions based on the authenticated role
  - `flash`: Success or error feedback from the previous action
- **Relationships**:
  - Contains many `Developer` records
  - Is scoped by the authenticated operator's permissions

## Entity: Operator Capability

- **Purpose**: Describes whether the authenticated internal user can perform roster actions.
- **Fields**:
  - `role_slug`: Current active role for the authenticated user
  - `can_view_developers`: Boolean
  - `can_create_developers`: Boolean
  - `can_update_developers`: Boolean
  - `can_delete_developers`: Boolean
- **Rules**:
  - `tech-lead` and `admin` resolve to `true` for all four capabilities in this feature
  - Any other role or missing approved role resolves to `false`

# Data Model: Role-Based Access Login

## Entity: User

**Purpose**: Represents a person with login credentials who may be allowed into the application.

**Key Fields**:
- `id`: Primary identifier
- `name`: Display name
- `email`: Unique login identifier
- `password`: Credential hash
- `email_verified_at`: Verification timestamp when enabled
- `remember_token`: Session persistence token
- `created_at`, `updated_at`: Audit timestamps

**Relationships**:
- Has one active role assignment for this feature scope
- Belongs to one approved role through the active role assignment

**Validation Rules / Invariants**:
- Email remains unique
- A user may authenticate only if credentials are valid and an active approved role assignment
  exists
- A user must not hold more than one active approved role assignment at the same time in this
  feature version

## Entity: Role

**Purpose**: Represents an approved access category recognized by the application.

**Key Fields**:
- `id`: Primary identifier
- `slug`: Stable machine-readable value such as `admin` or `tech-lead`
- `name`: Human-readable role label
- `description`: Optional business explanation
- `is_active`: Whether the role can be assigned for access
- `created_at`, `updated_at`: Audit timestamps

**Relationships**:
- Has many role assignments
- Has many users through active role assignments

**Validation Rules / Invariants**:
- `slug` must be unique
- Only active roles may be assigned for application access
- Initial approved roles are `admin` and `tech lead`

## Entity: Role Assignment

**Purpose**: Stores the link that grants a user an approved role for application access.

**Key Fields**:
- `id`: Primary identifier
- `user_id`: Reference to the user
- `role_id`: Reference to the role
- `is_active`: Whether the assignment currently grants access
- `assigned_at`: Timestamp of assignment
- `revoked_at`: Optional timestamp when access was removed
- `created_at`, `updated_at`: Audit timestamps

**Relationships**:
- Belongs to one user
- Belongs to one role

**Validation Rules / Invariants**:
- Each active assignment must reference an existing user and an existing active role
- Only one active assignment may exist per user in this feature scope
- Revoked assignments must no longer grant login eligibility

## State Transitions

### User Access State

- `Unassigned` -> `Assigned`: occurs when an admin assigns an approved role to an existing user
- `Assigned` -> `Authenticated`: occurs when the user signs in successfully and the assignment is
  active
- `Assigned` -> `Blocked`: occurs when the assignment becomes inactive or the role is deactivated
- `Blocked` -> `Assigned`: occurs when a valid active assignment is restored

### Role Assignment State

- `Pending/Inactive` -> `Active`: assignment created or re-enabled
- `Active` -> `Revoked`: assignment disabled or removed from access control

## Query and Loading Notes

- Authentication-time lookup should load the user's active role assignment and role in a bounded
  query path.
- Shared auth/session payloads should eager load the active role relationship to avoid repeated
  role queries on protected pages.
- Admin role-management views added later must paginate user lists and eager load related roles.

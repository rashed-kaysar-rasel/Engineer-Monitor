# Data Model: Bug Tracking

## Entities

### Bug

Represents a specific issue or bug recorded for a project.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `project_id` | BigInt | FK (projects.id), NOT NULL | The project where the bug occurred |
| `impact` | Enum | 'High', 'Medium', 'Low', NOT NULL | Severity of the bug |
| `status` | Enum | 'Pending', 'Resolved', NOT NULL, DEFAULT 'Pending' | Current state of the bug |
| `description` | Text | NOT NULL | Detailed description of the bug |
| `developer_id` | BigInt | FK (users.id), NULLABLE | The developer who resolved the bug |
| `reported_at` | Date | NOT NULL | Date the bug was reported |
| `resolved_at` | Date | NULLABLE | Date the bug was resolved |
| `created_at` | Timestamp | | Record creation time |
| `updated_at` | Timestamp | | Record update time |

#### Relationships:
- **Project**: `Bug` belongs to `Project`.
- **Developer**: `Bug` belongs to `User` (as resolver).

### BugEmbedding

Stores the vector representation of a bug's description for future similarity analysis.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `bug_id` | BigInt | FK (bugs.id), NOT NULL, UNIQUE | Reference to the bug |
| `embedding` | Vector(3072) | NOT NULL | OpenAI/Gemini embedding vector |
| `created_at` | Timestamp | | Record creation time |

#### Relationships:
- **Bug**: `BugEmbedding` belongs to `Bug`.

## Validation Rules

- `project_id`: Required, must exist in `projects` table.
- `impact`: Required, must be one of: High, Medium, Low.
- `description`: Required, minimum 10 characters.
- `reported_at`: Required, must be a valid date, not in the future.
- `resolved_at`: Required if `status` is 'Resolved', must be >= `reported_at`.
- `developer_id`: Required if `status` is 'Resolved', must exist in `users` table.

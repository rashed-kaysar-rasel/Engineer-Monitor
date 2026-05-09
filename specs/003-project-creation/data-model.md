# Data Model: project-creation

## Entities

### `Project`
Represents a collaborative endeavor or body of work.

**Table**: `projects`

| Field | Type | Modifiers | Description |
|-------|------|-----------|-------------|
| `id` | BigInt | Primary Key, Auto-Increment | Unique identifier |
| `title` | String | Not Null, Max 255 | Name of the project |
| `description` | Text | Nullable | Optional brief description of the project |
| `status` | String | Not Null, Default 'active' | Current status of the project |
| `project_lead_id` | BigInt | Not Null, Foreign Key (`users.id`) | The user assigned to lead the project |
| `creator_id` | BigInt | Not Null, Foreign Key (`users.id`) | The user who created the project |
| `created_at` | Timestamp | | Laravel timestamps |
| `updated_at` | Timestamp | | Laravel timestamps |

## Relationships

- `Project` **belongsTo** `User` (as `lead`, using `project_lead_id`)
- `Project` **belongsTo** `User` (as `creator`, using `creator_id`)
- `User` **hasMany** `Project` (as `leadProjects`, using `project_lead_id`)
- `User` **hasMany** `Project` (as `createdProjects`, using `creator_id`)

## Validation Rules

- `title`: required, string, max:255
- `description`: nullable, string, max:1000
- `status`: required, string, in:active,archived,completed
- `project_lead_id`: required, exists:users,id

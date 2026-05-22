# Data Model: Client Complaint Tracking

## Entities

### ClientComplaint

Represents a complaint submitted by a client regarding a specific project.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `project_id` | BigInt | FK (projects.id), NOT NULL | The project the complaint is associated with |
| `client_name` | String(255) | NOT NULL | Name of the client reporting the complaint |
| `description` | Text | NOT NULL | Detailed description of the complaint |
| `impact_level` | Enum | 'High', 'Medium', 'Low', NOT NULL | Severity or impact level of the complaint |
| `status` | Enum | 'Pending', 'Resolved', NOT NULL, DEFAULT 'Pending' | Current status of the complaint |
| `reported_date` | Date | NOT NULL | Date the complaint was reported |
| `created_at` | Timestamp | | Record creation time |
| `updated_at` | Timestamp | | Record update time |

#### Relationships:
- **Project**: `ClientComplaint` belongs to `Project`.
- **Embedding**: `ClientComplaint` has one `ClientComplaintEmbedding`.

### ClientComplaintEmbedding

Stores the vector representation of a client complaint's description for future similarity analysis.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | BigInt | PK, Auto-increment | Unique identifier |
| `client_complaint_id` | BigInt | FK (client_complaints.id), NOT NULL, UNIQUE | Reference to the client complaint |
| `embedding` | Vector(3072) | NOT NULL | OpenAI/Gemini embedding vector |
| `created_at` | Timestamp | | Record creation time |

#### Relationships:
- **ClientComplaint**: `ClientComplaintEmbedding` belongs to `ClientComplaint`.

## Validation Rules

- `project_id`: Required, must exist in `projects` table.
- `client_name`: Required, string, max 255 characters.
- `description`: Required, text.
- `impact_level`: Required, must be one of: High, Medium, Low.
- `status`: Required, must be one of: Pending, Resolved.
- `reported_date`: Required, must be a valid date, and cannot be in the future.

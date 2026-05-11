# Data Model: Feature Shipments

## Entities

### 1. `feature_shipments`
Represents the core shipment record.
- `id` (Primary Key)
- `feature_id` (Integer) - External issue tracker ID or internal reference
- `name` (String)
- `description` (Text)
- `shipped_date` (Date)
- `t_shirt_size` (String/Enum: S, M, L, XL, XXL, XXXL)
- `points` (Integer) - Derived from t_shirt_size
- `approver_id` (Foreign Key -> `users.id`)
- `developer_id` (Foreign Key -> `users.id`)
- `project_id` (Foreign Key -> `projects.id`)
- `timestamps`

### 2. `feature_embeddings`
Stores the vector data generated from the shipment description.
- `id` (Primary Key)
- `feature_shipment_id` (Foreign Key -> `feature_shipments.id`)
- `feature_description` (Text)
- `embedding` (Vector data, configured via pgvector)
- `timestamps`

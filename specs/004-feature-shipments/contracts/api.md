# Interface Contracts: Feature Shipments

## Internal API (Inertia Routes)

### GET `/feature-shipments`
- **Description**: Returns the paginated list of shipments.
- **Props Expected by React**:
  - `shipments`: Paginated resource of `FeatureShipment` (with loaded relationships: `developer`, `approver`, `project`).
  - `users`: Array of `{id, name}` for the developer/approver dropdowns.
  - `projects`: Array of `{id, title}` for the project dropdown.

### POST `/feature-shipments`
- **Description**: Stores a new feature shipment.
- **Payload**:
  - `feature_id` (Integer, Required)
  - `name` (String, Required)
  - `description` (String, Required)
  - `shipped_date` (Date String, Required)
  - `t_shirt_size` (String, Required, In: S,M,L,XL,XXL,XXXL)
  - `approver_id` (Integer, Required, Exists in users)
  - `developer_id` (Integer, Required, Exists in users)
  - `project_id` (Integer, Required, Exists in projects)
- **Response**: Redirects back to `/feature-shipments` with success flash message.

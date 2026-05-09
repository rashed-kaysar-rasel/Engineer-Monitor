# Interface Contracts: project-creation

## Web Routes (Inertia)

### `GET /projects`
Displays the Projects page, which includes the list of projects and the creation form.

**Response Payload (Inertia Props)**:
```json
{
  "projects": {
    "data": [
      {
        "id": 1,
        "title": "Website Redesign",
        "description": "Revamping the corporate website",
        "status": "active",
        "lead": {
          "id": 2,
          "name": "Jane Doe"
        },
        "created_at": "2026-04-29T10:00:00Z"
      }
    ],
    "links": [],
    "meta": {}
  },
  "available_leads": [
    {
      "id": 2,
      "name": "Jane Doe"
    },
    {
      "id": 3,
      "name": "John Smith"
    }
  ]
}
```

### `POST /projects`
Creates a new project.

**Request Payload**:
```json
{
  "title": "New Platform Feature",
  "description": "Adding the ability to...",
  "status": "active",
  "project_lead_id": 2
}
```

**Response**:
- **Success**: Redirects back to `/projects` with a success flash message.
- **Error (Validation)**: Redirects back with errors in `page.props.errors` for `title`, `description`, `status`, or `project_lead_id`.
- **Error (Authorization)**: 403 Forbidden if the user is not a `techlead` or `admin`.

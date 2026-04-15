# Contract: Developer Management

## Purpose

Define the Laravel web route and Inertia page contract for the developer management feature.

## Authorization

| Route | Allowed Roles |
| --- | --- |
| `GET /developers` | `tech-lead`, `admin` |
| `POST /developers` | `tech-lead`, `admin` |
| `PATCH /developers/{developer}` | `tech-lead`, `admin` |
| `DELETE /developers/{developer}` | `tech-lead`, `admin` |

All routes also require authenticated, verified users with an active approved role.

## Page Contract

### `GET /developers`

- **Route name**: `developers.index`
- **Response type**: Inertia page `developers/index`
- **Props**:

| Prop | Type | Notes |
| --- | --- | --- |
| `developers.data` | `Developer[]` | Current page rows for the table |
| `developers.meta` | pagination metadata | Includes current page, last page, per-page, total |
| `can.create` | boolean | Whether the current user can add developers |
| `can.update` | boolean | Whether the current user can edit developers |
| `can.delete` | boolean | Whether the current user can delete developers |
| `flash` | object nullable | Existing shared flash/toast pattern |

### `Developer`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | number | Stable record identifier |
| `name` | string | Displayed in table and edit form |
| `email` | string | Unique roster email |
| `specialization` | `'frontend' | 'backend' | 'fullstack'` | Developer role type |
| `created_at` | ISO 8601 string | For stable sorting/display if needed |
| `updated_at` | ISO 8601 string | For last-modified state if needed |

## Mutation Contracts

### `POST /developers`

- **Route name**: `developers.store`
- **Request body**:

| Field | Required | Rules |
| --- | --- | --- |
| `name` | yes | Non-empty trimmed string |
| `email` | yes | Valid email, unique among developers |
| `specialization` | yes | One of `frontend`, `backend`, `fullstack` |

- **Success behavior**: Redirect back to `developers.index` with success flash message and the new record visible in the table.
- **Failure behavior**: Redirect back with validation errors and preserve user input.

### `PATCH /developers/{developer}`

- **Route name**: `developers.update`
- **Request body**:

| Field | Required | Rules |
| --- | --- | --- |
| `name` | yes | Non-empty trimmed string |
| `email` | yes | Valid email, unique excluding current developer |
| `specialization` | yes | One of `frontend`, `backend`, `fullstack` |

- **Success behavior**: Redirect back to `developers.index` with success flash message and the updated row visible in the table.
- **Failure behavior**: Redirect back with validation errors and preserve edit state where practical.

### `DELETE /developers/{developer}`

- **Route name**: `developers.destroy`
- **Request body**: none beyond CSRF and route parameter
- **Success behavior**: Redirect back to `developers.index` with success flash message and the deleted row removed from the table.
- **Failure behavior**: Return forbidden or not-found response when authorization or record state no longer permits deletion.

## Frontend Expectations

- The page presents an add form and developer table in one responsive layout.
- Edit actions reuse the same field contract as create.
- Delete requires explicit user confirmation before submission.
- Validation errors render inline next to relevant fields.
- Empty state messaging appears when `developers.data` is empty.

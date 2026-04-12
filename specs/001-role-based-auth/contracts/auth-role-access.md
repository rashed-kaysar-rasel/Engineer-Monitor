# Contract: Auth and Role Access

## Purpose

Define the backend and frontend contract for login eligibility and shared role identity in the
role-based access feature.

## Existing Entry Points Affected

- `GET /login`
- `POST /login`
- Protected web routes under existing authenticated middleware

## Login Request Contract

**Route**: `POST /login`  
**Intent**: Authenticate a user through the existing Fortify entry point and allow access only if
the user has an active approved role assignment.

### Request Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Existing login identifier |
| `password` | string | Yes | Existing credential |
| `remember` | boolean | No | Existing session persistence flag |

### Success Outcome

| Condition | Result |
|-----------|--------|
| Valid credentials + active approved role assignment | Authenticated session created; user redirected to intended protected destination |

### Failure Outcomes

| Condition | Result |
|-----------|--------|
| Invalid credentials | Authentication fails with existing credential error behavior |
| Valid credentials but no active approved role assignment | Authentication denied with a clear authorization message |
| Valid credentials but inactive or revoked assignment | Authentication denied with a clear authorization message |

## Shared Auth Payload Contract

The shared authenticated user payload available to Inertia pages must include the user's active
role identity.

### Required Auth Payload Shape

```ts
type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: {
    slug: 'admin' | 'tech-lead';
    name: string;
  } | null;
};
```

### Contract Rules

- Protected pages must receive the active role through the shared auth payload
- Unauthorized users must never receive protected-page payloads
- Role data must reflect the active assignment used for access decisions

## Route Protection Contract

| Route Scope | Access Rule |
|-------------|-------------|
| General protected application routes | Require authenticated user with active approved role |
| Role-specific screens introduced later | Require authenticated user whose active role matches the screen's allowed roles |

## UI Contract

| Surface | Requirement |
|---------|-------------|
| Login page | Must preserve current login fields and support clear unauthorized-access messaging |
| Error presentation | Must remain readable and actionable on mobile and desktop layouts |
| Protected navigation | May branch on shared role identity without extra fetches |

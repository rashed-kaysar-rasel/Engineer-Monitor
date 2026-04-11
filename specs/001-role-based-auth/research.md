# Research: Role-Based Access Login

## Decision: Keep Laravel Fortify as the authentication entry point

**Rationale**: The starter kit already uses Fortify for the login route, rate limiting, and
Inertia login view rendering. Extending the existing authentication path preserves current
credentials, avoids duplicate auth logic, and minimizes regression risk in a security-sensitive
flow.

**Alternatives considered**:
- Replace Fortify login with a custom controller stack: rejected because it duplicates mature
  framework behavior and increases security review surface.
- Add a separate admin-only login form: rejected because the feature requires the existing login
  functionality to be updated rather than split.

## Decision: Use normalized PostgreSQL role storage with a dedicated `roles` table and a user role
link

**Rationale**: Persistent, normalized role storage gives the application explicit control over
which roles are approved, supports clean relational integrity in PostgreSQL, and keeps role-based
queries efficient. For this feature's "one approved role per user" assumption, a dedicated user
role link with a uniqueness rule on active assignments keeps the model simple without hardcoding
roles onto the users table.

**Alternatives considered**:
- Add a `role` string column directly to `users`: rejected because it weakens referential
  integrity and makes future metadata or deactivation behavior harder to manage cleanly.
- Full many-to-many permissions framework now: rejected because the current scope only requires
  two roles and one approved role per user.

## Decision: Enforce access at two layers: authentication-time eligibility and post-login route
protection

**Rationale**: Blocking unapproved users immediately after credential validation prevents them
from entering an authenticated session, while route-level enforcement protects against stale or
manually altered session state. This aligns with the constitution's secure-by-default backend
principle.

**Alternatives considered**:
- Enforce only on protected routes after login: rejected because users could still acquire a
  session before denial, which is less clear and less secure.
- Enforce only during login: rejected because role changes or session anomalies could bypass
  downstream protection.

## Decision: Share the user's active role through the existing Inertia auth payload

**Rationale**: The frontend already consumes a shared auth object. Adding role data there keeps
React pages and navigation role-aware without extra round trips and supports consistent rendering
of role-based messaging.

**Alternatives considered**:
- Fetch role data separately after login: rejected because it adds complexity and can create UI
  flicker or race conditions.
- Infer access entirely from route success or failure: rejected because the frontend still needs
  role identity for navigation and messaging.

## Decision: Keep the login UI unchanged in shape, but add denial-state messaging that remains
responsive

**Rationale**: The existing login screen is already wired into Fortify and Inertia. Preserving its
structure lowers regression risk while still meeting the requirement to explain unauthorized access
clearly. Responsive error presentation is enough for this feature scope.

**Alternatives considered**:
- Redesign the auth UI during this feature: rejected because it adds unrelated risk and no direct
  business value.
- Hide authorization denial behind a generic login error: rejected because the specification
  requires a clear message for unauthorized accounts.

## Decision: Test the feature mainly through Laravel feature tests plus frontend static checks

**Rationale**: The critical behavior is authentication outcome, role persistence, route access, and
shared payload integrity. Laravel feature tests exercise those behaviors end to end, while ESLint,
Prettier, and TypeScript checks cover the React typing and UI changes.

**Alternatives considered**:
- Unit-test only the role service layer: rejected because auth and middleware behavior are more
  important than isolated method coverage.
- Introduce browser automation at this stage: rejected because it is not required to validate the
  core feature behavior in this iteration.

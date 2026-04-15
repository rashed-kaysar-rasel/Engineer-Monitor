# Quickstart: Developer Management

## Goal

Implement and verify the developer management page for tech leads with inherited admin access.

## Steps

1. Create the `developers` persistence model:
   - add a migration for `name`, unique `email`, and `specialization`
   - add the `Developer` Eloquent model and factory

2. Add protected backend flow:
   - register `developers.index`, `developers.store`, `developers.update`, and `developers.destroy` routes under authenticated internal middleware
   - enforce `tech-lead` or `admin` access through a policy or gate
   - add Form Requests for create and update validation
   - return Inertia responses and flash feedback from the controller

3. Build the Inertia page:
   - create `resources/js/pages/developers/index.tsx`
   - render the add form, roster table, edit flow, delete confirmation, and empty state
   - keep the layout responsive and keyboard-accessible

4. Add verification coverage:
   - authorized access for `tech-lead`
   - inherited access for `admin`
   - denial for unauthorized users
   - create, update, delete, validation, and duplicate-email behavior

5. Run project checks:
   - `composer test`
   - `npm run lint:check`
   - `npm run format:check`
   - `npm run types:check`

## Manual Verification

1. Sign in as a `tech-lead` user and open `/developers`.
2. Add a developer with each specialization type and confirm the table updates after every submission.
3. Edit an existing developer and confirm the latest values render immediately in the table.
4. Attempt to save a duplicate email and confirm validation blocks the change.
5. Delete a developer through the confirmation flow and confirm the row disappears.
6. Sign in as an `admin` and confirm the same page and actions remain available.
7. Sign in as a guest or unassigned user and confirm access is denied or redirected.
8. Create more than 10 developers and confirm pagination keeps the directory bounded.
9. Verify the page remains usable on a narrow viewport and that all actions are reachable by keyboard.

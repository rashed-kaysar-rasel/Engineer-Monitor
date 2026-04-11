# Quickstart: Role-Based Access Login

## Goal

Validate the role-backed login flow for `admin` and `tech lead` users in the Laravel + React
starter kit using PostgreSQL.

## Prerequisites

- PostgreSQL is configured as the application database
- Application dependencies are installed
- Environment variables are configured

## Setup

1. Run database migrations and seed the approved roles.
2. Create or update one user with the `admin` role.
3. Create or update one user with the `tech lead` role.
4. Create or update one user with no approved role assignment.

## Verification Steps

1. Open the existing login page.
2. Sign in as the admin user.
3. Confirm access is granted and the authenticated experience reflects the admin role.
4. Sign out and sign in as the tech lead user.
5. Confirm access is granted and the authenticated experience reflects the tech lead role.
6. Sign out and sign in as the user without an approved role.
7. Confirm access is denied with a clear authorization message.
8. Deactivate or revoke an approved role assignment.
9. Attempt sign-in again for that user and confirm access is denied.

## Automated Checks

1. Run `composer test` to execute backend and feature tests.
2. Run `npm run lint:check`.
3. Run `npm run format:check`.
4. Run `npm run types:check`.

## Expected Result

- Only users with an active `admin` or `tech lead` role assignment can enter the application.
- Role identity is available to protected pages after login.
- Unauthorized accounts are blocked without breaking the existing login form layout.

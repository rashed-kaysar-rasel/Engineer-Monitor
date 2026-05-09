# Quickstart: project-creation

To set up and test the project creation feature locally:

1. **Run Migrations**: 
   Apply the new `projects` table migration.
   ```bash
   php artisan migrate
   ```

2. **Run Tests**:
   Execute the feature tests for project creation to ensure security and functionality.
   ```bash
   php artisan test --filter ProjectCreationTest
   ```

3. **Verify Locally**:
   - Serve the application: `php artisan serve` and `npm run dev`
   - Log in as an `admin` or `techlead` user.
   - Navigate to `/projects`.
   - Verify the creation form exists and functions correctly.
   - Log out and log in as a regular user, verify access to `/projects` is denied (403).

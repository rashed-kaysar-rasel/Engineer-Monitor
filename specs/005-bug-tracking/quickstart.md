# Quickstart: Bug Tracking

This guide provides the necessary steps to set up and verify the Bug Tracking module.

## Setup Instructions

1. **Environment Configuration**:
   Ensure your `.env` file has the following AI embedding configurations:
   ```env
   EMBEDDING_PROVIDER=gemini # or openai
   GEMINI_API_KEY=your_key_here
   ```

2. **Database Migrations**:
   Run the migrations to create the `bugs` and `bug_embeddings` tables:
   ```bash
   php artisan migrate
   ```

3. **Development Assets**:
   Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```

## Verification Steps

### 1. Recording a Bug
- Log in as a `techlead` or `admin`.
- Navigate to `/bugs/create`.
- Fill in the form:
    - Select a project.
    - Set impact to "High".
    - Enter a description.
    - Set a reported date.
- Submit and verify the bug appears in the list.
- Check the `bug_embeddings` table to ensure an embedding was generated.

### 2. Resolving a Bug
- Click "Edit" on a pending bug.
- Change status to "Resolved".
- Select a developer from the dropdown.
- Set a resolved date.
- Save and verify the status is updated.

### 3. Permissions
- Verify that a `developer` role cannot access the `/bugs` management pages.

## Troubleshooting

- **Embedding Failures**: Check the logs (`storage/logs/laravel.log`) for AI provider errors. Ensure SSL verification is handled if working locally.
- **Missing Vectors**: If using SQLite, ensure the "mock vector" logic in `BugService` is active.

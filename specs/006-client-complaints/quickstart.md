# Quickstart: Client Complaint Tracking

This guide provides the necessary steps to set up and verify the Client Complaint Tracking module.

## Setup Instructions

1. **Environment Configuration**:
   Ensure your `.env` file has the following AI embedding configurations:
   ```env
   EMBEDDING_PROVIDER=gemini # or openai
   GEMINI_API_KEY=your_key_here
   ```

2. **Database Migrations**:
   Run the migrations to create the `client_complaints` and `client_complaint_embeddings` tables:
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

### 1. Recording a Complaint
- Log in as a `tech-lead` or `admin`.
- Navigate to the Client Complaints page (menu item in the left sidebar).
- Click "Record Complaint" (or open creation form).
- Fill in the form:
    - Enter client name.
    - Select a project.
    - Set impact to "High".
    - Enter a description.
    - Set a reported date.
    - Set status to "Pending".
- Submit and verify the complaint appears in the datatable.
- Check the `client_complaint_embeddings` table to ensure an embedding was generated.

### 2. Editing/Deleting a Complaint
- Click "Edit" on a pending complaint.
- Change status to "Resolved".
- Save and verify the status is updated.
- Verify that clicking "Delete" on a complaint removes it from the list.

### 3. Permissions
- Log in as a `developer`.
- Verify that you can view the "Client Complain" sidebar item and see the datatable.
- Verify that the action buttons to Create, Edit, or Delete are hidden or disabled.
- Attempt to post data to the create/update/delete endpoints and verify they return a `403 Forbidden` response.

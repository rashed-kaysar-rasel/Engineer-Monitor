# Quickstart: Feature Shipments

## Setup Requirements

1. **Environment Variables**:
   Ensure you have the following API key in your `.env` file to generate embeddings:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

2. **Database Extensions**:
   If you are running PostgreSQL locally or in production, ensure the `pgvector` extension is enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
   *Note: If you are using SQLite for local development, vector generation will be skipped/mocked gracefully.*

3. **Queue Worker**:
   To process embeddings asynchronously, ensure your queue worker is running:
   ```bash
   php artisan queue:work
   ```

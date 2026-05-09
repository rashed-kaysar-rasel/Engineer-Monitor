# Phase 0: Research & Decisions

## 1. Vector Database Implementation
- **Decision**: Use `pgvector/pgvector-php` for Laravel Eloquent integration with PostgreSQL.
- **Rationale**: It integrates cleanly with Eloquent, allowing us to define vector casts on the model. For SQLite testing, we can use an array cast fallback or mock the database queries so that CI passes.
- **Alternatives considered**: External DBs like Pinecone, but they add operational overhead for a feature that can just live next to the relational data.

## 2. Embedding Generation Strategy
- **Decision**: Use Laravel Queued Jobs (`GenerateFeatureEmbeddingJob`) to call the OpenAI API.
- **Rationale**: Embedding generation can take 1-3 seconds depending on the payload. Doing this asynchronously ensures the UI responds instantly after saving the record.
- **Alternatives considered**: Synchronous generation (rejected due to poor UX and potential timeout).

## 3. T-Shirt Size to Points Mapping
- **Decision**: Map T-shirt sizes via an Enum or configuration array in the Model or Service.
- **Rationale**: The mapping is static (S:1, M:2, L:3, XL:5, XXL:7, XXXL:8). Calculating this on the backend ensures data consistency.

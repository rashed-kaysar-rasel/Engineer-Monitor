# Technical Research: Metric Improvement Reports

## 1. Database-Level vs. In-Memory Aggregations

* **Decision**: Aggregate metrics directly in the database (`COUNT`, `SUM`, `GROUP BY`) rather than loading raw Eloquent collections into PHP memory.
* **Rationale**: Aggregating in-memory scales poorly and causes memory exhaust errors when datasets exceed several thousand records. Database-level aggregation runs in milliseconds, utilizing indexes, and keeps query response latency minimal (<100ms).
* **Alternatives Considered**: Eager-loading all bugs, shipments, and complaints and aggregating them using Laravel Collections. This was rejected because it violates the constitution's `Query-Efficient Data Access` principle and introduces significant N+1 risks.

## 2. Calculation of Comparison Deltas

* **Decision**: Calculate deltas and improvement percentages on the backend in the `ReportService` class.
* **Rationale**: Keep the frontend React components presentation-focused. Calculating complex statistics and deltas (including handling division-by-zero boundary cases) on the backend is easier to verify using PHPUnit tests.
* **Calculation Logic**:
  * For Bugs/Complaints: `Delta = ((Period B - Period A) / Period A) * 100`. A negative delta represents an improvement.
  * For Shipments/Velocity: `Delta = ((Period B - Period A) / Period A) * 100`. A positive delta represents an improvement.
  * If `Period A` is `0`: Delta is output as `+100%` (or `-100%` depending on improvement type) or `N/A` if both are `0`.

## 3. Date Fields for Aggregation

* **Decision**: Use the following database fields for period filters:
  * **Bugs**: Filtered by `reported_at` (date reported).
  * **Feature Shipments**: Filtered by `shipped_date` (date feature was shipped).
  * **Client Complaints**: Filtered by `reported_date` (date complaint was reported).
* **Rationale**: These dates represent the true business events of when bugs were discovered, when features were delivered to clients, and when complaints were logged.
* **Database Indexes**: Ensure indexes exist on `bugs.reported_at`, `feature_shipments.shipped_date`, and `client_complaints.reported_date`.

## 4. Authorization & Security

* **Decision**: Implement a custom Gate or Policy (`ReportPolicy`) and protect the routes via Inertia/Laravel middleware.
* **Rationale**: The constitution requires secure-by-default access. Developer roles will be blocked at the routing layer, preventing unnecessary execution of database reporting queries.

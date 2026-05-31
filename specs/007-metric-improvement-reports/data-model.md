# Data Model: Metric Improvement Reports

## Virtual/Aggregation Entities

Because reporting metrics are aggregated on the fly and not persisted as standalone tables, they are represented as virtual schema entities mapping directly to the frontend Inertia page props.

### 1. MetricPeriodReport (Virtual)

Represents the summary metrics for a single date range.

* **Attributes**:
  * `start_date`: Date (ISO-8601 string)
  * `end_date`: Date (ISO-8601 string)
  * `bugs_summary`: Object
    * `total_bugs`: Integer
    * `by_impact`: Array of `{ impact: string, count: integer }`
    * `by_status`: Array of `{ status: string, count: integer }`
    * `by_project`: Array of `{ project_title: string, count: integer }`
  * `features_summary`: Object
    * `total_features`: Integer
    * `by_approver`: Array of `{ approver_name: string, count: integer }`
    * `by_developer`: Array of `{ developer_name: string, count: integer }`
  * `complaints_summary`: Object
    * `total_complaints`: Integer
    * `by_impact`: Array of `{ impact_level: string, count: integer }`
  * `developer_velocity`: Array of Objects
    * `developer_id`: Integer
    * `developer_name`: String
    * `total_points`: Integer

### 2. ComparisonResult (Virtual)

Represents the computed comparisons and deltas between two `MetricPeriodReport` instances (Period A and Period B).

* **Attributes**:
  * `period_a`: MetricPeriodReport
  * `period_b`: MetricPeriodReport
  * `bugs_comparison`: Object
    * `period_a_count`: Integer
    * `period_b_count`: Integer
    * `percentage_change`: Float (positive for increase, negative for decrease)
    * `improved`: Boolean (true if bugs decreased)
  * `features_comparison`: Object
    * `period_a_count`: Integer
    * `period_b_count`: Integer
    * `percentage_change`: Float
    * `improved`: Boolean (true if features increased)
  * `team_velocity_comparison`: Object
    * `period_a_total`: Integer
    * `period_b_total`: Integer
    * `percentage_change`: Float
    * `improved`: Boolean (true if team velocity increased)
  * `developers_velocity_comparison`: Array of Objects
    * `developer_name`: String
    * `period_a_points`: Integer
    * `period_b_points`: Integer
    * `percentage_change`: Float
    * `improved`: Boolean (true if points increased)

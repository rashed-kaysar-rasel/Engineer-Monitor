# Feature Specification: Metric Improvement Reports

**Feature Branch**: `007-metric-improvement-reports`  
**Created**: 2026-05-22  
**Status**: Draft  
**Input**: User description: "Now The tech-lead will be able to generate reports comparing key metrics (bugs, features, client complaints, team velocity) over specific time periods (weekly, monthly, custom date ranges). Bug Counts: Number of bugs by project, severity, and status. Features Shipped: Number of features shipped by leadership and by a developer. Client Complaints: Number of client complaints by severity. Developer Velocity: total points(t-shirt size) features completed by a developer. Improvement Reports: Functionality: Display how the team has improved over selected time periods. For example, compare bug counts between two months, showing whether the number of bugs has decreased over time. Key Metrics: Decrease in bugs, Increase in features shipped, Improved team (all developer) velocity, Improved a single developer velocity."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Metrics Overview and Period Selection (Priority: P1)

As a Tech-lead or Admin, I want to select a specific time period (weekly, monthly, or a custom date range) and view aggregated key metrics for bugs, feature shipments, client complaints, and developer velocity.

**Why this priority**: It is the foundational MVP required to retrieve and display report data. Without period-based metric aggregation, no comparison or improvement reports can exist.

**Independent Test**: Tech-lead selects a start date and end date on the Reports page, submits the filter, and views the correct counts for bugs, feature shipments, client complaints, and velocity points matching that specific date range.

**Acceptance Scenarios**:

1. **Given** that the user is logged in as a `tech-lead` or `admin`, **When** they navigate to the `/reports` URL, **Then** they see a filter section with preset options (Weekly, Monthly) and custom date range inputs (Start Date, End Date).
2. **Given** an active date range filter, **When** the page loads, **Then** the system displays:
   - A summary of bugs categorized by project, severity (impact), and status (pending vs. resolved).
   - A list of feature shipments categorized by creator/approver (leadership) and by assigned developer.
   - Client complaints grouped by severity (high, medium, low).
   - Developer velocity points (aggregated by developer based on the `points` field of completed shipments).

---

### User Story 2 - Metric Improvement Comparison (Priority: P2)

As a Tech-lead or Admin, I want to compare the key metrics of two distinct time periods (e.g., this month vs. last month) so that I can see team performance trends at a glance.

**Why this priority**: It delivers the primary business value of analyzing improvement trends (detecting if bugs decreased or feature counts increased).

**Independent Test**: The user selects "Period A" (e.g., May 1–31) and "Period B" (e.g., April 1–30) and views a side-by-side comparison with indicator badges (green for improvement, red for regression).

**Acceptance Scenarios**:

1. **Given** a comparison request, **When** the user selects Period A and Period B, **Then** the system displays:
   - Total bugs in Period A vs. Period B (showing a green badge for a percentage decrease, and red for an increase).
   - Features shipped in Period A vs. Period B (showing a green badge for an increase, and red for a decrease).
   - Team velocity (sum of all developer shipment points) in Period A vs. Period B.
   - Individual developer velocity comparison for a selected developer in Period A vs. Period B.

---

### Edge Cases

- **Zero or Null Values**: When a selected period has zero bugs, features, complaints, or velocity, the comparison percentage calculation must handle division-by-zero gracefully (e.g., displaying `N/A` or `+100%` / `-100%`).
- **Unequal Period Lengths**: When comparing a weekly period with a monthly period, the UI should display a warning suggesting the user compare periods of equal length for accurate comparison.
- **Unassigned Shipments or Bugs**: If a shipment does not have an assigned developer or points value, it must be reported in an "Unassigned" or "Unknown size" category rather than crashing the page.
- **Unauthorized Roles**: If a user with the `developer` role attempts to access the `/reports` endpoint, they must receive a 403 Forbidden error. The "Reports" link must not be visible in the left sidebar for developers.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a reports dashboard accessible via the `/reports` route.
- **FR-002**: Access to `/reports` and all report generation API endpoints MUST be restricted to `admin` and `tech-lead` roles.
- **FR-003**: The system MUST support metric aggregation for:
  - **Bug Counts**: Grouped by project, impact (`low`, `medium`, `high`), and status.
  - **Features Shipped**: Grouped by approver/leadership and by developer.
  - **Client Complaints**: Grouped by impact level (`low`, `medium`, `high`).
  - **Developer Velocity**: Sum of `points` of completed feature shipments for each developer.
- **FR-004**: The system MUST allow comparing two distinct date ranges (Period A vs. Period B) and calculate the difference:
  - **Bugs**: Improvement = (Period B count - Period A count) / Period A count is negative (decrease in bugs).
  - **Features Shipped**: Improvement = increase in total shipments.
  - **Team Velocity**: Improvement = increase in sum of all points.
  - **Single Developer Velocity**: Improvement = increase in points for a selected developer.
- **FR-005**: All reporting queries MUST be eager-loaded and optimized to avoid N+1 queries.
- **FR-006**: The interface MUST adapt to both desktop and mobile viewports, using a grid/flex layout and clean shadcn/tailwind cards.

### Key Entities

- **MetricReport (virtual)**:
  - Represents the compiled metrics for a single date range.
  - Attributes: `start_date`, `end_date`, `bug_metrics`, `feature_metrics`, `complaint_metrics`, `velocity_metrics`.
- **ComparisonResult (virtual)**:
  - Represents the calculated delta between two MetricReports.
  - Attributes: `period_a_metrics`, `period_b_metrics`, `bug_delta`, `feature_delta`, `team_velocity_delta`, `developer_velocity_delta`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Reports must load and render in under 1.5 seconds for date ranges containing up to 10,000 aggregated records.
- **SC-002**: The UI must display comparison deltas as percentages with clear visual indicators (up/down arrows or colored badges) for each metric.
- **SC-003**: 100% of unauthorized developer access attempts must be rejected with a 403 Forbidden response.

## Assumptions

- **Existing Data Structure**: The existing `points` column in `feature_shipments` represents developer effort and will be used as the base for velocity.
- **Role Model**: The system relies on the existing role-based authorization where `admin` and `tech-lead` share CRUD/reporting management permissions, while `developer` has read-only/no access.
- **Velocity definition**: A feature shipment is considered completed and contributes to velocity if it is successfully recorded with a `shipped_date` within the selected range.

# API Contracts: Metric Improvement Reports

## Endpoint: GET /reports

Accessible to roles: `admin`, `tech-lead`.

### Request Parameters

* **Type**: Query String
* **Parameters**:
  * `mode`: `single` or `compare` (default: `single`)
  * `period`: `weekly`, `monthly`, or `custom` (default: `monthly`)
  * `start_date`: Date (YYYY-MM-DD, optional unless period is `custom`)
  * `end_date`: Date (YYYY-MM-DD, optional unless period is `custom`)
  * `compare_start_date`: Date (YYYY-MM-DD, optional, required if mode is `compare` and period is `custom`)
  * `compare_end_date`: Date (YYYY-MM-DD, optional, required if mode is `compare` and period is `custom`)

### Response (Inertia Props Payload)

```json
{
  "mode": "compare",
  "period": "monthly",
  "dates": {
    "period_a": {
      "start": "2026-04-01",
      "end": "2026-04-30"
    },
    "period_b": {
      "start": "2026-05-01",
      "end": "2026-05-31"
    }
  },
  "metrics": {
    "bugs": {
      "period_a": 15,
      "period_b": 10,
      "percentage_change": -33.33,
      "improved": true,
      "breakdown": {
        "period_a": {
          "by_project": [
            { "project_title": "Payment Portal", "count": 10 },
            { "project_title": "Mobile App", "count": 5 }
          ],
          "by_severity": { "high": 5, "medium": 7, "low": 3 },
          "by_status": { "pending": 8, "resolved": 7 }
        },
        "period_b": {
          "by_project": [
            { "project_title": "Payment Portal", "count": 4 },
            { "project_title": "Mobile App", "count": 6 }
          ],
          "by_severity": { "high": 2, "medium": 5, "low": 3 },
          "by_status": { "pending": 3, "resolved": 7 }
        }
      }
    },
    "features": {
      "period_a": 5,
      "period_b": 8,
      "percentage_change": 60.00,
      "improved": true,
      "breakdown": {
        "period_a": {
          "by_approver": [
            { "approver_name": "Admin User", "count": 5 }
          ],
          "by_developer": [
            { "developer_name": "Alice Smith", "count": 3 },
            { "developer_name": "Bob Johnson", "count": 2 }
          ]
        },
        "period_b": {
          "by_approver": [
            { "approver_name": "Admin User", "count": 4 },
            { "approver_name": "Tech Lead User", "count": 4 }
          ],
          "by_developer": [
            { "developer_name": "Alice Smith", "count": 5 },
            { "developer_name": "Bob Johnson", "count": 3 }
          ]
        }
      }
    },
    "complaints": {
      "period_a": 6,
      "period_b": 3,
      "percentage_change": -50.00,
      "improved": true,
      "breakdown": {
        "period_a": { "high": 2, "medium": 3, "low": 1 },
        "period_b": { "high": 0, "medium": 2, "low": 1 }
      }
    },
    "velocity": {
      "team": {
        "period_a": 12,
        "period_b": 18,
        "percentage_change": 50.00,
        "improved": true
      },
      "developers": [
        {
          "developer_name": "Alice Smith",
          "period_a_points": 7,
          "period_b_points": 11,
          "percentage_change": 57.14,
          "improved": true
        },
        {
          "developer_name": "Bob Johnson",
          "period_a_points": 5,
          "period_b_points": 7,
          "percentage_change": 40.00,
          "improved": true
        }
      ]
    }
  }
}
```

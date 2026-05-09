# Research: project-creation

## Context
This document resolves unknowns identified during the planning phase.

## Unresolved Clarifications from Specification

### Additional Project Fields

- **Decision**: Include `description` (optional text) and `status` (string, default 'active') in addition to `title` and `project_lead_id`.
- **Rationale**: Based on Option A ("Description and Status only"), this provides enough detail for basic project tracking without overwhelming the creation process. Start and end dates are deferred to future iterations to keep project creation extremely fast.
- **Alternatives considered**: Option B (comprehensive tracking with dates) was rejected to reduce friction. Option C (no additional fields) was rejected because projects typically require at least a brief description to differentiate them.

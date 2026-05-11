# Tasks: Feature Shipments

**Input**: Design documents from `/specs/004-feature-shipments/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Setup OpenAI credentials structure in `.env.example` and `config/services.php`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create migration for `pgvector` support (enabling extension conditionally) in `database/migrations/xxxx_xx_xx_enable_vector_extension.php`
- [x] T003 Create `FeatureShipment` and `FeatureEmbedding` migrations in `database/migrations/`
- [x] T004 [P] Create `FeatureShipment` model and factory in `app/Models/FeatureShipment.php` and `database/factories/FeatureShipmentFactory.php`
- [x] T005 [P] Create `FeatureEmbedding` model in `app/Models/FeatureEmbedding.php`
- [x] T006 [P] Create `FeatureShipmentPolicy` in `app/Policies/FeatureShipmentPolicy.php`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log a Feature Shipment (Priority: P1) MVP

**Goal**: Tech Leads can log a shipped feature with its details so that team delivery performance can be tracked.

**Independent Test**: Can be fully tested by creating a new shipment record via the UI and verifying all fields are correctly saved to the database.

### Tests for User Story 1

- [x] T007 [P] [US1] Create Feature tests for shipment logging and policy authorization in `tests/Feature/FeatureShipmentTest.php`

### Implementation for User Story 1

- [x] T008 [P] [US1] Create Form Request validation in `app/Http/Requests/StoreFeatureShipmentRequest.php`
- [x] T009 [US1] Implement `FeatureShipmentController` (`index` and `store` methods) in `app/Http/Controllers/FeatureShipmentController.php`
- [x] T010 [US1] Register feature shipment routes in `routes/web.php`
- [x] T011 [P] [US1] Build `CreateFeatureShipmentModal.tsx` in `resources/js/Pages/FeatureShipments/Partials/CreateFeatureShipmentModal.tsx`
- [x] T012 [US1] Build `Index.tsx` page in `resources/js/Pages/FeatureShipments/Index.tsx`
- [x] T013 [US1] Update `app-sidebar.tsx` in `resources/js/components/app-sidebar.tsx` to include the "Feature Shipments" navigation link

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Generate AI Embeddings for Shipments (Priority: P2)

**Goal**: Automatically generate and store vector embeddings for feature descriptions when a feature is logged.

**Independent Test**: Can be fully tested by verifying that saving a new feature shipment triggers an embedding generation process that stores a vector in the `feature_embeddings` table.

### Tests for User Story 2

- [x] T014 [P] [US2] Create Feature tests for embedding generation job in `tests/Feature/EmbeddingGenerationTest.php`

### Implementation for User Story 2

- [x] T015 [P] [US2] Create `EmbeddingService` to interact with OpenAI in `app/Services/EmbeddingService.php`
- [x] T016 [P] [US2] Create `GenerateFeatureEmbeddingJob` to dispatch vector generation in `app/Jobs/GenerateFeatureEmbeddingJob.php`
- [x] T017 [US2] Update `FeatureShipmentController@store` to dispatch the job after a shipment is created

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 Code cleanup and ESLint/PHPCS formatting verification across touched files
- [x] T019 Run quickstart.md validation locally to ensure pgvector installation instructions are accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- User stories can then proceed in parallel (if staffed)
- Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 by hooking into the shipment creation flow

### Parallel Opportunities

- Foundational models and migrations (T003-T006) can be created simultaneously.
- Frontend components (T011) and backend requests/tests (T007-T008) can be developed in parallel for US1.
- AI Services and Jobs (T015-T016) can be developed in parallel before hooking them into the controller.

---

## Parallel Example: User Story 1

```text
Task: "T007 [US1] Create Feature tests for shipment logging..."
Task: "T008 [US1] Create Form Request validation..."
Task: "T011 [US1] Build CreateFeatureShipmentModal.tsx component"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

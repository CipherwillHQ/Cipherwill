# Complexity Reduction Tasks

Purpose: assign these tasks to agents to reduce unnecessary complexity without changing business behavior.


## Task 7: Decompose AuthProvider Responsibilities
- Priority: P1
- Files:
  - `contexts/AuthContext/index.tsx`
- Problem:
  - Provider contains route guard, analytics, token listeners, and auth action implementations.
- Deliverable:
  - Split into `useAuthState`, `useAuthActions`, and guard/wrapper concerns.
- Acceptance Criteria:
  - Auth actions are easier to test in isolation.
  - Route guarding logic is separate from action logic.
- Effort: medium

## Task 8: Replace Firebase Error if/else Ladder
- Priority: P1
- Files:
  - `contexts/AuthContext/index.tsx`
- Problem:
  - `handle_firebase_error` uses a long branch chain for code-to-message mapping.
- Deliverable:
  - Convert to map-based lookup with single fallback.
- Acceptance Criteria:
  - Same user-facing error strings.
  - Function size and branching reduced.
- Effort: low

## Task 9: Deduplicate Objective Engine Operation Lifecycle
- Priority: P1
- Files:
  - `components/app/GuidedActions/hooks/useObjectiveEngine.ts`
- Problem:
  - `initialize`, `continueCurrentStep`, and `submitCurrentStep` repeat operation lifecycle code.
- Deliverable:
  - Introduce a shared wrapper for stale-op checks/loading/error handling.
- Acceptance Criteria:
  - Duplicate try/catch/finally logic removed.
  - Objective behavior unchanged.
- Effort: medium

## Task 10: Replace Multi-Effect Autosave Pattern
- Priority: P2
- Files:
  - `app/app/profile/Profile.tsx`
- Problem:
  - Six near-identical `useEffect` blocks schedule saves field-by-field.
- Deliverable:
  - Use a single autosave effect or unified field-change pipeline.
- Acceptance Criteria:
  - Autosave still works per field.
  - Repetitive effects removed.
- Effort: low

## Task 11: Simplify BeneficiaryChoice Popup Duplication
- Priority: P2
- Files:
  - `components/app/data/DataHeader/BeneficiaryChoice.tsx`
- Problem:
  - Restricted and normal popup branches duplicate trigger/content structure.
- Deliverable:
  - Consolidate to one popup shell with conditional content body.
- Acceptance Criteria:
  - Same UX for premium and restricted states.
  - Fewer duplicated JSX blocks.
- Effort: low

## Task 12: Fix Debounce Timer State Smell
- Priority: P2
- Files:
  - `components/app/smartwill/PersonSelector.tsx`
- Problem:
  - Debounce timer is module-level shared mutable state (`let timeout`).
- Deliverable:
  - Replace with per-instance `useRef` timer + cleanup.
- Acceptance Criteria:
  - No module-level timer variable.
  - No cross-instance interference risk.
- Effort: low

## Task 13: Split UserSetup Effect by Concern
- Priority: P2
- Files:
  - `contexts/UserSetupContext/index.tsx`
- Problem:
  - Single effect combines analytics identify, preference fetch, signup conversion, and country mutation.
- Deliverable:
  - Break into focused effects/hooks by responsibility.
- Acceptance Criteria:
  - Each effect has one concern.
  - Existing setup behavior preserved.
- Effort: low

## Task 14: Remove Dead Beneficiary Callback Branch
- Priority: P3
- Files:
  - `app/app/beneficiaries/page.tsx`
- Problem:
  - `"friend"` branch in selector response is currently unreachable.
- Deliverable:
  - Remove dead branch or wire a real friend flow.
- Acceptance Criteria:
  - No dead conditional branch left in callback.
- Effort: low

## Systemic Follow-up Task (Cross-Cutting)
- Priority: P1
- Scope:
  - Migration/session validation logic appears in multiple files.
- Deliverable:
  - Create shared domain helpers for key/session migration guards and reuse them.
- Acceptance Criteria:
  - At least `BeneficiaryList.tsx` and `useBeneficiaryAutoMigration.ts` consume shared guard logic.
  - User-facing messages stay consistent.
- Effort: medium


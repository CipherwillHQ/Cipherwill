# GuidedActions Objective Engine

This folder now runs guided actions from backend objective engine responses.

## Data Model

- `objectiveId`: current objective being processed.
- `state`: flat JSON object returned by backend; treated as canonical and always re-sent.
- `input`: backend-provided UI contract for current step (`single_line_text`, `multi_line_text`, `number`, `boolean`, `choices`), or `null` for transition/display steps.

## Runtime Flow

1. Fetch `getNextObjectiveId`.
2. If an objective exists, call `processObjective(objectiveId, state, input: null)` to fetch current step.
3. Render step from backend payload:
   - `in_progress`: show title/subtext/input.
   - `complete` / `already_complete`: immediately fetch next objective and continue.
4. Submit user values as `input: { step: input.key, value }`.
5. For non-input steps, call mutation again with `input: null` via Continue.
6. Persist `{ objectiveId, state }` in localStorage to resume after refresh.

## Structure

- `hooks/useObjectiveEngine.ts`: Apollo integration, orchestration, persistence.
- `core/engineCore.ts`: pure objective flow state machine helpers.
- `core/types.ts`: shared frontend objective types.
- `core/inputValidation.ts`: input validation helpers.
- `api/objectiveQueries.ts`: GraphQL queries/mutations for objective engine.
- `components/GuidePanel.tsx`: panel container with loading/error/mobile-friendly controls.
- `components/ActionContent.tsx`: reusable step renderer.
- `components/ActionControls.tsx`: shared action buttons (Skip/Submit/Continue).

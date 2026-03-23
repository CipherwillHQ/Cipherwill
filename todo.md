# TODO: Atomic Pod + Key Write Flow (Frontend + Backend)

## Problem
Current upload flow is non-atomic:
1. Pod content is uploaded first.
2. Encryption keys are uploaded next.

If step 2 fails, pod content can exist without a complete keyset, causing decryption/access issues.

## Goal
Make pod + key writes atomic and idempotent across backend and frontend so a pod is never left in a partially written state.

---

## Phase 1 (Preferred): Atomic Backend Mutation

### Backend Tasks
- Add a single mutation (example): `upsertPodWithKeys(input)`.
- Mutation should perform in one DB transaction:
  - Upsert pod/metamodel content.
  - Upsert all related key rows (owner + beneficiary key cluster).
  - Commit only if all succeed.
  - Roll back everything on any failure.
- Add idempotency support:
  - Accept `operation_id` (or `request_id`).
  - If same operation is retried, return previous success safely without duplicate keys.
- Add backend validation:
  - Ensure payload key count/structure is valid.
  - Reject malformed E0/E1 key payloads.
- Add backend logging:
  - Correlate with `operation_id`.
  - Log failure stage (`pod_write`, `key_write`, `commit`).

### Frontend Tasks
- Replace current two-step upload flow:
  - Current: `encrypt_and_upload_pod` + `recurring_upload`.
  - Target: single `upsertPodWithKeys` call.
- Keep current client-side key generation logic, but send pod + full key_cluster in one request.
- Pass generated `operation_id` per upload action.
- Show user states:
  - `Saving...`
  - `Saved`
  - `Failed (retry)`

### API Contract (Draft)
- Input:
  - `metamodel_id`
  - `data_items` / encrypted pod payload
  - `key_cluster`
  - `operation_id`
- Output:
  - `success`
  - `written_pod_ids`
  - `written_key_count`
  - `operation_id`

---

## Phase 2 (Interim Safety, if atomic backend is delayed)

### Backend/Schema Tasks
- Add sync status fields:
  - `pending_key_sync: boolean`
  - `key_sync_attempts: number`
  - `last_key_sync_error: string | null`
- Mark pod as `pending_key_sync=true` immediately after pod write.
- Set `pending_key_sync=false` only after full key upload succeeds.

### Frontend Tasks
- If `pending_key_sync=true`, show clear state:
  - “Securing keys, please retry in a moment.”
- Add retry action for failed key sync.
- Prevent destructive actions on pending pods (optional, recommended).

### Repair/Recovery Tasks
- Add background repair job:
  - Find pods with `pending_key_sync=true`.
  - Recompute and upload missing key rows.
  - Mark resolved on success.
- Add admin/ops command for one-user repair.

---

## Related Cleanup Task: Pod Delete Cascade
- Confirm backend delete behavior for `deleteMetamodel`:
  - Must cascade delete pod + key rows for the same `ref_id`.
- If not guaranteed, add explicit backend cleanup transaction.
- Add post-delete integrity check in logs/tests.

---

## Test Plan (Must Pass)

### Backend Tests
- Transaction rollback when key write fails.
- No duplicate rows on idempotent retry with same `operation_id`.
- Mixed owner/beneficiary key clusters persist correctly.

### Frontend/Integration Tests
- Upload success path writes decryptable pod.
- Simulated network failure during write does not leave unreadable state.
- Retry with same `operation_id` succeeds without duplication.
- Migration + backup still work with new write API.

### Manual QA
- Create pod with 0 factors and with 1+ factors.
- Add beneficiary and confirm access.
- Run backup, migrate_in, migrate_out after uploads.
- Delete pod and verify keys are gone.

---

## Acceptance Criteria
- No pod exists in production without a valid required keyset.
- Upload endpoint is idempotent and safe to retry.
- Decryption error rate from partial-write state goes to zero.
- Migration/backup flows work on both legacy and new data.

---

## Suggested Rollout
1. Implement backend mutation + tests behind a feature flag.
2. Ship frontend support to staging.
3. Run targeted migration/backup regression suite.
4. Enable for a small percentage / internal users.
5. Full rollout after monitoring window.

# Browser Guided Actions

The browser chooses objectives, branches through questions, validates answers,
calculates progress, and prepares guidance with rules and templates.

## Guide page

`/app/guide` opens with **Your Cipherwill Status**. It shows the existing 300–950 Cipherwill score,
data-record counts, and beneficiary/factor counts.
The opening slide uses the same centered heading, text, and button styles as objective slides, with
small wrapping pills linking Score to `/app/score`, Data records to `/app/segments`, Beneficiaries to
`/app/beneficiaries`, and Security factors to `/app/factors`. There is no category pill, page top bar, or footer tagline.
The Security factors pill shows **In sync** or **Needs sync** using the dashboard's key-count comparison;
clicking it opens the existing factors page for migration, factor management, and unencrypted-key cleanup.
The overview query returns score/count data, factor key counts, the greeting first name, and email verification status, and runs fresh each time the overview is mounted.
Unverified accounts show an email verification banner above **Continue Cipherwill Setup**. `BannerArea` stacks
independent notice components and collapses when empty, so more banners can be added in the same space.
Continue Setup and deferred-task Resume open objectives independently of verification. Only **Verify your email** opens
**Send verification email**, then **I've verified it** after accepted delivery. Confirmation reloads Firebase, forces a fresh
ID token, and reads `ME` from the network. Still-unverified accounts remain on the confirmation slide with retry feedback;
verified accounts refresh the overview and remove the banner. Back to overview preserves the sent slide while mounted.
Sending and checking disable verification controls.
The guide fills the available page content area inside the shared app layout. The desktop sidebar stays
visible and a small corner button opens the mobile app menu. This route uses the content area's full width
and height without the reading-width restriction or extra bottom padding used by ordinary pages.
Shared authentication, onboarding, theme, and encryption-session providers remain in place.

**Continue Cipherwill Setup** opens the current objective. Questions and reviews appear one slide
at a time, followed by the objective completion display and the next objective. **Let's do this later** is available
directly above the progress indicator for every objective, and returns to the overview.
It does not mark an objective skipped or complete. Starting again resumes the current in-memory flow;
leaving the page or refreshing clears unfinished drafts. Saving disables the pause button until that
operation settles. Completing all available objectives returns to the overview.
With no available objectives, the setup button is hidden. Deferred tasks show a short Do later reminder;
without deferred tasks, the overview omits the extra status line. Loading and retry controls remain available.
The shared navigation lets users leave the page and links to it as **Guide**, directly below Home;
the dashboard no longer mounts a guided-action widget.

**Skip**, beside **Start** on an objective introduction, saves an identifier-only `ObjectiveSkip` record with a server-calculated 90-day return,
discards that objective's draft, and advances to the next eligible objective. The overview's compact
**Do later** pill beside the status links opens a popup with a scrollable list and a Resume button for each
step. Its header stays visible while the list scrolls; Close, Escape, or the backdrop dismisses the popup.
The pill appears when there are deferred steps. Expired deferrals return during the next
Guide visit; no notifications are scheduled. Deferral does not complete an objective or satisfy dependencies.
There is no permanent dismissal option. Once started, an objective does not show Skip; returning from
the overview resumes the current step. Optional questions use **Leave blank** for their optional input.
Earlier explicit dismissal records remain compatible. Ordinary vault/Segments navigation remains available.

## Segment opt-in

Each of the eight toggleable segments has a generated yes/no enable objective. Notes is always enabled.
**Yes, let's add it** saves the existing segment preference and updates browser eligibility, making registered
data objectives for that segment available immediately. **I don't have this yet** defers the enable prompt
for 90 days without enabling the segment. Users can resume it earlier from Do later or enable the segment
from Segments. Newly enabling a segment clears its temporary guidance deferrals while preserving explicit
permanent dismissals. Bank and password objectives require their
segments to be enabled. Premium segment prompts and actions require `me.plan` to be `premium`;
the server checks this again before enabling or completing a segment action.

## Runtime

1. Fetch the catalog, completion IDs, deferral/dismissal metadata, profile/plan, preferences, and beneficiaries in one query.
2. Select accessible candidates and load their shared context providers as needed; isolate failed providers.
   Saves and explicit refresh invalidate context so later objectives use current facts.
3. Process question answers and display transitions in memory.
4. Look up a beneficiary email through `searchPerson`; guest questions stay local.
5. Send allowlisted answers to `completeGuidedAction` only when a server objective is ready to save.
6. Run registered completion operations in the browser after a confirmed save.
7. Advance locally after the completion display and all operations succeed.

## First-item objectives

The central catalog includes `add_first_note`, `add_first_bank_account`, and `add_first_password`.
They ask for title/message, bank name/account number, and service/username/password respectively.
Each shows a review before the user chooses **Encrypt and save**. Passwords are masked, preserve
exact whitespace, and are excluded from review templates and the panel's submitted-answer state.
**Let's do this later** returns to the overview without changing the current objective.

The `savedAssets` provider calls `getGuidedAssetCounts` once per context generation, shared across objectives. Categories with an owned,
nonempty encrypted pod, owner keys, and no unfinished upload skip their first-item objective;
metadata-only drafts do not. These checks recognize items created through ordinary vault screens.

`create_item_id` generates one stable ID; `save_encrypted_asset` creates the ordinary title/name
metadata and reuses the vault's encrypted upload and owner/beneficiary key pipeline. Note messages,
account numbers, usernames, and passwords travel inside encrypted pods. Title/name metadata follows
the existing vault's plaintext metadata behavior. Notes use the existing rich-text model with escaped text.

Completion maps `itemId` from the confirmed save effect and sends only that ID to
`completeGuidedAction`. The server verifies ownership, category, pod/key evidence, and upload state.
Failed uploads retry using the same item ID. Already committed uploads resume without replacing
content; failed completion requests retry without rerunning the successful upload. Recovery also
invalidates vault-list caches. Locking clears draft state and stops follow-up engine work; the existing
upload pipeline checks cancellation between reads, crypto operations, staging writes, and commits.
An individual request or crypto call already in flight can settle before cancellation is observed.

## State and privacy

- Drafts and descriptive asset context stay in memory. Page reload discards unfinished drafts.
- Explicit refresh preserves drafts only when the same unchanged objective remains available.
- Saved follow-ups recover after reload using public definitions, trusted completion outputs, and pending IDs.
  Recovery records contain no submitted answers, decrypted assets, or browser effect outputs.
- Returning to overview preserves submitted draft answers while the guide page remains mounted.
- Locking, logout, account changes, and encryption-session changes dispose of engine state.
- The legacy plaintext localStorage entry is removed on initialization.
- Personalized templates use descriptive bank/provider/issuer fields; credentials are excluded.
- Asset reads use `no-cache`; decrypted context never enters server save variables.
- The entire guide page is excluded from PostHog autocapture/replay and Sentry replay.
- Guidance errors use generic messages, and completion analytics contain objective IDs only.

## Structure

- `core/browserEngine.ts`: in-memory orchestration and retry boundaries.
- `core/guidanceRuntime.ts`, `core/selectGuidance.ts`: refresh, selective contexts, and recovery restoration.
- `core/flowRules.ts`, `core/ruleEvaluation.ts`: generic local selection, conditions, and templates.
- `core/contextCache.ts`: shared, cancelable context loading for the unlocked session.
- `core/submission.ts`: local normalization and the final-save answer allowlist.
- `core/objectiveChoices.ts`: deferral expiry, recovery-list filtering, and segment-enable recovery.
- `core/resolveGuidanceSave.ts`: retryable step effects and final saves.
- `core/finishGuidanceActions.ts`: completion operations before advancing or resuming another step.
- `api/guidanceServices.ts`: initial reads, lookup, final saves, and migration.
- `api/operationHandlers.ts`: named browser operation and context-provider extension points.
- `api/loadGuidanceAssets.ts`, `core/assetContext.ts`: browser decryption and descriptive context.
- `hooks/useObjectiveEngine.ts`: React subscriptions and session cleanup.
- `api/overviewQuery.ts`, `hooks/useGuidanceOverview.ts`: fresh overview reads.
- `components/GuideOverview.tsx`, `core/accountOverview.ts`: overview display and metrics.
- `types/interfaces/guidanceContract.ts`: generated shared protocol; browser-only contracts remain in `guidedActions.ts`.
- `core/assetInputSchema.ts`: generic catalog-declared encrypted field mapping.

## Central registry

`cipherwill-backend/src/objectiveEngine/catalog/entries.ts` is the only production membership list.
`index.ts` binds reusable save descriptors or custom trusted handlers and derives the public catalog,
HQ server-completion view, and legacy membership. Add/remove entries there; definitions and schemas
live in small neighboring modules. The frontend has no independent objective list.

Definitions support conditions, dependencies, questions, templates, validation constraints, effects,
account updates, and follow-ups. New flows using existing capabilities need only registry configuration.
A new database write, browser capability, context provider, or input control needs its shared implementation;
the engine remains unchanged. Local-only flows keep completion in memory and are excluded from HQ rechecks.

Encrypted text asset mappings are declared beside backend definitions and delivered as schemas.
Adding another existing metamodel category needs its schema and objective entry; there is no browser
category switch to edit. The backend counts saved assets across all existing categories and shares
completion/asset/preference reads during rechecks. Tests cover 500 browser objectives and 600 backend
adapters; they verify functional scale and bounded query counts, not production throughput.

Definition revisions are hashed automatically and sent with final saves. A stale/removed objective
refreshes the catalog before selection continues. Protocol capability versions are separate from
individual definition revisions. Saved pending operations retain their original definition and trusted
completion output, so catalog removal cannot discard them. Acknowledgement retries preserve successful
operation checkpoints in memory; operations must tolerate replay after reload and a lost acknowledgement.
Server follow-ups use only completion data/literals so recovery needs no private drafts or effect outputs.

The shared protocol is maintained at backend `catalog/contract.ts`. Run `npm run guidance:sync` in the
backend to regenerate the frontend copy; `npm run guidance:check` checks drift in a combined checkout.
Both repositories build without runtime sibling imports. Full browser/visual validation requires an
explicit browser-tool request; terminal unit tests exercise runtime and rendered component contracts.

Deploy the backend before this frontend. Apply PostgreSQL migrations `10_objective_skips`,
`11_objective_deferrals`, and `12_guided_action_recovery` in order before their APIs are used.
The recovery table stores only public definition snapshots, trusted completion output, and action IDs.
The changes prepare these migrations and do not apply them automatically.

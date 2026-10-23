// Holds one unlocked guidance session and selects recoverable or available work.
// Owns fresh account/catalog reads, context invalidation, and draft reset boundaries.
// Does not execute operations or persist plaintext answers.
import type { GuidanceAccount, GuidanceDefinition, GuidanceServices, GuidanceScope, GuidanceRecovery } from "@/types/interfaces";
import { GuidanceContextCache } from "./contextCache";
import { createFlowState } from "./flowRules";
import { selectGuidance } from "./selectGuidance";
import { restoreEnabledSegmentGuidance } from "./objectiveChoices";

export class GuidanceRuntime {
  account: GuidanceAccount | null = null;
  catalog: GuidanceDefinition[] = [];
  available: GuidanceDefinition[] = [];
  flow: GuidanceDefinition | null = null;
  state = createFlowState();
  completed = new Set<string>();
  contexts: GuidanceContextCache;
  private controller = new AbortController();
  constructor(readonly services: GuidanceServices) { this.contexts = new GuidanceContextCache(services); }

  scope = (): GuidanceScope => ({ account: this.account!, answers: this.state.answers,
    effects: this.state.effects, context: this.contexts.values, completion: this.state.completion });

  async load(refresh = false) {
    const account = await this.services.loadAccount(refresh);
    this.controller.signal.throwIfAborted();
    const catalog = await this.services.loadCatalog();
    this.controller.signal.throwIfAborted();
    this.account = account;
    this.catalog = [...catalog].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  }

  async select() {
    this.controller.signal.throwIfAborted();
    this.state = createFlowState();
    const recovery = this.account?.recovery?.find(item => !this.completed.has(item.definition.id));
    if (recovery) {
      this.restoreRecovery(recovery);
      return;
    }
    const selection = await selectGuidance(this.catalog, this.scope(), this.completed, this.contexts, this.services);
    this.controller.signal.throwIfAborted();
    this.available = selection.catalog;
    this.flow = selection.selected;
  }

  async refresh() {
    const flow = this.flow;
    await this.load(true);
    this.controller.signal.throwIfAborted();
    this.contexts.invalidate();
    if (this.state.completion) return;
    const current = this.catalog.find(item => item.id === flow?.id);
    if (!current || JSON.stringify(current) !== JSON.stringify(flow)) return this.select();
    const selection = await selectGuidance(this.catalog, this.scope(), this.completed, this.contexts, this.services);
    this.controller.signal.throwIfAborted();
    this.available = selection.catalog;
    // Keep submitted drafts when the same objective remains available.
    if (selection.selected?.id !== flow?.id) await this.select();
    else this.flow = flow;
  }

  acceptAccount(next: GuidanceAccount) {
    this.controller.signal.throwIfAborted();
    this.account = restoreEnabledSegmentGuidance(this.account!, next, this.catalog);
    this.contexts.invalidate();
    const recovery = next.recovery?.find(item => item.definition.id === this.flow?.id);
    if (recovery) this.restoreRecovery(recovery);
  }

  private restoreRecovery(recovery: GuidanceRecovery) {
    this.flow = recovery.definition;
    this.state = createFlowState();
    this.state.completion = recovery.completion;
    this.state.finishedActions = new Set((recovery.definition.completion.actions ?? [])
      .filter(action => !recovery.pendingActionIds.includes(action.id)).map(action => action.id));
  }

  dispose() {
    this.controller.abort();
    this.contexts.dispose();
    this.account = null; this.catalog = []; this.available = []; this.flow = null;
    this.state = createFlowState(); this.completed.clear();
  }
}

// Runs centrally registered guided flows entirely in browser memory.
// Owns generic transitions, operation retries, and session disposal.
// Does not register objectives or send decrypted context in save commands.
import type { GuidanceScope, GuidanceServices, GuidanceSnapshot } from "@/types/interfaces";
import { createFlowState, nextFlowStep } from "./flowRules";
import { matchesCondition } from "./ruleEvaluation";
import { GuidanceRuntime } from "./guidanceRuntime";
import { guidanceCatalogChanged } from "./catalogChanged";
import { buildLocalStep } from "./stepResult";
import { normalizeAnswer } from "./submission";
import { deferredGuidanceItems } from "./objectiveChoices";
import { resolveGuidanceSave } from "./resolveGuidanceSave";
import { finishGuidanceActions } from "./finishGuidanceActions";

const INITIAL: GuidanceSnapshot = { started: false, current: null, deferred: [], loading: true, error: null, postActionStatus: null };

export class BrowserGuidanceEngine {
  private snapshot = INITIAL;
  private listeners = new Set<() => void>();
  private runtime: GuidanceRuntime;
  private started = false;
  private pendingChoice: { kind: "defer" } | { kind: "resume"; id: string } | null = null;
  private epoch = 0;
  private operations = new AbortController();

  constructor(private services: GuidanceServices) { this.runtime = new GuidanceRuntime(services); }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  private publish(patch: Partial<GuidanceSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    for (const listener of this.listeners) listener();
  }

  private scope = (): GuidanceScope => this.runtime.scope();

  private render() {
    this.publish({ started: this.started, current: this.runtime.flow ? buildLocalStep(this.runtime.flow, this.runtime.state, this.scope()) : null,
      deferred: this.runtime.account ? deferredGuidanceItems(this.runtime.available, this.scope(), this.runtime.completed) : [] });
  }

  private async selectNext() {
    const epoch = this.epoch;
    this.started = false;
    this.pendingChoice = null;
    await this.runtime.select();
    if (epoch === this.epoch) this.render();
  }

  async initialize() {
    if (this.snapshot.loading && this.runtime.account) return;
    const epoch = ++this.epoch;
    this.publish({ loading: true, error: null });
    try {
      await this.runtime.load();
      if (epoch !== this.epoch) return;
      await this.selectNext();
    } catch {
      if (epoch === this.epoch) this.publish({ error: "Unable to load your setup. Please retry." });
    } finally {
      if (epoch === this.epoch) this.publish({ loading: false });
    }
  }

  async prepareContext() {
    if (this.snapshot.loading) return;
    const epoch = this.epoch;
    this.publish({ loading: true, error: null });
    try {
      const previous = this.runtime.flow;
      await this.runtime.refresh();
      if (epoch !== this.epoch) return;
      if (previous !== this.runtime.flow) this.started = false;
      this.render();
    } catch {
      if (epoch === this.epoch) this.publish({ error: "Unable to load guidance context. Please retry." });
    } finally {
      if (epoch === this.epoch) this.publish({ loading: false });
    }
  }

  async submit(value: unknown) {
    const step = this.runtime.flow ? nextFlowStep(this.runtime.flow, this.runtime.state, this.scope()) : null;
    const input = step?.input;
    if (!input || this.snapshot.loading || this.runtime.state.completion) return;
    try {
      const normalized = normalizeAnswer(input, value);
      this.runtime.state.answers[input.key] = normalized;
      this.runtime.state.visited.add(step!.id);
    } catch {
      this.publish({ error: "Please enter a valid answer." });
      return;
    }
    if (this.runtime.flow?.skipWhen && matchesCondition(this.runtime.flow.skipWhen, this.scope())) return this.defer();
    await this.performTransition(false);
  }

  start() {
    if (!this.runtime.flow || this.snapshot.loading || this.snapshot.error || this.runtime.state.completion) return;
    this.started = true;
    this.render();
  }

  async defer() {
    if (!this.runtime.flow?.skippable || this.snapshot.loading || this.runtime.state.completion) return;
    this.pendingChoice = { kind: "defer" };
    await this.performTransition(false);
  }

  async resume(id: string) {
    if (this.snapshot.loading || !this.snapshot.deferred.some(item => item.objectiveId === id)) return;
    this.pendingChoice = { kind: "resume", id };
    await this.performTransition(false);
  }

  async continue() {
    if (this.snapshot.loading || this.snapshot.error || !this.runtime.flow) return;
    const step = nextFlowStep(this.runtime.flow, this.runtime.state, this.scope());
    if (!this.runtime.state.completion && step?.input) return;
    if (!this.runtime.state.completion && step && !step.effect) this.runtime.state.visited.add(step.id);
    await this.performTransition(Boolean(this.runtime.state.completion));
  }

  async retry() {
    if (this.snapshot.loading) return;
    if (!this.runtime.account || (!this.runtime.flow && !this.pendingChoice)) return this.initialize();
    await this.performTransition(Boolean(this.runtime.state.completion));
  }

  private async performTransition(advance: boolean) {
    const epoch = this.epoch;
    this.publish({ loading: true, error: null });
    try {
      if (advance || (this.pendingChoice?.kind === "resume" && this.runtime.state.completion)) {
        await finishGuidanceActions(this.runtime.flow!, this.runtime.state, () => this.scope(), this.services, this.operations.signal,
          () => epoch === this.epoch, () => this.publish({ postActionStatus: { title: "Finishing your guided action", subtext: "Please wait a moment." } }));
        if (epoch !== this.epoch) return;
        this.runtime.completed.add(this.runtime.flow!.id);
      }
      if (this.pendingChoice?.kind === "defer") {
        const id = this.runtime.flow!.id;
        const choice = await this.services.deferObjective(id, false);
        if (epoch !== this.epoch) return;
        this.runtime.account = { ...this.runtime.account!, deferrals: [...(this.runtime.account!.deferrals ?? []).filter(item => item.objectiveId !== id), choice] };
        await this.selectNext();
      } else if (this.pendingChoice?.kind === "resume") {
        const id = this.pendingChoice.id;
        await this.services.resumeObjective(id);
        if (epoch !== this.epoch) return;
        this.runtime.account = { ...this.runtime.account!, deferrals: (this.runtime.account!.deferrals ?? []).filter(item => item.objectiveId !== id) };
        this.pendingChoice = null;
        this.started = false;
        this.runtime.state = createFlowState();
        this.runtime.flow = this.runtime.catalog.find(item => item.id === id)!;
        this.render();
      } else if (advance) {
        await this.selectNext();
      } else {
        const account = await resolveGuidanceSave(this.runtime.flow!, this.runtime.state, () => this.scope(), this.services,
          this.operations.signal, () => epoch === this.epoch, () => this.render());
        if (epoch !== this.epoch) return;
        if (account) this.runtime.acceptAccount(account);
        this.render();
      }
    } catch (error) {
      if (epoch === this.epoch && guidanceCatalogChanged(error)) {
        try { await this.runtime.load(true); if (epoch !== this.epoch) return;
          this.runtime.contexts.invalidate(); await this.selectNext(); return;
        } catch { /* Keep the objective available for a later catalog retry. */ }
      }
      if (epoch === this.epoch) this.publish({ error: this.pendingChoice ? "Unable to update this objective. Please retry." : this.runtime.state.completion
        ? "Your answers are saved, but a completion action could not finish. Please retry."
        : "This step could not finish. Please retry." });
    } finally {
      if (epoch === this.epoch) this.publish({ loading: false, postActionStatus: null });
    }
  }

  dispose() {
    this.operations.abort();
    this.operations = new AbortController();
    this.runtime.dispose();
    this.runtime = new GuidanceRuntime(this.services);
    this.epoch++;
    this.started = false;
    this.pendingChoice = null;
    this.snapshot = INITIAL;
    this.listeners.clear();
  }
}

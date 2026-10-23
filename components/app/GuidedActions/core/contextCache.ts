// Loads each named context once per unlocked guidance session.
// Owns shared promises and cancellation for registered context providers.
// Does not expose context to final-save commands or persist it.
import type { GuidanceServices } from "@/types/interfaces";

export class GuidanceContextCache {
  private controller = new AbortController();
  private pending = new Map<string, Promise<unknown>>();
  readonly failed = new Set<string>();
  readonly values: Record<string, unknown> = {};

  constructor(private services: GuidanceServices) {}

  async load(names: string[]) {
    const signal = this.controller.signal;
    await Promise.all([...new Set(names)].map(name => this.loadOne(name)));
    signal.throwIfAborted();
  }

  private async loadOne(name: string) {
    const signal = this.controller.signal;
    signal.throwIfAborted();
    if (this.failed.has(name)) return;
    if (!this.pending.has(name)) {
      this.pending.set(name, Promise.resolve().then(() => this.services.loadContext(name, signal)));
    }
    try {
      const value = await this.pending.get(name);
      signal.throwIfAborted();
      this.values[name] = value;
      this.failed.delete(name);
    } catch {
      signal.throwIfAborted();
      this.pending.delete(name);
      this.failed.add(name);
    }
  }

  dispose() {
    this.controller.abort();
    this.pending.clear();
    this.failed.clear();
    for (const name of Object.keys(this.values)) delete this.values[name];
  }

  invalidate() {
    this.dispose();
    this.controller = new AbortController();
  }
}

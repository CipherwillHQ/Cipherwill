import type { PersistedObjectiveSession } from "./types";

const OBJECTIVE_STORAGE_KEY = "guided-actions-objective-session-v1";

export function readPersistedSession(): PersistedObjectiveSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(OBJECTIVE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PersistedObjectiveSession;
    if (!parsed?.objectiveId) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(session: PersistedObjectiveSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(OBJECTIVE_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(session));
}

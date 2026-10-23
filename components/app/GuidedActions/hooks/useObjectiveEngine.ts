// Binds the in-memory browser engine to React and the current user session.
// Owns initialization, subscriptions, and cleanup on lock or account change.
// Does not persist conversations or process questions on the server.
"use client";
import { useApolloClient } from "@apollo/client/react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useSession } from "@/contexts/SessionContext";
import { createGuidanceServices } from "../api/guidanceServices";
import { BrowserGuidanceEngine } from "../core/browserEngine";
import { clearLegacyObjectiveSession } from "../core/objectiveSessionStorage";

export default function useObjectiveEngine() {
  const client = useApolloClient();
  const { session } = useSession();
  const engine = useMemo(() => new BrowserGuidanceEngine(createGuidanceServices(client, session ?? null)), [client, session]);
  const snapshot = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
  useEffect(() => {
    clearLegacyObjectiveSession();
    void engine.initialize();
    return () => engine.dispose();
  }, [engine]);

  return { ...snapshot, engine };
}

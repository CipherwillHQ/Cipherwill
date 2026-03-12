"use client";

import { useApolloClient } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  advanceObjective,
  buildSubmissionInput,
  resolveNextInProgressObjective,
  type ObjectiveEngineClient,
  type ObjectiveResolution,
} from "../core/engineCore";
import {
  GET_NEXT_OBJECTIVE_ID,
  PROCESS_OBJECTIVE_WITH_INPUT,
  PROCESS_OBJECTIVE_WITHOUT_INPUT,
} from "../api/objectiveQueries";
import {
  persistSession,
  readPersistedSession,
} from "../core/objectiveSessionStorage";
import type {
  ObjectiveInProgress,
  ObjectiveInputPayload,
  ObjectiveProcessResult,
} from "../core/types";

function resolveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unable to load guided actions right now.";
}

const PREFETCHABLE_ACTION = "complete";

export default function useObjectiveEngine() {
  const apolloClient = useApolloClient();
  const [current, setCurrent] = useState<ObjectiveInProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const operationIdRef = useRef(0);
  const prefetchedResolutionRef = useRef<{
    sourceObjectiveId: string;
    resolution: ObjectiveResolution;
  } | null>(null);

  const engineClient = useMemo<ObjectiveEngineClient>(
    () => ({
      getNextObjectiveId: async () => {
        const response = await apolloClient.query<{
          getNextObjectiveId: string | null;
        }>({
          query: GET_NEXT_OBJECTIVE_ID,
          fetchPolicy: "network-only",
        });
        return response.data?.getNextObjectiveId ?? null;
      },
      processObjective: async ({
        objectiveId,
        state,
        input,
      }: {
        objectiveId: string;
        state: Record<string, unknown> | null;
        input: ObjectiveInputPayload | null;
      }) => {
        const baseVariables = {
          objectiveId,
          state,
        };
        const response = await apolloClient.mutate<{
          processObjective: ObjectiveProcessResult;
        }>({
          mutation: input
            ? PROCESS_OBJECTIVE_WITH_INPUT
            : PROCESS_OBJECTIVE_WITHOUT_INPUT,
          variables: input
            ? {
                ...baseVariables,
                step: input.step,
                value: input.value,
              }
            : baseVariables,
        });

        if (!response.data?.processObjective) {
          throw new Error("Objective engine returned an empty response.");
        }

        return response.data.processObjective;
      },
    }),
    [apolloClient]
  );

  const applyResolution = useCallback((resolution: ObjectiveResolution) => {
    if (resolution.kind === "in_progress") {
      setCurrent(resolution.payload);
      persistSession({
        objectiveId: resolution.payload.objectiveId,
        state: resolution.payload.result.state,
      });
      return;
    }

    setCurrent(null);
    persistSession(null);
  }, []);

  const reset = useCallback(() => {
    operationIdRef.current += 1;
    setCurrent(null);
    setError(null);
    setLoading(false);
    prefetchedResolutionRef.current = null;
    persistSession(null);
  }, []);

  const startOperation = useCallback(() => {
    const operationId = ++operationIdRef.current;
    setLoading(true);
    setError(null);
    return operationId;
  }, []);

  const isLatestOperation = useCallback((operationId: number) => {
    return operationId === operationIdRef.current;
  }, []);

  const initialize = useCallback(async (options?: { ignorePersisted?: boolean }) => {
    const operationId = startOperation();
    prefetchedResolutionRef.current = null;

    try {
      const persisted = options?.ignorePersisted ? null : readPersistedSession();
      const resolution = await resolveNextInProgressObjective(engineClient, persisted);
      if (!isLatestOperation(operationId)) {
        return;
      }

      applyResolution(resolution);
    } catch (err) {
      if (!isLatestOperation(operationId)) {
        return;
      }
      setError(resolveErrorMessage(err));
    } finally {
      if (isLatestOperation(operationId)) {
        setLoading(false);
      }
    }
  }, [applyResolution, engineClient, isLatestOperation, startOperation]);

  const continueCurrentStep = useCallback(async () => {
    if (!current) {
      return;
    }
    const operationId = startOperation();

    try {
      const prefetched = prefetchedResolutionRef.current;
      if (prefetched && prefetched.sourceObjectiveId === current.objectiveId) {
        if (!isLatestOperation(operationId)) {
          return;
        }
        prefetchedResolutionRef.current = null;
        applyResolution(prefetched.resolution);
        return;
      }

      const resolution = await advanceObjective(engineClient, current, null);
      if (!isLatestOperation(operationId)) {
        return;
      }
      applyResolution(resolution);
    } catch (err) {
      if (!isLatestOperation(operationId)) {
        return;
      }
      setError(resolveErrorMessage(err));
    } finally {
      if (isLatestOperation(operationId)) {
        setLoading(false);
      }
    }
  }, [
    applyResolution,
    current,
    engineClient,
    isLatestOperation,
    startOperation,
  ]);

  const submitCurrentStep = useCallback(
    async (value: unknown) => {
      if (!current?.result.input?.key) {
        return;
      }
      const operationId = startOperation();
      prefetchedResolutionRef.current = null;

      try {
        const submission = buildSubmissionInput(current.result.input.key, value);
        const resolution = await advanceObjective(engineClient, current, submission);
        if (!isLatestOperation(operationId)) {
          return;
        }
        applyResolution(resolution);
      } catch (err) {
        if (!isLatestOperation(operationId)) {
          return;
        }
        setError(resolveErrorMessage(err));
      } finally {
        if (isLatestOperation(operationId)) {
          setLoading(false);
        }
      }
    },
    [
      applyResolution,
      current,
      engineClient,
      isLatestOperation,
      startOperation,
    ]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!current || current.result.input) {
      return;
    }
    if (current.result.action !== PREFETCHABLE_ACTION) {
      return;
    }
    if (
      typeof current.result.displayForMs !== "number" ||
      current.result.displayForMs <= 0
    ) {
      return;
    }

    let cancelled = false;
    const sourceObjectiveId = current.objectiveId;
    const operationIdAtStart = operationIdRef.current;

    const prefetchNextObjective = async () => {
      try {
        const resolution = await resolveNextInProgressObjective(engineClient, null);
        if (cancelled || operationIdRef.current !== operationIdAtStart) {
          return;
        }
        prefetchedResolutionRef.current = {
          sourceObjectiveId,
          resolution,
        };
      } catch {
        // Best-effort prefetch; continue with normal flow on failure.
      }
    };

    void prefetchNextObjective();

    return () => {
      cancelled = true;
      if (
        prefetchedResolutionRef.current?.sourceObjectiveId === sourceObjectiveId
      ) {
        prefetchedResolutionRef.current = null;
      }
    };
  }, [current, engineClient]);

  return {
    current,
    loading,
    error,
    hasObjective: !!current,
    initialize,
    reset,
    continueCurrentStep,
    submitCurrentStep,
  };
}

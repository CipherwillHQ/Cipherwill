"use client";

import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  advanceObjective,
  buildSubmissionInput,
  resolveNextInProgressObjective,
  type ObjectiveEngineClient,
  type ObjectiveResolution,
} from "./engineCore";
import type {
  ObjectiveInProgress,
  ObjectiveInputPayload,
  ObjectiveProcessResult,
  PersistedObjectiveSession,
} from "./types";

const GET_NEXT_OBJECTIVE_ID = gql`
  query GET_NEXT_OBJECTIVE_ID {
    getNextObjectiveId
  }
`;

const PROCESS_OBJECTIVE_WITH_INPUT = gql`
  mutation PROCESS_OBJECTIVE_WITH_INPUT(
    $objectiveId: String!
    $state: JSON
    $step: String!
    $value: JSON
    ) {
    processObjective(
      objectiveId: $objectiveId
      state: $state
      input: { step: $step, value: $value }
    ) {
      status
      objectiveTitle
      objectiveDescription
      stepsCompleted
      stepsSkipped
      stepsTotal
      stepsRemaining
      displayForMs
      closePanelAfterDisplay
      step
      title
      subtext
      state
      input {
        type
        key
        placeholder
        minLength
        maxLength
        min
        max
        choices
        skippable
      }
    }
  }
`;

const PROCESS_OBJECTIVE_WITHOUT_INPUT = gql`
  mutation PROCESS_OBJECTIVE_WITHOUT_INPUT($objectiveId: String!, $state: JSON) {
    processObjective(objectiveId: $objectiveId, state: $state, input: null) {
      status
      objectiveTitle
      objectiveDescription
      stepsCompleted
      stepsSkipped
      stepsTotal
      stepsRemaining
      displayForMs
      closePanelAfterDisplay
      step
      title
      subtext
      state
      input {
        type
        key
        placeholder
        minLength
        maxLength
        min
        max
        choices
        skippable
      }
    }
  }
`;

const OBJECTIVE_STORAGE_KEY = "guided-actions-objective-session-v1";

function readPersistedSession(): PersistedObjectiveSession | null {
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

function persistSession(session: PersistedObjectiveSession | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (!session) {
    window.localStorage.removeItem(OBJECTIVE_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(session));
}

function resolveErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Unable to load guided actions right now.";
}

export default function useObjectiveEngine() {
  const apolloClient = useApolloClient();
  const [current, setCurrent] = useState<ObjectiveInProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setCurrent(null);
    setError(null);
    setLoading(false);
    persistSession(null);
  }, []);

  const initialize = useCallback(async (options?: { ignorePersisted?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const persisted = options?.ignorePersisted ? null : readPersistedSession();
      const resolution = await resolveNextInProgressObjective(
        engineClient,
        persisted
      );
      applyResolution(resolution);
    } catch (err) {
      setError(resolveErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [applyResolution, engineClient]);

  const continueCurrentStep = useCallback(async () => {
    if (!current) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resolution = await advanceObjective(engineClient, current, null);
      applyResolution(resolution);
    } catch (err) {
      setError(resolveErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [applyResolution, current, engineClient]);

  const submitCurrentStep = useCallback(
    async (value: unknown) => {
      if (!current?.result.input?.key) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const submission = buildSubmissionInput(current.result.input.key, value);
        const resolution = await advanceObjective(
          engineClient,
          current,
          submission
        );
        applyResolution(resolution);
      } catch (err) {
        setError(resolveErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [applyResolution, current, engineClient]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

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

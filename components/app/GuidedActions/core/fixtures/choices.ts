// Supplies isolated objective choice services for guidance tests.
// Owns deterministic deferral response shape and a no-op resume command.
// Does not persist choices or contact an API.
export const choiceServices = {
  deferObjective: async (objectiveId: string, dismissed: boolean) => ({ objectiveId, dismissed,
    resumeAfter: dismissed ? null : String(Date.now() + 90 * 24 * 60 * 60 * 1000) }),
  resumeObjective: async () => {},
};

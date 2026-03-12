import { gql } from "@apollo/client";

const OBJECTIVE_RESULT_FIELDS = `
  status
  action
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
`;

export const GET_NEXT_OBJECTIVE_ID = gql`
  query GET_NEXT_OBJECTIVE_ID {
    getNextObjectiveId
  }
`;

export const PROCESS_OBJECTIVE_WITH_INPUT = gql`
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
      ${OBJECTIVE_RESULT_FIELDS}
    }
  }
`;

export const PROCESS_OBJECTIVE_WITHOUT_INPUT = gql`
  mutation PROCESS_OBJECTIVE_WITHOUT_INPUT($objectiveId: String!, $state: JSON) {
    processObjective(objectiveId: $objectiveId, state: $state, input: null) {
      ${OBJECTIVE_RESULT_FIELDS}
    }
  }
`;

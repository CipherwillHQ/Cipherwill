// Checks catalog requirements against the browser's registered capabilities.
// Owns protocol, input, provider, and operation compatibility decisions.
// Does not execute unsupported flows or fetch private context.
import { GUIDANCE_PROTOCOL_VERSION } from "@/types/interfaces";
import type { GuidanceDefinition } from "@/types/interfaces";
const inputs = new Set(["email", "single_line_text", "multi_line_text", "date", "number", "boolean", "choices", "file"]);
export function supportsGuidanceDefinition(flow: GuidanceDefinition, operations: string[], contexts: string[]) {
  return (flow.protocolVersion ?? 1) <= GUIDANCE_PROTOCOL_VERSION && (flow.contexts ?? []).every(name => contexts.includes(name))
    && flow.steps.every(step => (!step.input || inputs.has(step.input.type)) && (!step.effect || operations.includes(step.effect.type)))
    && (flow.completion.actions ?? []).every(action => operations.includes(action.type));
}

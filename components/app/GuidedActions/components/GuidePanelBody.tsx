// Renders the current presentation state of the guide panel.
// Owns composition of loading, error, intro, and question views.
// Does not decide question order or execute server commands.
import type { GuidancePanelProps, GuidancePanelState } from "@/types/interfaces";
import { EmptyState, ErrorState, IntroState, LoadingState, StepState } from "./GuidePanelContentStates";

export default function GuidePanelBody({ props, state }: { props: GuidancePanelProps; state: GuidancePanelState }) {
  const { viewState, contentStateKey, current } = state;
  if (viewState === "loading") return <LoadingState stateKey={contentStateKey} phrase={state.loadingPhrase} />;
  if (viewState === "error") return <ErrorState stateKey={contentStateKey} error={props.error ?? "Please retry."} onRetry={props.onRetry} />;
  if (!current) return <EmptyState stateKey={contentStateKey} onClose={props.onClose} />;
  if (viewState === "intro") return <IntroState stateKey={contentStateKey} current={current} onStart={state.onStart}
    onSkip={props.onDefer} loading={props.loading} />;
  return <StepState stateKey={contentStateKey} current={current} inputValue={state.inputValue}
    setInputValue={state.setInputValue} onSubmit={props.onSubmit} submitWithCurrentValue={state.submitWithCurrentValue}
    skipCurrentStep={state.skipCurrentStep} onContinue={props.onContinue} canSubmit={state.canSubmit}
    loading={props.loading} showControls={viewState !== "timed"} />;
}

// Manages transient presentation state for the browser guidance panel.
// Owns input drafts and display countdowns using the engine's started state.
// Does not save answers or retain decrypted context after the panel unmounts.
import { useEffect, useState } from "react";
import type { GuidancePanelProps, GuidancePanelState } from "@/types/interfaces";
import { coerceValueForInput } from "../core/submission";
import { isInputValid } from "../core/inputValidation";

export default function useGuidePanelState(props: GuidancePanelProps): GuidancePanelState {
  const { current, started, loading, error, onSubmit } = props;
  const [inputValue, setInputValue] = useState("");
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const input = current?.result.input ?? null;
  const isTimedDisplayStep = !input && (current?.result.displayForMs ?? 0) > 0;
  const showIntro = Boolean(current && current.result.action !== "complete" && !started);
  const viewState = loading && !current ? "loading" : error ? "error" : !current ? "empty"
    : showIntro ? "intro" : isTimedDisplayStep ? "timed" : "step";
  const contentStateKey = !current ? viewState : viewState === "intro" ? `intro-${current.objectiveId}`
    : `objective-${current.objectiveId}-${current.result.step ?? "display"}-${current.result.title ?? ""}`;
  const canSubmit = isInputValid(input, inputValue);

  useEffect(() => {
    if (!isTimedDisplayStep) return;
    const target = Date.now() + (current?.result.displayForMs ?? 0);
    const timer = window.setInterval(() => setCountdownSeconds(Math.ceil(Math.max(0, target - Date.now()) / 1000)), 200);
    return () => window.clearInterval(timer);
  }, [isTimedDisplayStep, current]);

  return { viewState, current, contentStateKey, inputValue, setInputValue, canSubmit, countdownSeconds,
    isTimedDisplayStep, loadingPhrase: "Preparing your next step...",
    onStart: () => { props.onStart(); setInputValue(""); },
    submitWithCurrentValue: () => {
      if (!input || !canSubmit) return;
      onSubmit(coerceValueForInput(input, inputValue));
      setInputValue("");
    },
    skipCurrentStep: () => { if (input?.skippable) onSubmit(null); },
  };
}

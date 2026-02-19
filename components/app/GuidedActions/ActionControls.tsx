import SimpleButton from "@/components/common/SimpleButton";

interface ActionControlsProps {
  currentAction: any;
  isInputValid: boolean;
  inputType: string | undefined;
  handleSkip: () => void;
  handleSubmit: () => void;
  isAdvancing: boolean;
  currentIndex: number;
  actionsLength: number;
}

export default function ActionControls({
  currentAction,
  isInputValid,
  inputType,
  handleSkip,
  handleSubmit,
  isAdvancing,
  currentIndex,
  actionsLength,
}: ActionControlsProps) {
  return (
    <div className="flex gap-4 items-center justify-center flex-wrap">
      {currentAction?.skippable && (
        <SimpleButton onClick={handleSkip} disabled={isAdvancing}>
          Skip
        </SimpleButton>
      )}
      {isInputValid && inputType !== "boolean" && inputType !== "single-choice" && (
        <SimpleButton onClick={handleSubmit} disabled={isAdvancing}>
          {currentIndex === actionsLength - 1 ? "Complete" : "Submit"}
        </SimpleButton>
      )}
      <div className="text-center w-full">
        {`${currentIndex + 1}/${actionsLength}`}
      </div>
    </div>
  );
}
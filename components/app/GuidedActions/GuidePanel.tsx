import SimpleButton from "@/components/common/SimpleButton";
import { motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useState, useEffect } from "react";
import IntroText from "./IntroText";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";

export default function GuidePanel({
  actions,
  setShowGuidedActions,
  onLoadMoreActions,
}: {
  actions: Array<any>;
  setShowGuidedActions: (value: boolean) => void;
  onLoadMoreActions?: () => boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState<any>("");
  const [showIntro, setShowIntro] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  const hasActions = actions && actions.length > 0;
  const currentAction = hasActions ? actions[currentIndex] : null;
  const inputType = currentAction?.inputType;
  const introText = currentAction?.introText;
  const introTimeout =
    typeof currentAction?.introTextTimeout === "number"
      ? currentAction.introTextTimeout
      : 2000;

  useEffect(() => {
    if (introText) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, introTimeout);
      return () => clearTimeout(timer);
    } else {
      setShowIntro(false);
    }
  }, [currentIndex, introText, introTimeout]);

  const closeGuidePanel = () => {
    // wait for 500ms before closing to allow animation to complete
    setTimeout(() => {
      setShowGuidedActions(false);
    }, 500);
  };

  const handleContinue = () => {
    if (onLoadMoreActions && onLoadMoreActions()) {
      setCurrentIndex(0);
      setShowCompletionPrompt(false);
      resetInput();
      setShowIntro(true);
    } else {
      closeGuidePanel();
    }
  };

  const handleDone = () => {
    closeGuidePanel();
  };

  const resetInput = (type?: string) => {
    if (type === "multiple-choice") {
      setInputValue([]);
      return;
    }
    setInputValue("");
  };

  const handleSubmit = () => {
    if (isAdvancing) return;
    const currentType = currentAction?.inputType;
    if (currentIndex < actions.length - 1) {
      setIsAdvancing(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        resetInput(currentType);
        setIsAdvancing(false);
      }, 1000);
    } else {
      setShowCompletionPrompt(true);
    }
  };

  const handleSkip = () => {
    if (isAdvancing) return;
    const currentType = currentAction?.inputType;
    if (currentIndex < actions.length - 1) {
      setIsAdvancing(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        resetInput(currentType);
        setIsAdvancing(false);
      }, 1000);
    } else {
      setShowCompletionPrompt(true);
    }
  };

  const isInputValid = (() => {
    if (!inputType) return true;
    if (inputType === "boolean" || inputType === "single-choice") return true;
    if (inputType === "multiple-choice") {
      return Array.isArray(inputValue) && inputValue.length > 0;
    }
    return inputValue?.toString().trim() !== "";
  })();

  return (
    <motion.div
      className="absolute z-50 top-0 left-0 w-full h-full bg-secondary flex flex-col justify-between overflow-hidden p-4 border border-default"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <h1>Guided Panel</h1>
        <div className="flex gap-2 items-center">
          <SwitchThemeIcon />
          <SimpleButton onClick={() => setShowGuidedActions(false)}>
            Close
          </SimpleButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center p-2">
        {showCompletionPrompt ? (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">All Actions Complete!</h2>
            <p className="text-lg">Would you like to continue adding more data or are you done for today?</p>
            <div className="flex gap-4">
              <SimpleButton onClick={handleContinue}>
                Continue Adding Data
              </SimpleButton>
              <SimpleButton onClick={handleDone}>
                Done for Today
              </SimpleButton>
            </div>
          </div>
        ) : hasActions ? (
          showIntro && introText ? (
            <IntroText introText={introText} />
          ) : (
            <ActionContent
              currentAction={currentAction}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              isAdvancing={isAdvancing}
            />
          )
        ) : (
          <div className="text-6xl font-bold text-black/10 dark:text-white/10">
            No Actions
          </div>
        )}
      </div>
      {!showCompletionPrompt && (
        <ActionControls
          currentAction={currentAction}
          isInputValid={isInputValid}
          inputType={inputType}
          handleSkip={handleSkip}
          handleSubmit={handleSubmit}
          isAdvancing={isAdvancing}
          currentIndex={currentIndex}
          actionsLength={actions.length}
        />
      )}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import SimpleButton from "@/components/common/SimpleButton";

interface ActionContentProps {
  currentAction: any;
  inputValue: any;
  setInputValue: (value: any) => void;
  handleSubmit: () => void;
  isAdvancing: boolean;
}

export default function ActionContent({
  currentAction,
  inputValue,
  setInputValue,
  handleSubmit,
  isAdvancing,
}: ActionContentProps) {
  const inputType = currentAction?.inputType;

  const renderInput = () => {
    switch (inputType) {
      case "text":
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text"
            className="w-full max-w-md px-4 py-2 border border-default rounded bg-primary text-foreground"
          />
        );
      case "textarea":
        return (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter text"
            className="w-full max-w-md px-4 py-2 border border-default rounded bg-primary text-foreground"
            rows={4}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter number"
            className="w-full max-w-md px-4 py-2 border border-default rounded bg-primary text-foreground"
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="text-3xl"
          />
        );
      case "boolean":
        return (
          <div className="flex gap-4">
            <SimpleButton
              onClick={() => {
                if (isAdvancing) return;
                setInputValue("true");
                handleSubmit();
              }}
              className={inputValue === "true" ? "bg-accent" : ""}
            >
              Yes
            </SimpleButton>
            <SimpleButton
              onClick={() => {
                if (isAdvancing) return;
                setInputValue("false");
                handleSubmit();
              }}
              className={inputValue === "false" ? "bg-accent" : ""}
            >
              No
            </SimpleButton>
          </div>
        );
      case "multiple-choice":
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {(currentAction?.choices || []).map((choice: string) => (
              <SimpleButton
                key={choice}
                onClick={() => {
                  if (isAdvancing) return;
                  setInputValue((prev: any) => {
                    const prevArr = Array.isArray(prev) ? prev : [];
                    if (prevArr.includes(choice)) {
                      return prevArr.filter((c: string) => c !== choice);
                    }
                    return [...prevArr, choice];
                  });
                }}
                className={
                  Array.isArray(inputValue) && inputValue.includes(choice)
                    ? "bg-accent text-primary"
                    : ""
                }
              >
                {choice}
              </SimpleButton>
            ))}
          </div>
        );
      case "single-choice":
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {(currentAction?.choices || []).map((choice: string) => (
              <SimpleButton
                key={choice}
                onClick={() => {
                  if (isAdvancing) return;
                  setInputValue(choice);
                  handleSubmit();
                }}
                className={
                  inputValue === choice ? "bg-accent text-primary" : ""
                }
              >
                {choice}
              </SimpleButton>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={currentAction?.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-6 w-full"
    >
      <div className="text-2xl font-medium">
        {currentAction?.action || `Action`}
      </div>
      <div className="text-xl text-black/60 dark:text-white/60">
        {currentAction?.description || currentAction?.content}
      </div>
      {inputType && (
        <div className="w-full flex flex-col items-center gap-4">
          {renderInput()}
        </div>
      )}
    </motion.div>
  );
}
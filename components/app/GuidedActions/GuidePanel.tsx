import SimpleButton from "@/components/common/SimpleButton";
import { motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";

export default function GuidePanel({
  setShowGuidedActions,
}: {
  setShowGuidedActions: (value: boolean) => void;
}) {
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
      <div className="flex flex-1 flex-col items-center justify-center">
        Actions Placeholder
      </div>
      <div className="text-center">1/6</div>
    </motion.div>
  );
}

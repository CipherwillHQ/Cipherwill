/**
 * Step 2 panel for onboarding — "What are you expecting from Cipherwill?"
 * Owns multi-select option cards with animated checkbox indicators.
 * Does not own submission side effects or step transition orchestration.
 */
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingOption } from "./types";

export default function StepExpectations({
  expectationsSelectedIds,
  expectationsCustom,
  expectationOptions,
  onToggleExpectation,
  onCustomChange,
}: {
  expectationsSelectedIds: string[];
  expectationsCustom: string;
  expectationOptions: OnboardingOption[];
  onToggleExpectation: (value: string) => void;
  onCustomChange: (value: string) => void;
}) {
  const hasCustomOption = expectationOptions.some((option) => {
    return option.requires_custom_text && expectationsSelectedIds.includes(option.id);
  });

  const selectedCount = expectationsSelectedIds.length;

  return (
    <motion.div
      key="step-two"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-3.5"
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          What are you hoping to get from Cipherwill?
        </h2>
        <p className="text-sm text-gray-500">
          Select all that apply — this helps us prioritize what matters most.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {expectationOptions.map((option, idx) => {
          const isSelected = expectationsSelectedIds.includes(option.id);
          return (
            <motion.button
              type="button"
              key={option.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
              onClick={() => onToggleExpectation(option.id)}
              className={[
                "group relative flex items-center rounded-lg border-2 px-3 py-2 text-left transition-all duration-200",
                isSelected
                  ? "border-emerald-500 bg-emerald-50/80 shadow-sm"
                  : "border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30",
              ].join(" ")}
            >
              <span
                className={[
                  "text-sm font-medium transition-colors",
                  isSelected
                    ? "text-emerald-800"
                    : "text-gray-700",
                ].join(" ")}
              >
                {option.label}
              </span>
              <motion.span
                animate={{
                  scale: isSelected ? 1 : 0.8,
                  opacity: isSelected ? 1 : 0,
                }}
                className={[
                  "ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-gray-300",
                ].join(" ")}
              >
                {isSelected && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {selectedCount > 0 && (
        <p className="text-xs text-gray-400">
          {selectedCount} option{selectedCount !== 1 ? "s" : ""} selected
        </p>
      )}

      <AnimatePresence>
        {hasCustomOption && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <textarea
              value={expectationsCustom}
              onChange={(event) => onCustomChange(event.target.value)}
              placeholder="Tell us what you're looking for..."
              className="min-h-18 w-full resize-none rounded-xl border-2 border-emerald-200 bg-emerald-50/40 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

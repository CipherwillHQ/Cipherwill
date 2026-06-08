/**
 * Action row for onboarding navigation.
 * Owns shared button layout across both steps.
 * Does not own validation logic or mutation request handling.
 */
import SimpleButton from "@/components/common/SimpleButton";

export default function OnboardingActions({
  canContinueStepOne,
  canSubmit,
  isSubmitting,
  onBack,
  onContinue,
  onSkip,
  onSubmit,
  step,
}: {
  canContinueStepOne: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  step: number;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3.5">
      <div className="flex items-center gap-2">
        {step === 2 && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-40"
        >
          {step === 1 ? "Skip this step" : "Skip & finish"}
        </button>
      </div>

      {step === 1 ? (
        <SimpleButton
          onClick={onContinue}
          disabled={!canContinueStepOne || isSubmitting}
          className="min-w-30 justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </SimpleButton>
      ) : (
        <SimpleButton
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="min-w-40 justify-center rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Complete Setup
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </SimpleButton>
      )}
    </div>
  );
}

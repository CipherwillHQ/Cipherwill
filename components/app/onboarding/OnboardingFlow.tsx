/**
 * Two-step onboarding shell with split-panel layout.
 * Left: brand panel (desktop). Right: question steps with progress indicator.
 * Owns onboarding query/mutation wiring plus step-local state transitions.
 * Does not own shared app navigation, global auth, or dashboard rendering.
 */
"use client";

import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import COMPLETE_MY_ONBOARDING from "@/graphql/ops/auth/mutations/COMPLETE_MY_ONBOARDING";
import GET_MY_ONBOARDING from "@/graphql/ops/auth/queries/GET_MY_ONBOARDING";
import SimpleButton from "@/components/common/SimpleButton";
import FullscreenLoader from "@/components/loaders/FullscreenLoader";
import {
  normalizeOptionArray,
  isStepOneComplete,
  isStepTwoComplete,
  normalizeStringArray,
  toggleStringInList,
  shuffle,
} from "./onboardingUtils";
import StepHeardFrom from "./StepHeardFrom";
import StepExpectations from "./StepExpectations";
import OnboardingActions from "./OnboardingActions";
import OnboardingBrandPanel from "./OnboardingBrandPanel";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import { OnboardingOption } from "./types";

export default function OnboardingFlow() {
  const router = useRouter();
  const hydratedFromServer = useRef(false);
  const [step, setStep] = useState(1);
  const [heardFromOptionId, setHeardFromOptionId] = useState("");
  const [heardFromCustom, setHeardFromCustom] = useState("");
  const [expectationsSelectedIds, setExpectationsSelectedIds] = useState<string[]>([]);
  const [expectationsCustom, setExpectationsCustom] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_MY_ONBOARDING);
  const [completeMyOnboarding, { loading: isSubmitting }] = useMutation(COMPLETE_MY_ONBOARDING);

  const onboarding = (data as any)?.getMyOnboarding;
  const rawHeardFromOptions = normalizeOptionArray(onboarding?.heard_from_options_catalog);
  const rawExpectationOptions = normalizeOptionArray(onboarding?.expectation_options_catalog);

  // Shuffled on each page refresh — runs when onboarding data first arrives
  const [heardFromOptions, setHeardFromOptions] = useState(rawHeardFromOptions);
  const [expectationOptions, setExpectationOptions] = useState(rawExpectationOptions);

  useEffect(() => {
    if (!onboarding) return;
    setHeardFromOptions(shuffle([...rawHeardFromOptions]));
    setExpectationOptions(shuffle([...rawExpectationOptions]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarding]);

  useEffect(() => {
    if (!onboarding || hydratedFromServer.current) return;
    hydratedFromServer.current = true;
    const hydrationFrame = window.requestAnimationFrame(() => {
      setHeardFromOptionId(onboarding.heard_from_option_id || "");
      setHeardFromCustom(onboarding.heard_from_custom || "");
      setExpectationsSelectedIds(
        normalizeStringArray(onboarding.expectations_selected_ids)
      );
      setExpectationsCustom(onboarding.expectations_custom || "");
      if (onboarding.heard_from_option_id) {
        setStep(2);
      }
    });
    return () => window.cancelAnimationFrame(hydrationFrame);
  }, [onboarding]);

  useEffect(() => {
    if (!onboarding?.is_completed) return;
    router.replace("/app");
  }, [onboarding?.is_completed, router]);

  const selectedHeardFromOption: OnboardingOption | null =
    heardFromOptions.find((item) => item.id === heardFromOptionId) || null;
  const selectedExpectationOptions = expectationOptions.filter((item) => expectationsSelectedIds.includes(item.id));
  const canContinueStepOne = isStepOneComplete(selectedHeardFromOption, heardFromCustom);
  const canSubmit = isStepTwoComplete(selectedExpectationOptions, expectationsCustom);

  const handleToggleExpectation = (value: string) => {
    setExpectationsSelectedIds((prev) => toggleStringInList(prev, value));
  };

  const handleNext = () => {
    if (!canContinueStepOne) {
      toast.error("Please finish this step before continuing.");
      return;
    }
    setStep(2);
  };

  const handleSkipStep = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    // Step 2: skip completes onboarding
    try {
      await completeMyOnboarding({
        variables: {
          data: {
            skip_questions: true,
          },
        },
      });
      await refetch();
      toast.success("Onboarding skipped. You can update it later.");
      router.replace("/app");
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Unable to skip onboarding");
    }
  };

  const handleSubmit = async () => {
    if (!canContinueStepOne || !canSubmit) {
      toast.error("Please complete all required onboarding answers.");
      return;
    }
    try {
      await completeMyOnboarding({
        variables: {
          data: {
            heard_from_option_id: heardFromOptionId,
            heard_from_custom: heardFromCustom,
            expectations_selected_ids: expectationsSelectedIds,
            expectations_custom: expectationsCustom,
          },
        },
      });
      await refetch();
      toast.success("Thanks, onboarding completed.");
      router.replace("/app");
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Unable to save onboarding");
    }
  };

  if (loading && !onboarding) return <FullscreenLoader />;
  if (error) {
    return (
      <div className="cw-vh-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-base font-semibold text-red-700">Unable to load onboarding</h1>
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
          <div className="mt-4">
            <SimpleButton onClick={() => refetch()}>Retry</SimpleButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cw-vh-screen flex w-full bg-white">
      {/* Left brand panel — desktop only */}
      <OnboardingBrandPanel />

      {/* Content panel */}
      <div className="flex flex-1 flex-col overflow-y-auto customScrollbar bg-white lg:bg-gray-50/50">
        {/* Mobile/tablet header bar — hidden on desktop */}
        <div className="mb-4 flex shrink-0 items-center justify-center bg-linear-to-br from-primary-900 via-primary-800 to-primary-950 px-5 py-4 lg:hidden">
          <SymbolicLogo overrideTheme="dark" size={28} />
        </div>

        {/* Main content — vertically centered via auto margins */}
        <div className="my-auto flex w-full max-w-lg flex-col self-center px-5 sm:px-8">
          {/* Compact progress indicator */}
          <div className="mb-4 flex items-center gap-1.5">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={[
                  "h-1.5 rounded-full transition-all duration-300",
                  s === 1 ? "w-4" : "w-1.5",
                  step >= s
                    ? "bg-primary"
                    : "bg-gray-200",
                ].join(" ")}
              />
            ))}
            <span className="ml-1.5 text-xs font-medium text-gray-400">
              Step {step}/2
            </span>
          </div>

          {/* Question area */}
          <div>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <StepHeardFrom
                  key="step-1"
                  heardFromOptionId={heardFromOptionId}
                  heardFromCustom={heardFromCustom}
                  heardFromOptions={heardFromOptions}
                  onSelectOption={setHeardFromOptionId}
                  onCustomChange={setHeardFromCustom}
                />
              ) : (
                <StepExpectations
                  key="step-2"
                  expectationsSelectedIds={expectationsSelectedIds}
                  expectationsCustom={expectationsCustom}
                  expectationOptions={expectationOptions}
                  onToggleExpectation={handleToggleExpectation}
                  onCustomChange={setExpectationsCustom}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <OnboardingActions
            canContinueStepOne={canContinueStepOne}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            onBack={() => setStep(1)}
            onContinue={handleNext}
            onSkip={handleSkipStep}
            onSubmit={handleSubmit}
            step={step}
          />
        </div>

        {/* Mobile footer — thin symmetric strip */}
        <div className="mt-4 h-[15px] shrink-0 bg-linear-to-br from-primary-900 via-primary-800 to-primary-950 lg:hidden" />
      </div>
    </div>
  );
}

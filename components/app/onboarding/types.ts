/**
 * Shared option type used by onboarding UI components.
 * Matches the backend onboarding option catalog shape.
 */
export type OnboardingOption = {
  id: string;
  label: string;
  requires_custom_text: boolean;
};

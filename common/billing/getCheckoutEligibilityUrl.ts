// Builds the backend REST URL for checking public upgrade checkout eligibility.
// Owns normalizing NEXT_PUBLIC_API_HOST into the /rest/v1/checkout-eligibility endpoint.
// Does not execute network requests or initialize Paddle.

export default function getCheckoutEligibilityUrl(email: string, userId: string): string | null {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST?.trim();
  if (!apiHost) return null;

  try {
    const url = new URL("/rest/v1/checkout-eligibility", apiHost);
    url.searchParams.set("user_id", userId);
    url.searchParams.set("email", email);
    return url.toString();
  } catch {
    return null;
  }
}

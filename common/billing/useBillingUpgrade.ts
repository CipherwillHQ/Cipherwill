// Opens the authenticated account's annual Premium checkout.
// Owns browser Paddle behavior and mobile external-upgrade attribution.
// Does not send Firebase credentials or activate subscriptions.
"use client";
import { useCallback, useRef } from "react";
import { useApolloClient, useQuery } from "@apollo/client/react";
import type { CheckoutOpenOptions } from "@paddle/paddle-js";
import toast from "react-hot-toast";
import { useUserContext } from "@/contexts/UserSetupContext";
import { usePaddle } from "@/contexts/PaymentGatewayContext";
import { isMobileClient } from "@/common/mobile/useMobileClient";
import logger from "@/common/debug/logger";
import GET_CHECKOUT_ELIGIBILITY from "@/graphql/ops/app/billing/queries/GET_CHECKOUT_ELIGIBILITY";
import ME from "@/graphql/ops/auth/queries/ME";
import type { MeData } from "@/types/interfaces";

type CheckoutEligibilityData = {
  getCheckoutEligibility?: {
    allowed: boolean;
    status?: string | null;
    reason?: string | null;
  };
};

export default function useBillingUpgrade() {
  const { user } = useUserContext();
  const { paddle, PADDLE_YEARLY_PRICE_ID } = usePaddle();
  const client = useApolloClient();
  const { data: userData } = useQuery<MeData>(ME);
  const checkingRef = useRef(false);

  return useCallback(async () => {
    const account = userData?.me;
    if (!account?.id) {
      logger.error("User id is not found for billing");
      toast.error("Something went wrong! Report has been sent to team.");
      return;
    }
    if (checkingRef.current) return;
    checkingRef.current = true;
    try {
      const eligibilityResponse = await client.query<CheckoutEligibilityData>({
        query: GET_CHECKOUT_ELIGIBILITY,
        fetchPolicy: "network-only",
      });
      const eligibility = eligibilityResponse.data?.getCheckoutEligibility;
      if (eligibility && !eligibility.allowed) {
        toast.error(
          eligibility.reason || "You already have an active or pending Premium subscription."
        );
        return;
      }
    } catch (err) {
      logger.error("Failed to verify checkout eligibility", err);
      toast.error("Unable to verify subscription status. Please try again.");
      return;
    } finally {
      checkingRef.current = false;
    }

    const user_id = account.id;
    if (isMobileClient()) {
      const url = new URL("/upgrade", "https://cipherwill.com");
      url.searchParams.set("email", account.email);
      url.searchParams.set("user_id", user_id);
      window.location.assign(url.toString());
      return;
    }
    if (!paddle) {
      logger.error("Paddle is not initialized for checkout");
      return;
    }
    const config: CheckoutOpenOptions = {
      settings: {
        successUrl: "https://www.cipherwill.com/callback/checkout_success",
        allowedPaymentMethods: ["apple_pay", "google_pay", "paypal", "card"],
        theme: "dark",
      },
      items: [{ priceId: PADDLE_YEARLY_PRICE_ID, quantity: 1 }],
      customData: { user_id },
    };
    if (user) config.customer = { email: user.email };
    paddle.Checkout.open(config);
  }, [client, paddle, PADDLE_YEARLY_PRICE_ID, user, userData]);
}

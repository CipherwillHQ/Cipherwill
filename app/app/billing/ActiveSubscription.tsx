"use client";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../../contexts/UserSetupContext";
import DevOnly from "@/components/debug/DevOnly";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { usePaddle } from "@/contexts/PaymentGatewayContext";
import { CheckoutOpenOptions } from "@paddle/paddle-js";
import logger from "@/common/debug/logger";
import { useApolloClient, useQuery } from "@apollo/client";
import ME from "@/graphql/ops/auth/queries/ME";
import GET_MY_SUBSCRIPTION from "@/graphql/ops/app/billing/queries/GET_MY_SUBSCRIPTION";
import SubscriptionDetails from "./SubscriptionDetails";
import SimpleButton from "@/components/common/SimpleButton";

export default function ActiveSubscription() {
  const { user } = useUserContext();
  const { paddle, PADDLE_PRICE_ID } = usePaddle();
  const client = useApolloClient();
  const { data: user_data } = useQuery(ME);

  // const country_to_display =
  //   user && user.country ? user.country : getLocalCountry();

  const {
    data: getSubscription,
    loading,
    error,
  } = useQuery(GET_MY_SUBSCRIPTION);

  const upgradeUsingPaddle = useCallback(async () => {
    const user_id = user_data?.me?.id;
    if (!user_id) {
      logger.error("User id is not found for billing");
      toast.error("Something went wrong! Report has been sent to team.");
      return;
    }

    if (paddle) {
      let checkout_configs: CheckoutOpenOptions = {
        settings: {
          successUrl: "https://www.cipherwill.com/callback/checkout_success",
          allowedPaymentMethods: ["apple_pay", "google_pay", "paypal", "card"],
          theme: "dark",
        },
        items: [
          {
            priceId: PADDLE_PRICE_ID,
            quantity: 1,
          },
        ],
        customData: {
          user_id,
        },
      };
      if (user) {
        checkout_configs.customer = {
          email: user.email,
        };
        paddle.Checkout.open(checkout_configs);
      } else {
        paddle.Checkout.open(checkout_configs);
      }
    } else {
      logger.error("Paddle is not initialized for checkout");
    }
  }, [paddle, PADDLE_PRICE_ID, user, user_data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  const subscription = getSubscription?.getMySubscription;

  return (
    <div className="w-full">
      {subscription ? (
        <SubscriptionDetails
          subscription={subscription}
          client={client}
          paddle={paddle}
        />
      ) : (
        <>
          <div className="my-4 border border-default rounded-md p-4 bg-secondary max-w-2xl">
            <div>You don't have any active subscriptions</div>
            <div className="my-2 flex gap-2">
              <SimpleButton onClick={upgradeUsingPaddle}>
                Upgrade to Premium
              </SimpleButton>
              <SimpleButton href="/pricing">Check pricing</SimpleButton>
            </div>
          </div>

          <DevOnly>
            <div className="flex gap-2">
              <button
                className="border p-2 rounded-sm"
                onClick={upgradeUsingPaddle}
              >
                Checkout using Paddle
              </button>

              <button
                className="border p-2 rounded-sm"
                onClick={async () => {
                  toast.success("Coming soon");
                }}
              >
                Checkout using Razorpay
              </button>
            </div>
          </DevOnly>
        </>
      )}
    </div>
  );
}

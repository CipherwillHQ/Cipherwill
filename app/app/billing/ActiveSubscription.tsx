// Displays the current subscription or the annual Premium offer.
// Owns subscription loading and connects billing checkout actions.
// Does not process payments or manage mobile browser navigation.
"use client";
import DevOnly from "@/components/debug/DevOnly";
import toast from "react-hot-toast";
import { usePaddle } from "@/contexts/PaymentGatewayContext";
import { useApolloClient, useQuery } from "@apollo/client/react";
import GET_MY_SUBSCRIPTION from "@/graphql/ops/app/billing/queries/GET_MY_SUBSCRIPTION";
import SubscriptionDetails from "./SubscriptionDetails";
import SubscriptionUpgrade from "./SubscriptionUpgrade";
import useBillingUpgrade from "@/common/billing/useBillingUpgrade";
import useMobileBillingRefresh from "@/common/billing/useMobileBillingRefresh";
import { SubscriptionData } from "@/types/interfaces";
import { motion } from "framer-motion";

export default function ActiveSubscription() {
  const { paddle } = usePaddle();
  const client = useApolloClient();
  const {
    data: getSubscription,
    loading,
    error,
  } = useQuery<SubscriptionData>(GET_MY_SUBSCRIPTION);

  const upgradeUsingPaddle = useBillingUpgrade();
  useMobileBillingRefresh();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  const subscription = getSubscription?.getMySubscription;

  return (
    <div className="w-full max-w-4xl py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {subscription ? (
          <SubscriptionDetails
            subscription={subscription}
            client={client}
            paddle={paddle}
          />
        ) : (
          <SubscriptionUpgrade onUpgrade={upgradeUsingPaddle} />
        )}

        <DevOnly>
          <div className="flex gap-2 mt-8">
            <button
              className="border p-2 rounded-sm"
              onClick={upgradeUsingPaddle}
            >
              Checkout using Paddle (Annual)
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
      </motion.div>
    </div>
  );
}

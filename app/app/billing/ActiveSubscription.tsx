"use client";
import { useRouter } from "next/navigation";
import { useUserContext } from "../../../contexts/UserSetupContext";
import DevOnly from "@/components/debug/DevOnly";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { usePaddle } from "@/contexts/PaymentGatewayContext";
import { CheckoutOpenOptions } from "@paddle/paddle-js";
import logger from "@/common/debug/logger";
import { useApolloClient, useQuery } from "@apollo/client/react";
import ME from "@/graphql/ops/auth/queries/ME";
import GET_MY_SUBSCRIPTION from "@/graphql/ops/app/billing/queries/GET_MY_SUBSCRIPTION";
import SubscriptionDetails from "./SubscriptionDetails";
import SimpleButton from "@/components/common/SimpleButton";
import { MeData, SubscriptionData } from "@/types/interfaces";
import { FaCrown, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ActiveSubscription() {
  const { user } = useUserContext();
  const { paddle, PADDLE_MONTHLY_PRICE_ID, PADDLE_YEARLY_PRICE_ID } = usePaddle();
  const client = useApolloClient();
  const { data: user_data } = useQuery<MeData>(ME);

  // const country_to_display =
  //   user && user.country ? user.country : getLocalCountry();

  const {
    data: getSubscription,
    loading,
    error,
  } = useQuery<SubscriptionData>(GET_MY_SUBSCRIPTION);

  const upgradeUsingPaddle = useCallback(async (is_monthly: boolean) => {
    const PRICE_ID = 
    is_monthly ? PADDLE_MONTHLY_PRICE_ID :
    PADDLE_YEARLY_PRICE_ID;
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
            priceId: PRICE_ID,
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
  }, [paddle, PADDLE_MONTHLY_PRICE_ID, PADDLE_YEARLY_PRICE_ID, user, user_data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  const subscription = getSubscription?.getMySubscription;

  return (
    <div className="w-full max-w-4xl mx-auto">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-secondary rounded-2xl p-4 md:p-8 border border-default"
          >
            <div className="text-center mb-6">
              <FaCrown className="mx-auto text-6xl text-yellow-500 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                No Active Subscription
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Unlock premium features and secure your digital legacy with our
                subscription plans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => upgradeUsingPaddle(true)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-blue-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Monthly Plan
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  $5{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / month
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Flexible monthly billing
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Click to upgrade
                  </span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => upgradeUsingPaddle(false)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center mb-3">
                  <FaCreditCard className="text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Annual Plan
                  </h3>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  $40{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / year
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Save 33% with annual billing
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Click to upgrade
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <SimpleButton
                href="/pricing"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                View All Pricing Options
              </SimpleButton>
            </div>
          </motion.div>
        )}

        <DevOnly>
          <div className="flex gap-2 mt-8">
            <button
              className="border p-2 rounded-sm"
              onClick={() => upgradeUsingPaddle(true)}
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
      </motion.div>
    </div>
  );
}

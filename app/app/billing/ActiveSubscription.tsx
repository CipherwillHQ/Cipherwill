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
  const { paddle, PADDLE_MONTHLY_PRICE_ID, PADDLE_YEARLY_PRICE_ID } =
    usePaddle();
  const client = useApolloClient();
  const { data: user_data } = useQuery<MeData>(ME);

  // const country_to_display =
  //   user && user.country ? user.country : getLocalCountry();

  const {
    data: getSubscription,
    loading,
    error,
  } = useQuery<SubscriptionData>(GET_MY_SUBSCRIPTION);

  const upgradeUsingPaddle = useCallback(async () => {
    const PRICE_ID = PADDLE_YEARLY_PRICE_ID;
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
  }, [paddle, PADDLE_YEARLY_PRICE_ID, user, user_data]);

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

            <div className="max-w-md mx-auto mb-6">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => upgradeUsingPaddle()}
                className="bg-gradient-to-br from-secondary via-secondary to-secondary rounded-2xl p-8 border border-default cursor-pointer hover:border-primary/80 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-xl text-xs font-semibold">
                  SAVE 33%
                </div>

                <div className="text-center mb-6 mt-4">
                  <FaCreditCard className="mx-auto text-5xl text-primary mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Annual Premium Plan
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The best value for securing your digital legacy
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-gray-500 dark:text-gray-400 line-through text-lg">
                      $60
                    </span>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      $40
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    per year • Just $3.33/month
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Unlimited Beneficiaries & Data
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Access to All Segments
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Flexible Cipherwill Execution Timeline
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Per-Item Beneficiary Selection
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Notification via Email & Phone (Calls, SMS, WhatsApp)
                    </span>
                  </div>
                  
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors duration-200"
                >
                  Upgrade to Premium
                </motion.div>
              </motion.div>
            </div>

            <div className="mt-6 flex items-center justify-center">
              <SimpleButton
                href="/pricing"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                View Plan Comparisons
              </SimpleButton>
            </div>
          </motion.div>
        )}

        <DevOnly>
          <div className="flex gap-2 mt-8">
            <button
              className="border p-2 rounded-sm"
              onClick={() => upgradeUsingPaddle()}
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

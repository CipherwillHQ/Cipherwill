// Displays the existing annual plan offer when no subscription is active.
// Owns plan information and delegates the upgrade action to its caller.
// Does not open checkout or query account information.
"use client";
import { motion } from "framer-motion";
import { FaCrown, FaCreditCard } from "react-icons/fa";
import SimpleButton from "@/components/common/SimpleButton";
import type { SubscriptionUpgradeProps } from "@/types/interfaces";

export default function SubscriptionUpgrade({ onUpgrade }: SubscriptionUpgradeProps) {
  return (
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
          onClick={onUpgrade}
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
  );
}

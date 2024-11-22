"use client";
import logger from "@/common/debug/logger";
import capitalizeFirstLetter from "@/common/string/capitalizeFirstLetter";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import SimpleButton from "@/components/common/SimpleButton";
import CANCEL_SUBSCRIPTION_AT_PERIOD_END from "@/graphql/ops/app/billing/mutations/CANCEL_SUBSCRIPTION_AT_PERIOD_END";
import GET_PADDLE_MANAGE_PAYMENTS_TXS from "@/graphql/ops/app/billing/queries/GET_PADDLE_MANAGE_PAYMENTS_TXS";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";

export default function SubscriptionDetails({
  subscription,
  client,
  paddle,
}: {
  subscription: any;
  client: any;
  paddle: any;
}) {
  return (
    <div className="bg-secondary p-2 rounded-md border border-default w-full max-w-2xl">
      <div>Plan name: {capitalizeFirstLetter(subscription.plan_name)}</div>
      <div>Status: {capitalizeFirstLetter(subscription.status)}</div>
      {subscription.next_billing_at && (
        <div>
          Next billing at:{" "}
          {DateTime.fromMillis(
            parseInt(subscription.next_billing_at)
          ).toLocaleString(DateTime.DATETIME_MED)}
        </div>
      )}
      {subscription.last_payment_method && (
        <div>
          Last used payment method:{" "}
          {capitalizeFirstLetter(subscription.last_payment_method)}
        </div>
      )}
      {subscription.cancel_at && (
        <div>
          Subscription is scheduled to be canceled at:{" "}
          {DateTime.fromMillis(parseInt(subscription.cancel_at)).toLocaleString(
            DateTime.DATETIME_MED
          )}
        </div>
      )}
      {subscription.cancel_at === null && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <SimpleButton
            onClick={async () => {
              if (subscription.payment_gateway === "paddle") {
                await client
                  .query({
                    query: GET_PADDLE_MANAGE_PAYMENTS_TXS,
                    variables: {
                      subscriptionId: subscription.id,
                    },
                  })
                  .then((data) => {
                    const tx = data?.data?.getPaddleManagePaymentsTxs;
                    if (tx) {
                      paddle.Checkout.open({
                        transactionId: tx,
                      });
                    } else {
                      logger.error(
                        "Error while decoding manage payment method for paddle",
                        {
                          subscriptionId: subscription.id,
                        }
                      );
                    }
                  })
                  .catch((err) => {
                    logger.error(err);
                  });
              } else {
                logger.error(
                  `Manage payment method not defined for payment gateway ${subscription.payment_gateway}`
                );
              }
            }}
          >
            Change payment method
          </SimpleButton>
          <Popup
            trigger={<SimpleButton>Cancel subscription</SimpleButton>}
            modal
          >
            {/* @ts-ignore */}

            {(close) => {
              return (
                <div className="bg-white p-2 text-black rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Are you sure?</h2>
                    <IoClose size={23} onClick={close} />
                  </div>
                  <div className="font-medium">
                    This action cannot be reversed. You cannot reinstate a
                    canceled subscription.
                  </div>
                  <div className="mt-3">
                    You will have access to this subscription until next billing
                    date, after that it will be cancelled.
                  </div>
                  <ConfirmationButton
                    className="border p-1 bg-red-300 rounded hover:bg-red-400"
                    onConfirm={async () => {
                      await client
                        .mutate({
                          mutation: CANCEL_SUBSCRIPTION_AT_PERIOD_END,
                          variables: {
                            subscriptionId: subscription.id,
                          },
                        })
                        .then((data) => {
                          if (data.data?.cancelSubscriptionAtPeriodEnd) {
                            toast.success("Cancelling subscription");
                            setTimeout(() => {
                              window.location.reload();
                            }, 3000);
                          } else {
                            logger.error("Error while cancelling subscription");
                            toast.error(
                              "Error!!! Please contact the support team."
                            );
                          }
                        })
                        .catch((err) => {
                          logger.error(err);
                          toast.error(
                            "Error!!! Please contact the support team."
                          );
                        });
                    }}
                  >
                    Cancel subscription
                  </ConfirmationButton>

                  <div className="mt-3">
                    To cancel subscription right now and get remaining amount
                    refunded, please contact support@cipherwill.com.
                  </div>
                </div>
              );
            }}
          </Popup>
        </div>
      )}
    </div>
  );
}

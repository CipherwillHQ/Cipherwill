"use client";
import logger from "@/common/debug/logger";
import capitalizeFirstLetter from "@/common/string/capitalizeFirstLetter";
import SimpleButton from "@/components/common/SimpleButton";
import GET_PADDLE_PORTAL_SESSION_URL from "@/graphql/ops/app/billing/queries/GET_PADDLE_PORTAL_SESSION_URL";
import { DateTime } from "luxon";

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
                    query: GET_PADDLE_PORTAL_SESSION_URL,
                    variables: { subscription_id: subscription.id },
                  })
                  .then((data) => {
                    const url = data?.data?.getPaddlePortalSessionUrl;
                    if (url) {
                      // open url in new tab
                      window.open(url, "_blank");
                    } else {
                      logger.error(
                        "Error while creating paddle checkout session",
                        {
                          subscription,
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
            Manage Subscription
          </SimpleButton>
        </div>
      )}
    </div>
  );
}

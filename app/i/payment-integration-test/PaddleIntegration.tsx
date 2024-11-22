import SimpleButton from "@/components/common/SimpleButton";
import { usePaddle } from "@/contexts/PaymentGatewayContext";
import { CheckoutOpenOptions } from "@paddle/paddle-js";

export default function PaddleIntegrationTest() {
  const { paddle, PADDLE_PRICE_ID } = usePaddle();

  return (
    paddle?.Initialized && (
      <div className="flex flex-col gap-4 items-center justify-center py-20">
        <div>Paddle SDK Initialized - v{paddle.Status.libraryVersion}</div>

        <button
        className="bg-black text-white hover:bg-opacity-80 rounded-md p-2"
          onClick={() => {
            let checkout_configs: CheckoutOpenOptions = {
              settings: {
                successUrl:
                  "https://www.cipherwill.com/callback/checkout_success",
                allowedPaymentMethods: [
                  "apple_pay",
                  "google_pay",
                  "paypal",
                  "card",
                ],
                theme: "dark",
              },
              items: [
                {
                  priceId: PADDLE_PRICE_ID,
                  quantity: 1,
                },
              ],
            };
            paddle.Checkout.open(checkout_configs);
          }}
        >
          Checkout using Paddle
        </button>
      </div>
    )
  );
}

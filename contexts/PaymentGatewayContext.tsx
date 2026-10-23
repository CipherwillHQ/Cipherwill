// Provides Paddle to authenticated billing screens.
// Owns initialization with the current account's Paddle customer details.
// Does not open checkouts or serve the public upgrade page.
"use client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import logger from "@/common/debug/logger";
import {
  PADDLE_ENVIRONMENT as ENVIROMENT,
  PADDLE_TOKEN,
  PADDLE_YEARLY_PRICE_ID,
  PADDLE_MONTHLY_PRICE_ID,
} from "@/common/billing/paddleConfig";
import { ComponentProps } from "@/types/interfaces";

export { PADDLE_YEARLY_PRICE_ID, PADDLE_MONTHLY_PRICE_ID };


const PaymentGatewayContext = createContext<{
  paddle?: Paddle;
  PADDLE_YEARLY_PRICE_ID: string;
  PADDLE_MONTHLY_PRICE_ID: string;
}>({
  PADDLE_YEARLY_PRICE_ID: PADDLE_YEARLY_PRICE_ID,
  PADDLE_MONTHLY_PRICE_ID: PADDLE_MONTHLY_PRICE_ID,
});

export function PaymentGatewayProvider({ children }: ComponentProps) {
  const { user, isLoading } = useAuth();
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    if (!isLoading) {
      // logger.info("Initializing paddle");
      initializePaddle({
        environment: ENVIROMENT,
        token: PADDLE_TOKEN,
      }).then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          paddleInstance.Initialize({
            token: PADDLE_TOKEN,
            pwCustomer: user
              ? {
                  email: user.email,
                }
              : {},
          });
          setPaddle(paddleInstance);
        }
      });
    }
  }, [isLoading, user]);
  const value = { paddle, PADDLE_YEARLY_PRICE_ID: PADDLE_YEARLY_PRICE_ID, PADDLE_MONTHLY_PRICE_ID: PADDLE_MONTHLY_PRICE_ID   };
  return (
    <PaymentGatewayContext.Provider value={value}>
      {children}
    </PaymentGatewayContext.Provider>
  );
}

export function usePaddle() {
  const ctx = useContext(PaymentGatewayContext);
  return {
    paddle: ctx.paddle,
    PADDLE_YEARLY_PRICE_ID: ctx.PADDLE_YEARLY_PRICE_ID,
    PADDLE_MONTHLY_PRICE_ID: ctx.PADDLE_MONTHLY_PRICE_ID,
  };
}

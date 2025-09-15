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
import { BUILD_ENV } from "@/common/constant";
import { ComponentProps } from "@/types/interfaces";

const ENVIROMENT = BUILD_ENV === "production" ? "production" : "sandbox";
const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_TOKEN ?? "";
export const PADDLE_YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_YEARLY_PRICE_ID ?? "";
export const PADDLE_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID ?? "";


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

// Runs Paddle checkout independently of authentication and account queries.
// Owns initialization, account attribution, checkout feedback, and Flutter results.
// Does not activate Premium; the existing payment webhook handles that.
"use client";

import { useEffect, useRef, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { PADDLE_ENVIRONMENT, PADDLE_TOKEN, PADDLE_YEARLY_PRICE_ID } from "@/common/billing/paddleConfig";
import validate_email from "@/common/validators/validate_email";
import notifyUpgradeWebView from "@/common/billing/notifyUpgradeWebView";
import type { UpgradeScreenProps } from "@/types/interfaces";

const unavailableMessage = "Checkout is unavailable right now. Please reopen this page and try again.";

export default function useUpgradeCheckout({ email, userId }: UpgradeScreenProps) {
  const hasValidLink = Boolean(userId && validate_email(email));
  const configurationError = !PADDLE_TOKEN || !PADDLE_YEARLY_PRICE_ID.startsWith("pri_")
    ? unavailableMessage : null;
  const [paddle, setPaddle] = useState<Paddle>();
  const [error, setError] = useState<string | null>(configurationError);
  const [completed, setCompleted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const notificationSent = useRef(false);

  useEffect(() => {
    if (!hasValidLink || configurationError) {
      notifyUpgradeWebView({
        status: "error",
        code: !hasValidLink ? "invalid_link" : "checkout_unavailable",
        message: !hasValidLink ? "This upgrade link is incomplete or invalid." : unavailableMessage,
      }, notificationSent);
      return;
    }
    let active = true;

    initializePaddle({
      environment: PADDLE_ENVIRONMENT,
      token: PADDLE_TOKEN,
      eventCallback: (event) => {
        if (!active) return;
        if (event.name === "checkout.completed") {
          setCompleted(true);
          setCheckoutOpen(false);
          notifyUpgradeWebView({ status: "success" }, notificationSent);
        } else if (event.name === "checkout.closed") {
          setCheckoutOpen(false);
        } else if (event.name === "checkout.error" || event.name === "checkout.failed"
          || event.name === "checkout.payment.error" || event.name === "checkout.payment.failed") {
          setError("Checkout could not be completed. Please try again.");
          setCheckoutOpen(false);
          notifyUpgradeWebView({
            status: "error", code: event.name,
            message: "Checkout could not be completed. Please try again.",
          }, notificationSent);
        }
      },
    }).then((instance) => {
      if (!active) return;
      if (instance) setPaddle(instance);
      else {
        setError(unavailableMessage);
        notifyUpgradeWebView({ status: "error", code: "initialization_failed", message: unavailableMessage }, notificationSent);
      }
    }).catch(() => {
      if (active) {
        setError(unavailableMessage);
        notifyUpgradeWebView({ status: "error", code: "initialization_failed", message: unavailableMessage }, notificationSent);
      }
    });

    return () => { active = false; };
  }, [hasValidLink, configurationError]);

  const openCheckout = () => {
    if (!paddle || !hasValidLink || checkoutOpen || completed) return;
    notificationSent.current = false;
    setError(null);
    setCheckoutOpen(true);
    try {
      paddle.Checkout.open({
        items: [{ priceId: PADDLE_YEARLY_PRICE_ID, quantity: 1 }],
        customer: { email },
        customData: { user_id: userId },
        settings: {
          displayMode: "overlay",
          theme: "light",
          allowLogout: false,
          allowedPaymentMethods: ["apple_pay", "google_pay", "paypal", "card"],
        },
      });
    } catch {
      setError("Checkout could not be opened. Please try again.");
      setCheckoutOpen(false);
      notifyUpgradeWebView({
        status: "error", code: "checkout_open_failed",
        message: "Checkout could not be opened. Please try again.",
      }, notificationSent);
    }
  };

  return {
    hasValidLink, completed, error, checkoutOpen, openCheckout,
    loading: hasValidLink && !paddle && !error,
    canCheckout: hasValidLink && Boolean(paddle) && !checkoutOpen && !completed,
  };
}

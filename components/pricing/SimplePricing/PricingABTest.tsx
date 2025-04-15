"use client";

import { useFeatureFlagVariantKey, usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

export default function PricingABTest() {
  const current_variant = useFeatureFlagVariantKey('pricing-page-conversion')

  if (current_variant === "monthly") {
    return (
      <h2 className="text-center my-6">
        <div className="text-4xl font-extrabold ">
          $3.3
          <span className="text-lg">/Month</span>
        </div>
        <div className="text-base font-semibold">
          $40 Per Year - Paid annually
        </div>
      </h2>
    );
  } else if (current_variant === "yearly") {
    return (
      <h2 className="text-5xl font-extrabold text-center my-8">
        <span className="mr-2 line-through text-neutral-700">$60</span>
        <span>$40</span>
        <span className="text-lg">/Year</span>
      </h2>
    );
  } else {
    return (
      <h2 className="text-5xl font-extrabold text-center my-8">
        <span className="mr-2 line-through text-neutral-700">$60</span>
        <span>$40</span>
        <span className="text-lg">/Year</span>
      </h2>
    );
  }
}

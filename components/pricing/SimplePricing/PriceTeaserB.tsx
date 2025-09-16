"use client";
import Link from "next/link";
import { LuDot } from "react-icons/lu";

const pricingData = [
  {
    id: "free",
    badge: {
      text: "Lifetime free",
      bgColor: "bg-orange-100",
      textColor: "text-orange-900/75",
    },
    price: {
      amount: "$0",
      period: "/Lifetime",
    },
    button: {
      text: "Start for Free",
      bgColor: "bg-gray-50 border hover:bg-gray-200",
      textColor: "text-black",
    },
    description: {
      main: "Get started with cipherwill and create your digital will",
      secondary: "Getting started is easy",
    },
    features: ["Limited Segments", "5 Beneficiaries", "Live Chat Support"],
    featureColor: "text-gray-700",
  },
  {
    id: "monthly",
    badge: {
      text: "Monthly",
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
    },
    price: {
      amount: "$5",
      period: "/Month",
    },
    button: {
      text: "Go Premium",
      bgColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
    },
    description: {
      main: "Perfect for trying premium features",
      secondary: "Flexible monthly billing",
    },
    features: [
      "All Segments",
      "Unlimited beneficiaries",
      "Early access to new features",
    ],
    featureColor: "text-green-700",
  },
  {
    id: "yearly",
    badge: {
      text: "Yearly",
      bgColor: "bg-orange-300",
      textColor: "text-orange-950",
    },
    price: {
      amount: "$40",
      period: "/Year",
      originalAmount: "$60",
      discount: "30% Discount (Best Value)",
    },
    button: {
      text: "Protect Everything Now",
      bgColor: "bg-accent-500 hover:bg-accent-600",
      textColor: "text-white",
    },
    description: {
      main: "Protect all your digital assets and full platform access",
      secondary: "For less than a coffee per month",
    },
    features: [
      "All Segments",
      "Unlimited beneficiaries",
      "Early access to new features",
    ],
    featureColor: "text-green-700",
  },
];

export default function PriceTeaser() {
  return (
    <div className="flex flex-col lg:flex-row justify-evenly gap-4 my-16 items-center lg:items-start">
      {pricingData.map((plan) => (
        <div key={plan.id} className={`p-2 w-full border rounded-lg ${plan.id === 'yearly' ? 'ring ring-accent-500 shadow-lg' : ''}`}>
          <div className="flex items-center gap-2 justify-between">
            <div
              className={`px-6 py-1 w-fit rounded-full ${plan.badge.bgColor} ${plan.badge.textColor} font-semibold`}
            >
              {plan.badge.text}
            </div>
            {plan.price.discount && (
              <div className="text-sm font-bold text-right">
                <span className="text-accent-700">{plan.price.discount}</span>
              </div>
            )}
          </div>
          <h2 className="text-5xl font-extrabold text-center my-8">
            {plan.price.originalAmount && (
              <span className="mr-2 line-through text-neutral-500 font-bold">
                {plan.price.originalAmount}
              </span>
            )}
            <span>{plan.price.amount}</span>
            <span className="text-lg font-extrabold">{plan.price.period}</span>
          </h2>
          <Link href={"/app/billing"}>
            <button
              className={`p-2 w-full ${plan.button.bgColor} hover:cursor-pointer ${plan.button.textColor} rounded-md transition-colors duration-300 ease-in-out`}
            >
              {plan.button.text}
            </button>
          </Link>
          <h3 className="text-gray-500 text-sm font-semibold py-4 text-center">
            {plan.description.main}
            <br />
            <span className="opacity-0">{plan.description.secondary}</span>
          </h3>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <LuDot size={25} className={plan.featureColor} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

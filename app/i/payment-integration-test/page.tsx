"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PaymentGatewayProvider } from "@/contexts/PaymentGatewayContext";
import PaddleIntegration from "./PaddleIntegration";

export default function PaymentIntegrationTest() {
  return (
    <div className="w-full">
      <Header />
      <PaymentGatewayProvider>
        <div className="mt-20 py-20 max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black p-4 text-center">
            Payment Integration Testing Page
          </h1>

          <PaddleIntegration/>
        </div>
      </PaymentGatewayProvider>
      <Footer />
    </div>
  );
}

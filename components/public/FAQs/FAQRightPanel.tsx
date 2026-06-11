/**
 * FAQRightPanel component for desktop FAQ split-screen layout.
 * Owns the dynamic canvas displaying the selected question, its content,
 * a feedback form, and a persistent CTA card at the bottom.
 * Also handles displaying the custom question form if selected.
 * Does NOT own categories, search, or mobile views.
 */

"use client";

import { FAQItem } from "@/types/interfaces";
import SimpleButton from "@/components/common/SimpleButton";
import QuestionFeedback from "./QuestionFeedback";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserSetupContext";
import { useMutation } from "@apollo/client/react";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import toast from "react-hot-toast";

interface FAQRightPanelProps {
  selectedQuestion: FAQItem | null;
  selectedSlug: string | null;
  onClearSelection?: () => void;
}

export default function FAQRightPanel({ 
  selectedQuestion, 
  selectedSlug,
  onClearSelection 
}: FAQRightPanelProps) {
  const { user } = useUserContext();
  const [emailDraft, setEmailDraft] = useState("");
  const [message, setMessage] = useState("");
  const [sendFeedback, { loading }] = useMutation(SEND_FEEDBACK);
  const email = emailDraft || user?.email || "";

  const handleSendQuestion = async () => {
    if (!message.trim()) {
      toast.error("Please enter your question");
      return;
    }
    try {
      await sendFeedback({ variables: { email, message } });
      toast.success("Your question has been sent successfully");
      setMessage("");
      if (onClearSelection) onClearSelection();
    } catch {
      toast.error("Failed to send question. Please try again.");
    }
  };

  const isAskQuestion = selectedSlug === "ask-a-question";

  if (!selectedQuestion && !isAskQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-100 text-center p-8 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
        <p className="text-neutral-500 font-medium text-sm">
          Select a question from the list to view its answer.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-125">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSlug}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1 flex flex-col"
        >
          {isAskQuestion ? (
            /* Custom Question Form */
            <div className="grow pb-8 max-w-xl">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#2A363B] leading-tight mb-2 tracking-tight">
                Ask Our Team
              </h1>
              <p className="text-sm md:text-base text-neutral-500 font-medium mb-8 leading-relaxed">
                Can't find the answer you're looking for? Send us your question directly and our digital legacy specialists will get back to you within 24 hours.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Your Question or Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="How can we help you? Please provide as much detail as possible..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-neutral-200 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </div>

                <SimpleButton
                  onClick={handleSendQuestion}
                  disabled={loading}
                  className="w-full md:w-auto font-semibold px-8 py-3 rounded-xl text-sm"
                >
                  {loading ? "Sending..." : "Send Message to Team →"}
                </SimpleButton>
              </div>
            </div>
          ) : (
            selectedQuestion && (
              /* Main Question & Answer */
              <div className="grow pb-8">
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#2A363B] leading-tight mb-6 tracking-tight">
                  {selectedQuestion.title}
                </h1>

                {/* Answer Content with optimized body styling */}
                <div className="text-neutral-600 font-medium text-base md:text-[17px] leading-relaxed space-y-4 mb-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_li]:mb-2 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-primary/80 faq-content">
                  {selectedQuestion.content}
                </div>

                {/* Question Feedback */}
                <div className="pt-6 border-t border-neutral-100 max-w-xl">
                  <QuestionFeedback question={selectedQuestion.title} />
                </div>
              </div>
            )
          )}

          {/* Persistent Fixed CTA Action Box */}
          {!isAskQuestion && (
            <div className="mt-auto pt-6 border-t border-neutral-100">
              <div className="bg-[#F4F1EA] rounded-2xl p-6 border border-black/3 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3 className="font-playfair text-xl font-bold text-[#2A363B] mb-1.5">
                    Create Cipherwill today
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                    Start creating your digital will and secure bank credentials, crypto seeds, and digital accounts for your loved ones in under 10 minutes.
                  </p>
                </div>
                <div className="shrink-0 w-full md:w-auto">
                  <SimpleButton
                    href="/app"
                    className="w-full md:w-auto font-semibold px-6 py-3 rounded-xl text-sm tracking-wide"
                  >
                    Get Started Free &rarr;
                  </SimpleButton>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

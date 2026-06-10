/**
 * FAQMobileView component for mobile FAQ transition view.
 * Owns the mobile index layout and the sliding slide-over detail/form views.
 * Does NOT own desktop layout panels.
 */

"use client";

import { FAQItem } from "@/types/interfaces";
import { TbSearch, TbArrowLeft } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import SimpleButton from "@/components/common/SimpleButton";
import QuestionFeedback from "./QuestionFeedback";
import { useState } from "react";
import { useUserContext } from "@/contexts/UserSetupContext";
import { useMutation } from "@apollo/client/react";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import toast from "react-hot-toast";
import questions from "./questions";

interface FAQMobileViewProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredQuestions: FAQItem[];
  selectedSlug: string | null;
  onQuestionSelect: (slug: string | null) => void;
  selectedQuestion: FAQItem | null;
}

export default function FAQMobileView({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  filteredQuestions,
  selectedSlug,
  onQuestionSelect,
  selectedQuestion,
}: FAQMobileViewProps) {
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
      onQuestionSelect(null);
    } catch {
      toast.error("Failed to send question. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#FBF9F1] px-4 py-8">
      {/* Mobile Search and Category filters */}
      <div className="mb-6">
        <div className="relative w-full mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
            <TbSearch className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          <button
            onClick={() => onCategoryChange("All")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
              activeCategory === "All"
                ? "bg-primary text-white"
                : "bg-white text-neutral-600 border border-neutral-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-600 border border-neutral-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List with clear dividers */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm bg-white rounded-2xl border border-neutral-100">
            No questions found.
          </div>
        ) : activeCategory !== "All" || searchQuery.trim() !== "" ? (
          /* Single category or search active: render flat list with dividing lines */
          <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden">
            {filteredQuestions.map((question) => (
              <button
                key={question.slug}
                onClick={() => onQuestionSelect(question.slug)}
                className="w-full text-left p-4 hover:bg-neutral-50 flex items-start gap-3 active:bg-neutral-50 transition-colors duration-150"
              >
                {question.icon && (
                  <span className="text-lg text-primary shrink-0 mt-0.5">
                    {question.icon}
                  </span>
                )}
                <div className="grow">
                  <h4 className="text-sm font-semibold text-[#2A363B] leading-snug">
                    {question.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {question.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* "All" active without search: group under category headers with divide lines */
          categories.map((category) => {
            const categoryQuestions = questions[category] || [];
            if (categoryQuestions.length === 0) return null;

            return (
              <div key={category} className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 px-1 mb-2">
                  {category} Questions
                </h3>
                <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden mb-6">
                  {categoryQuestions.map((question) => (
                    <button
                      key={question.slug}
                      onClick={() => onQuestionSelect(question.slug)}
                      className="w-full text-left p-4 hover:bg-neutral-50 flex items-start gap-3 active:bg-neutral-50 transition-colors duration-150"
                    >
                      {question.icon && (
                        <span className="text-lg text-primary shrink-0 mt-0.5">
                          {question.icon}
                        </span>
                      )}
                      <div className="grow">
                        <h4 className="text-sm font-semibold text-[#2A363B] leading-snug">
                          {question.title}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                          {question.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* Ask Custom Question Option at bottom */}
        <button
          onClick={() => onQuestionSelect("ask-a-question")}
          className="w-full text-left p-4 bg-[#F4F1EA] rounded-xl border border-dashed border-neutral-300 flex flex-col gap-1 active:scale-[0.98] transition-transform duration-100 mt-6"
        >
          <span className="text-xs uppercase tracking-wider font-bold text-primary">
            Can't find your answer?
          </span>
          <h4 className="text-sm font-bold text-[#2A363B]">
            Ask our team directly &rarr;
          </h4>
        </button>
      </div>

      {/* Slide-over View Container */}
      <AnimatePresence>
        {selectedSlug && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[200] bg-[#FBF9F1] flex flex-col w-full h-full overflow-hidden"
          >
            {/* Fixed Header */}
            <div className="h-16 px-4 border-b border-neutral-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 shrink-0">
              <button
                onClick={() => onQuestionSelect(null)}
                className="flex items-center gap-2 text-sm font-bold text-[#2A363B] hover:text-primary active:scale-95 transition-all"
              >
                <TbArrowLeft className="w-5 h-5 text-primary" />
                <span>Back to FAQs</span>
              </button>
            </div>

            {/* Scrollable Slide-over Body */}
            <div className="flex-1 overflow-y-auto p-5 pb-24">
              {selectedSlug === "ask-a-question" ? (
                <div className="max-w-md mx-auto">
                  <h1 className="font-playfair text-2xl font-bold text-[#2A363B] mb-2">
                    Ask Our Team
                  </h1>
                  <p className="text-sm text-neutral-500 font-medium mb-6 leading-relaxed">
                    Send us your question directly and our digital legacy specialists will get back to you within 24 hours.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                        Your Question
                      </label>
                      <textarea
                        rows={5}
                        placeholder="How can we help you?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3.5 rounded-xl border border-neutral-200 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <SimpleButton
                      onClick={handleSendQuestion}
                      disabled={loading}
                      className="w-full font-semibold py-3 rounded-xl text-sm"
                    >
                      {loading ? "Sending..." : "Send Message to Team →"}
                    </SimpleButton>
                  </div>
                </div>
              ) : (
                selectedQuestion && (
                  <div className="max-w-xl mx-auto">
                    <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2A363B] leading-tight mb-5">
                      {selectedQuestion.title}
                    </h1>

                    <div className="text-neutral-600 font-medium text-sm sm:text-base leading-relaxed space-y-4 mb-8 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_li]:mb-2 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:font-semibold faq-content">
                      {selectedQuestion.content}
                    </div>

                    <div className="pt-6 border-t border-neutral-100">
                      <QuestionFeedback question={selectedQuestion.title} />
                    </div>

                    {/* Bottom Sticky-style persistent CTA */}
                    <div className="bg-[#F4F1EA] rounded-2xl p-5 border border-black/[0.02] flex flex-col gap-4 mt-8">
                      <div>
                        <h3 className="font-playfair text-lg font-bold text-[#2A363B] mb-1">
                          Create Cipherwill today
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                          Setup your digital will and secure bank credentials, crypto seeds, and files in under 10 minutes.
                        </p>
                      </div>
                      <SimpleButton
                        href="/app"
                        className="w-full font-semibold py-2.5 rounded-xl text-xs sm:text-sm tracking-wide"
                      >
                        Get Started Free &rarr;
                      </SimpleButton>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * FAQInteractiveSection component coordinating split-screen and mobile transitions.
 * Owns FAQ state (selection, category selection, searching) and layout switching.
 * Does NOT own raw question data.
 */

"use client";

import { useState, useEffect } from "react";
import { FAQItem } from "@/types/interfaces";
import questions from "./questions";
import FAQLeftPanel from "./FAQLeftPanel";
import FAQRightPanel from "./FAQRightPanel";
import FAQMobileView from "./FAQMobileView";

interface FAQInteractiveSectionProps {
  initialSlug: string | null;
}

export default function FAQInteractiveSection({
  initialSlug,
}: FAQInteractiveSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = Object.keys(questions);
  const allQuestions = Object.values(questions).flat();

  useEffect(() => {
    setMounted(true);

    const handlePopState = () => {
      const pathParts = window.location.pathname.split("/");
      const slug = pathParts[pathParts.length - 1];
      if (slug && slug !== "frequently-asked-questions") {
        setSelectedSlug(slug);
      } else {
        setSelectedSlug(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initial desktop default selection
    if (window.innerWidth >= 768 && !initialSlug && !selectedSlug) {
      if (allQuestions.length > 0) {
        setSelectedSlug(allQuestions[0].slug);
      }
    }

    return () => window.removeEventListener("popstate", handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuestionSelect = (slug: string | null) => {
    setSelectedSlug(slug);
    if (slug) {
      window.history.pushState(null, "", `/i/frequently-asked-questions/${slug}`);
    } else {
      window.history.pushState(null, "", `/i/frequently-asked-questions`);
    }
  };

  const getFilteredQuestions = () => {
    let list: FAQItem[] = [];
    if (activeCategory === "All") {
      list = allQuestions;
    } else {
      list = questions[activeCategory] || [];
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return list.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.description.toLowerCase().includes(query)
      );
    }
    return list;
  };

  const filteredQuestions = getFilteredQuestions();
  const selectedQuestion = allQuestions.find((q) => q.slug === selectedSlug) || null;

  // Render a clean fallback for Server-Side Rendering (SEO optimization)
  if (!mounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h2 className="text-xl font-bold mb-4 text-[#2A363B]">Categories</h2>
            <div className="space-y-2">
              {allQuestions.map((q) => (
                <div key={q.slug} className="text-sm font-medium text-neutral-600">
                  {q.title}
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-8">
            <h1 className="text-3xl font-bold font-playfair mb-6">Frequently Asked Questions</h1>
            <p className="text-neutral-500">Loading answers and interactive interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Experience (hidden on desktop) */}
      <div className="block md:hidden">
        <FAQMobileView
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredQuestions={filteredQuestions}
          selectedSlug={selectedSlug}
          onQuestionSelect={handleQuestionSelect}
          selectedQuestion={selectedQuestion}
        />
      </div>

      {/* Desktop Experience (hidden on mobile) */}
      <div className="hidden md:flex gap-12 lg:gap-16 max-w-7xl mx-auto py-12 px-6 items-start">
        {/* Left Sticky Navigator Panel (35% Width) - flows naturally, divided clearly */}
        <div className="w-[35%] sticky top-24 h-fit flex flex-col pr-8 lg:pr-12 border-r border-black/5">
          <FAQLeftPanel
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filteredQuestions={filteredQuestions}
            selectedSlug={selectedSlug || ""}
            onQuestionSelect={handleQuestionSelect}
          />

          {/* Inline Ask-a-question trigger below the left list on desktop */}
          <button
            onClick={() => handleQuestionSelect("ask-a-question")}
            className={`w-full text-left mt-6 p-4 rounded-xl border border-dashed transition-all duration-200 flex flex-col gap-1 ${
              selectedSlug === "ask-a-question"
                ? "border-primary bg-primary/5 text-primary"
                : "border-neutral-300 bg-[#F4F1EA] text-[#2A363B] hover:bg-neutral-100"
            }`}
          >
            <span className="text-xs uppercase tracking-wider font-bold text-primary">
              Can't find your answer?
            </span>
            <span className="text-sm font-bold">
              Ask our team directly &rarr;
            </span>
          </button>
        </div>

        {/* Right Dynamic Canvas Panel (65% Width) */}
        <div className="w-[65%] min-h-125">
          <FAQRightPanel
            key={selectedSlug || "default"}
            selectedQuestion={selectedQuestion}
            selectedSlug={selectedSlug}
            onClearSelection={() => {
              // Default to the first question in the list after feedback/form success
              if (allQuestions.length > 0) {
                handleQuestionSelect(allQuestions[0].slug);
              } else {
                handleQuestionSelect(null);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

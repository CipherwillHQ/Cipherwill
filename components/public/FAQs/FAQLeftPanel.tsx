/**
 * FAQLeftPanel component for desktop FAQ split-screen layout.
 * Owns the search bar, category navigation pills, and question list.
 * Does NOT own the display of answer contents or mobile transition views.
 */

"use client";

import { FAQItem } from "@/types/interfaces";
import { TbSearch } from "react-icons/tb";
import questions from "./questions";

interface FAQLeftPanelProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredQuestions: FAQItem[];
  selectedSlug: string;
  onQuestionSelect: (slug: string) => void;
}

export default function FAQLeftPanel({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  filteredQuestions,
  selectedSlug,
  onQuestionSelect,
}: FAQLeftPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white sm:bg-transparent rounded-2xl border border-black/5 lg:border-none p-4 lg:p-0">
      {/* Search Input Container */}
      <div className="relative w-full mb-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
          <TbSearch className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-white text-sm text-[#2A363B] placeholder-neutral-400 font-medium transition-all duration-200"
        />
      </div>

      {/* Category Pills Container */}
      <div className="flex flex-wrap gap-2 mb-6 pb-2 border-b border-neutral-100">
        <button
          onClick={() => onCategoryChange("All")}
          className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
            activeCategory === "All"
              ? "bg-primary text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
              activeCategory === category
                ? "bg-primary text-white shadow-sm"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Questions List (height limited relative to 100 dVH viewport offset for independent sticky scroll) */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100dvh-260px)] pr-2 custom-scrollbar space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-sm">
            No questions found matching your search.
          </div>
        ) : activeCategory !== "All" || searchQuery.trim() !== "" ? (
          /* Single category or search active: render flat list */
          <div className="space-y-2">
            {filteredQuestions.map((question) => {
              const isSelected = question.slug === selectedSlug;
              return (
                <button
                  key={question.slug}
                  onClick={() => onQuestionSelect(question.slug)}
                  className={`w-full text-left py-3 px-4 rounded-xl border-l-4 transition-all duration-200 flex items-start gap-3 group ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-[#2A363B] hover:bg-neutral-50"
                  }`}
                >
                  {question.icon && (
                    <span
                      className={`text-lg shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? "text-primary"
                          : "text-neutral-400 group-hover:text-primary/70"
                      }`}
                    >
                      {question.icon}
                    </span>
                  )}
                  <div className="grow">
                    <h4
                      className={`text-sm leading-snug transition-colors ${
                        isSelected ? "font-bold text-primary" : "font-medium"
                      }`}
                    >
                      {question.title}
                    </h4>
                    <p
                      className={`text-xs mt-1 line-clamp-1 leading-normal ${
                        isSelected ? "text-primary/70" : "text-neutral-400"
                      }`}
                    >
                      {question.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* "All" active without search: group beautifully with headers and dividers */
          categories.map((category, catIdx) => {
            const categoryQuestions = questions[category] || [];
            if (categoryQuestions.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                {catIdx > 0 && (
                  <div className="border-t border-neutral-200/50 my-6 pt-2" />
                )}
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 px-4 mb-3">
                  {category} Questions
                </h3>
                <div className="space-y-2">
                  {categoryQuestions.map((question) => {
                    const isSelected = question.slug === selectedSlug;
                    return (
                      <button
                        key={question.slug}
                        onClick={() => onQuestionSelect(question.slug)}
                        className={`w-full text-left py-3 px-4 rounded-xl border-l-4 transition-all duration-200 flex items-start gap-3 group ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-transparent text-[#2A363B] hover:bg-neutral-50"
                        }`}
                      >
                        {question.icon && (
                          <span
                            className={`text-lg shrink-0 mt-0.5 transition-colors ${
                              isSelected
                                ? "text-primary"
                                : "text-neutral-400 group-hover:text-primary/70"
                            }`}
                          >
                            {question.icon}
                          </span>
                        )}
                        <div className="grow">
                          <h4
                            className={`text-sm leading-snug transition-colors ${
                              isSelected ? "font-bold text-primary" : "font-medium"
                            }`}
                          >
                            {question.title}
                          </h4>
                          <p
                            className={`text-xs mt-1 line-clamp-1 leading-normal ${
                              isSelected ? "text-primary/70" : "text-neutral-400"
                            }`}
                          >
                            {question.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

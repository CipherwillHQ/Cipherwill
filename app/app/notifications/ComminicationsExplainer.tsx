"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is mandatory communication?",
    answer: "Mandatory communications are essential notifications that you cannot opt out of. These include important security alerts, account verification messages, legal updates, and critical service announcements that ensure the proper functioning and security of your Cipherwill account."
  },
  {
    question: "What is promotional communication?",
    answer: "Promotional communications are optional marketing messages about new features, product updates, special offers, educational content, and other non-essential information. You can choose to receive these communications or opt out at any time through your notification settings."
  }
];

export default function ComminicationsExplainer() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto">
      <div className="space-y-2">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-default rounded-lg bg-secondary overflow-hidden"
          >
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors duration-200"
            >
              <span className="font-medium pr-2">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <MdExpandMore className="text-primary flex-shrink-0" size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
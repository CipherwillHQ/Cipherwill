/**
 * Types and interfaces for Frequently Asked Questions (FAQ) section.
 * Owns the FAQItem interface.
 * Does NOT own the question contents or rendering components.
 */

import { ReactNode } from "react";

export interface FAQItem {
  icon?: ReactNode;
  title: string;
  slug: string;
  description: string;
  content: ReactNode;
}

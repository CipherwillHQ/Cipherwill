/**
 * Types and interfaces for the Competitor Comparison pages.
 * Owns the data structures representing competitor details, metrics, and FAQs.
 * Does NOT own the page component layouts or CSS styles.
 */

export interface ComparisonMetric {
  featureName: string;
  cipherwill: string | boolean;
  competitor: string | boolean;
  notes?: string;
}

export interface ComparisonFAQ {
  question: string;
  answer: string;
}

export interface CompetitorData {
  slug: string;
  name: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  websiteUrl: string;
  // Section 2: Core differences cards
  diffIntro: string;
  diffCards: {
    title: string;
    description: string;
    iconName: string; // Used to select appropriate Tabler icon dynamically
  }[];

  // Section 3: Deep dive comparison details
  competitorFocus: string;
  cipherwillAdvantage: string;

  // Section 4: Detailed comparison metrics table
  metrics: ComparisonMetric[];

  // Section 5: FAQs for SEO value
  faqs: ComparisonFAQ[];
}

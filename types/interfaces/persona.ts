/**
 * Types and interfaces for persona guide content.
 * Owns the definitions for persona items, data headers, and section content.
 * Does NOT own UI presentation or route params.
 */

export interface PersonaContentItem {
  subheading?: string;
  text: string;
}

export interface PersonaDataSection {
  header: string;
  content: PersonaContentItem[];
}

export interface PersonaGuide {
  persona: string;
  title: string;
  slug: string;
  date: string;
  data: PersonaDataSection[];
}

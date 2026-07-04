// Content is authored in Sanity and is the single source of truth. Every field
// is optional because the CMS may return a document with any field left unset;
// components render what's present and omit what isn't (no hardcoded fallback).

export interface ServiceCardContent {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface ApproachCardContent {
  title?: string;
  description?: string;
}

export interface HomeContent {
  hero?: {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
  };
  about?: {
    sectionTitle?: string;
    paragraph?: string;
    ctaLabel?: string;
  };
  services?: {
    sectionTitle?: string;
    cards?: ServiceCardContent[];
  };
  approach?: {
    sectionTitle?: string;
    cards?: ApproachCardContent[];
  };
  cta?: {
    heading?: string;
    paragraph?: string;
    ctaLabel?: string;
  };
}

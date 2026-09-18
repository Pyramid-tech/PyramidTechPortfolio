// Content is authored in Sanity. Every field is optional because the CMS may
// return a document with any field left unset. Structural labels and body copy
// in HOME_CONTENT_FALLBACK fill gaps so the page never renders a blank offer.

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
    secondaryCtaLabel?: string;
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
  work?: {
    sectionTitle?: string;
    intro?: string;
    ctaLabel?: string;
  };
  approach?: {
    sectionTitle?: string;
    intro?: string;
    cards?: ApproachCardContent[];
  };
  cta?: {
    heading?: string;
    paragraph?: string;
    ctaLabel?: string;
  };
}

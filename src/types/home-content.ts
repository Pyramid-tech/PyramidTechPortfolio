// Content is authored in Sanity and is the source of truth for authored copy.
// Every field is optional because the CMS may return a document with any field
// left unset; components render what's present and omit what isn't. The one
// exception is the structural labels in HOME_CONTENT_FALLBACK, which have a
// built-in default so the page never renders a blank heading.

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
  work?: {
    sectionTitle?: string;
    ctaLabel?: string;
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

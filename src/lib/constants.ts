export interface NavItem {
  title: string;
  route: string;
  requires?: 'team' | 'projects';
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Home', route: '/' },
  { title: 'Services', route: '/#services' },
  { title: 'Our Team', route: '/team', requires: 'team' },
  { title: 'Our Work', route: '/work', requires: 'projects' },
  { title: 'Start a project', route: '/book' },
];

export function visibleNavItems(available: { team: boolean; projects: boolean }): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.requires || available[item.requires]);
}

export const RADIO_FIELDS = [
  {
    title: 'What do you need built?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'Web development', value: 'web-dev' },
      { name: 'Mobile development', value: 'mobile-dev' },
      { name: 'Desktop development', value: 'desktop-dev' },
      { name: 'AI', value: 'ai-solutions' },
      { name: 'Web, mobile, and desktop', value: 'all-types' },
      { name: 'Something else', value: 'other-service' },
    ],
    formKey: '_service',
  },
  {
    title: "What's your budget?",
    classes: '',
    required: true,
    radioArray: [
      { name: '$2,000 – $4,000', value: '2-4' },
      { name: '$4,000 – $8,000', value: '4-8' },
      { name: '$8,000 – $10,000', value: '8-10' },
      { name: '$10,000+', value: '10+' },
    ],
    formKey: '_budget',
  },
  {
    title: 'Roughly how many screens?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'Under 5', value: '<5' },
      { name: '6–10', value: '6-10' },
      { name: '11–20', value: '11-20' },
      { name: '20+', value: '20+' },
    ],
    formKey: '_pages',
  },
  {
    title: 'How soon do you need it?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'As soon as possible', value: 'max-fast' },
      { name: 'High priority', value: 'high-prio ' },
      { name: 'Standard timeline', value: 'regular' },
      { name: 'Flexible', value: 'take-your-time' },
    ],
    formKey: '_quickness',
  },
];

export const INPUT_FIELDS = [
  { label: 'Your name', name: 'first', classes: '', required: true },
  { label: 'Phone', name: 'phone', classes: '', type: 'tel', required: true },
  { label: 'Email', name: 'email', classes: '', type: 'email', required: true },
  { label: 'Company name', name: 'company', classes: '', required: true },
  { label: 'Company website', name: 'websiteUrl', classes: '' },
];

export const BOOK_FORM_DEFAULT_STATE = {
  _service: null,
  _budget: null,
  _pages: null,
  _quickness: null,

  first: '',
  phone: '',
  email: '',
  company: '',
  websiteUrl: '',
  message: '',
};

// User-facing feedback for the booking form.
export const BOOK_FORM_MESSAGES = {
  rateLimited: 'Too many requests. Please wait a minute.',
  incomplete: 'Please answer all questions before submitting.',
  success: 'Your request was submitted! We will be in touch soon.',
  duplicate: 'Your request was already received — we will be in touch soon.',
  error: 'Something went wrong. Please try again.',
};

// Maps a booking request's service code to a human-readable label.
export const SERVICE_LABELS: Record<string, string> = {
  'web-dev': 'Web development',
  'mobile-dev': 'Mobile development',
  'desktop-dev': 'Desktop development',
  'ai-solutions': 'AI',
  'fullstack': 'Web development',
  'all-types': 'Web, mobile, and desktop',
  'other-service': 'Other',
};

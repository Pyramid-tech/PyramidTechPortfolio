export interface NavItem {
  title: string;
  href: string;
  route?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Main',
    href: 'main',
  },
  {
    title: 'About',
    href: 'about',
  },
  {
    title: 'Services',
    href: 'services',
  },
  {
    title: 'Work',
    href: 'work',
    route: '/projects',
  },
  {
    title: 'Approach',
    href: 'approach',
  },
  {
    title: 'Contact',
    href: 'contact',
  },
];

export const RADIO_FIELDS = [
  {
    title: 'What type of services you want?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'AI Solutions', value: 'ai-solutions' },
      { name: 'Fullstack Development', value: 'fullstack' },
      { name: 'Mobile Development', value: 'mobile-dev' },
      { name: 'All of the above', value: 'all-types' },
      { name: 'Other', value: 'other-service' },
    ],
    formKey: '_service',
  },
  {
    title: 'What is your budget category?',
    classes: '',
    required: true,
    radioArray: [
      { name: '$2000 - $4000', value: '2-4' },
      { name: '$4000 - $8000', value: '4-8' },
      { name: '$8000 - $10000', value: '8-10' },
      { name: '$10000', value: '10+' },
    ],
    formKey: '_budget',
  },
  {
    title: 'Approximately how many pages will your project have?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'Less than 5', value: '<5' },
      { name: '6-10', value: '6-10' },
      { name: '11-20', value: '11-20' },
      { name: '20+', value: '20+' },
    ],
    formKey: '_pages',
  },
  {
    title: 'How quickly do you need the project?',
    classes: '',
    required: true,
    radioArray: [
      { name: 'As fast as possible', value: 'max-fast' },
      { name: 'High priority ', value: 'high-prio ' },
      { name: 'Regular time', value: 'regular' },
      { name: 'Take your time ', value: 'take-your-time' },
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
  'ai-solutions': 'AI Solutions',
  'fullstack': 'Fullstack',
  'mobile-dev': 'Mobile',
  'all-types': 'All services',
  'other-service': 'Other',
};

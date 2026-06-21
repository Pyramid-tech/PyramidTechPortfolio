import { First, Second, Third, Fourth, Fifth } from '@/components/icons/approach-icons';

export const NAV_ITEMS = [
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
    title: 'Approach',
    href: 'approach',
  },
  {
    title: 'Contact',
    href: 'contact',
  },
];

export const CARDS = [
  {
    title: 'AI Solutions',
    description:
      'AI is at the core of what we do. We build intelligent agents, chatbots, and automation that plug straight into your business, integrating large language models, RAG pipelines, and custom ML to turn your data into real, measurable results.',
    services: [
      ['AI agents', 'Chatbots'],
      ['LLM integration', 'Automation'],
    ],
    number: '01.',
    classes: '',
  },
  {
    title: 'Fullstack development',
    description:
      'We build fast, scalable products end to end, online shops, web applications, CMS platforms, and robust APIs. We also weave in AI where it counts, adding intelligent features that make your product smarter and your users’ lives easier.',
    services: [
      ['Online shop', 'Web application'],
      ['CMS', 'API Development'],
    ],
    number: '02.',
    classes: 'border-t border-gray-1/50',
  },
  {
    title: 'Mobile development',
    description:
      'We develop polished native apps for Android and iOS, designed for performance and built to scale. From everyday utilities to AI-powered experiences, we turn your idea into an app people love to use.',
    services: [['Android', 'IOS']],
    number: '03.',
    classes: 'border-t border-gray-1/50',
  },
];

export const APPROACH_CARDS = [
  {
    icon: First,
    title: 'Consultation',
    description:
      'We start by understanding your goals, data, and the problems worth solving with AI. Together we identify the highest-impact use cases and agree on a clear, realistic direction.',
  },
  {
    icon: Second,
    title: 'Joint review',
    description:
      'We map out the solution and share early prototypes, from model choices to data pipelines. You review the plan with us and we refine it together before any heavy lifting begins.',
  },
  {
    icon: Third,
    title: 'Development',
    description:
      'Once the approach is approved, we build it: integrating large language models, training custom models, and wiring everything into your product and workflows.',
  },
  {
    icon: Fourth,
    title: 'Testing',
    description:
      'We rigorously evaluate every model and feature for accuracy, safety, and performance, then bring you in to validate the results against real-world scenarios.',
  },
  {
    icon: Fifth,
    title: 'Final result',
    description:
      'We deploy the solution into production and keep improving it. With monitoring and ongoing fine-tuning, your product gets smarter over time and keeps delivering measurable value.',
  },
];

export const RADIO_FIELDS = [
  {
    title: 'What type of services you want?',
    classes: 'md:mr-[2.25vw]',
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
    classes: 'md:mr-[2.25vw]',
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
  { label: 'Your name', name: 'first', classes: 'md:inline-block md:!w-[calc(50%-2vw)] md:mr-[4vw]', required: true },
  { label: 'Phone', name: 'phone', classes: 'md:inline-block md:!w-[calc(50%-2vw)]', type: 'number', required: true },
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

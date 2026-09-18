import { defineField, defineType } from 'sanity';

/**
 * Singleton document holding editable marketing copy on the home page.
 * Empty fields fall back to the defaults in `HOME_CONTENT_FALLBACK`.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
        defineField({
          name: 'ctaLabel',
          title: 'Primary button label',
          description: 'Goes to the booking page. Destination is fixed in code.',
          type: 'string',
        }),
        defineField({
          name: 'secondaryCtaLabel',
          title: 'Secondary button label',
          description: 'Scrolls to the work section. Destination is fixed in code.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About section',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section title', type: 'string' }),
        defineField({ name: 'paragraph', title: 'Paragraph', type: 'text', rows: 4 }),
        defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'services',
      title: 'Services section',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section title', type: 'string' }),
        defineField({
          name: 'cards',
          title: 'Service cards',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'serviceCard',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
                defineField({
                  name: 'tags',
                  title: 'Service tags',
                  description: 'Shown as bullet points, two per row.',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'work',
      title: 'Work section',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
        defineField({
          name: 'ctaLabel',
          title: 'Link label',
          description: 'Shown under the featured projects, linking to the full work archive.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'approach',
      title: 'Approach section',
      type: 'object',
      fields: [
        defineField({ name: 'sectionTitle', title: 'Section title', type: 'string' }),
        defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3 }),
        defineField({
          name: 'cards',
          title: 'Approach steps',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'approachCard',
              fields: [
                defineField({ name: 'title', title: 'Title', type: 'string' }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'paragraph', title: 'Paragraph', type: 'text', rows: 4 }),
        defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
});

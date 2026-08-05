import { defineField, defineType } from 'sanity';

/**
 * Singleton document holding every editable text string on the marketing home
 * page. Every field is optional — anything left unset renders blank on the site
 * (Sanity is the single source of truth; there is no hardcoded fallback copy).
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
        defineField({ name: 'ctaLabel', title: 'Button label', type: 'string' }),
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
        defineField({
          name: 'ctaLabel',
          title: 'Link label',
          description: 'Shown when there are more projects than the homepage lists.',
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

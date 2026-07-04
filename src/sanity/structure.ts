import type { StructureResolver } from 'sanity/structure';

/**
 * Pins "Home Page" as a singleton: always the same document id, so editors
 * open and edit one document instead of managing a list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
    ]);

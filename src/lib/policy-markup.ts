export type PolicyBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

export type PolicyInline =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'link'; label: string; href: string };

const PLACEHOLDER = /\[\[[^\]]*\]\]/;

const INLINE =
  /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https:\/\/[^\s<>()]*[^\s<>().,;:!?])|([\w.%+-]+@[\w-]+(?:\.[\w-]+)+)/g;

export function hasPolicyPlaceholders(source: string): boolean {
  return PLACEHOLDER.test(source);
}

function safeHref(value: string): string | null {
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'mailto:' ? value : null;
  } catch {
    return null;
  }
}

export function parsePolicy(source: string): PolicyBlock[] {
  const blocks: PolicyBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ type: 'paragraph', text: paragraph.join('\n') });
    paragraph = [];
  };
  const flushList = () => {
    if (list.length > 0) blocks.push({ type: 'list', items: list });
    list = [];
  };

  for (const raw of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const bullet = /^[-*•]\s+(.+)$/.exec(line);

    if (!line) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length === 3 ? 3 : 2, text: heading[2] });
    } else if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function parsePolicyInline(text: string): PolicyInline[] {
  const parts: PolicyInline[] = [];
  let cursor = 0;

  for (const match of Array.from(text.matchAll(INLINE))) {
    const [whole, bold, label, target, url, email] = match;
    const start = match.index ?? 0;
    if (start > cursor) parts.push({ type: 'text', value: text.slice(cursor, start) });

    const href = safeHref(target ?? url ?? (email ? `mailto:${email}` : ''));
    if (bold) parts.push({ type: 'bold', value: bold });
    else if (href) parts.push({ type: 'link', label: label ?? whole, href });
    else parts.push({ type: 'text', value: whole });

    cursor = start + whole.length;
  }

  if (cursor < text.length) parts.push({ type: 'text', value: text.slice(cursor) });
  return parts;
}

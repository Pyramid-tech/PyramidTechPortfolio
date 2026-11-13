import { FC, Fragment } from 'react';

import { parsePolicy, parsePolicyInline } from '@/lib/policy-markup';

const Inline: FC<{ text: string }> = ({ text }) => (
  <>
    {parsePolicyInline(text).map((part, i) => {
      if (part.type === 'bold') {
        return (
          <strong key={i} className="font-semibold text-text-1">
            {part.value}
          </strong>
        );
      }
      if (part.type === 'link') {
        return (
          <a
            key={i}
            href={part.href}
            className="break-words text-primary underline decoration-primary/40 underline-offset-4 transition hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {part.label}
          </a>
        );
      }
      return <Fragment key={i}>{part.value}</Fragment>;
    })}
  </>
);

const PolicyDocument: FC<{ source: string }> = ({ source }) => (
  <div className="flex flex-col gap-4 text-base leading-relaxed text-text-2">
    {parsePolicy(source).map((block, i) => {
      if (block.type === 'heading') {
        const Tag = block.level === 2 ? 'h2' : 'h3';
        return (
          <Tag
            key={i}
            className={
              block.level === 2
                ? 'mt-8 font-display text-2xl font-semibold leading-tight text-text-1 first:mt-0 md:text-3xl'
                : 'mt-4 font-display text-lg font-semibold leading-tight text-text-1 first:mt-0 md:text-xl'
            }
          >
            <Inline text={block.text} />
          </Tag>
        );
      }
      if (block.type === 'list') {
        return (
          <ul key={i} className="flex list-disc flex-col gap-2 pl-5 marker:text-text-3">
            {block.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={i} className="whitespace-pre-line">
          <Inline text={block.text} />
        </p>
      );
    })}
  </div>
);

export default PolicyDocument;

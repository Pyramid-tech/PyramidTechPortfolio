import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  title: string;
  as?: 'h1' | 'h2' | 'h3';
  classes?: string;
}

const SectionTitle: FC<Props> = ({ title, as: Tag = 'h2', classes, ...props }) => {
  return (
    <Tag
      className={cn(
        'font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
        classes,
      )}
      {...props}
    >
      {title}
    </Tag>
  );
};
export default SectionTitle;

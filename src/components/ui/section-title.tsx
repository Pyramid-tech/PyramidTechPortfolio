import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  title: string;
  classes?: string;
}

const SectionTitle: FC<Props> = ({ title, classes, ...props }) => {
  return (
    <h3 className={cn('text-5xl font-extrabold leading-none md:text-7xl lg:text-8xl', classes)} {...props}>
      {title}
    </h3>
  );
};
export default SectionTitle;

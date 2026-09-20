'use client';

import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  card: {
    title: string;
    description: string;
    services: string[];
    classes: string;
  };
}

const ServiceCard: FC<Props> = ({ card: { title, services, description, classes } }) => {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.6,
  });
  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 gap-6 px-6 py-10 md:grid-cols-2 md:gap-12 md:px-12 md:py-12 ${classes}`}
    >
      <div className="flex flex-col gap-5">
        <h3 className="font-display text-[1.75rem] font-light leading-tight md:text-4xl lg:text-5xl">
          {title}
        </h3>
        <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
          {services.map((service) => (
            <li
              key={service}
              className="flex items-center gap-2 text-sm font-semibold md:text-base"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {service}
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-[62ch] text-balance text-sm font-medium leading-relaxed text-text-2 md:self-center md:text-base lg:text-lg">
        {description}
      </p>
    </div>
  );
};
export default ServiceCard;

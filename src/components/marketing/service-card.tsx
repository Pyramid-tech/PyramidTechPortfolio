'use client';

import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  card: {
    title: string;
    description: string;
    services: string[][];
    number: string;
    classes: string;
  };
}

const ServiceCard: FC<Props> = ({ card: { title, services, description, number, classes } }) => {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.6,
  });
  return (
    <div ref={ref} key={number} className="px-6 pb-16 last:pb-24 md:px-12">
      <h4 className="mt-8 text-3xl font-light md:text-5xl lg:text-6xl">{title}</h4>
      <div className={`flex flex-col gap-6 pt-8 first:border-none md:flex-row md:gap-8 ${classes}`}>
        <div className="flex-1">
          <div className="flex flex-col gap-4 md:gap-5">
            {services.map((service: string[], i: number) => {
              return (
                <ul key={i} className="flex items-center gap-x-8 text-sm font-semibold md:text-lg">
                  {service.map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-white/40"></div>
                      <p>{s}</p>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>

        <div className="relative flex-1 ">
          <p className="relative z-[2000] line-clamp-4 text-balance text-sm font-medium leading-relaxed md:text-base lg:text-lg">
            {description}
          </p>
          <div className="absolute right-6 top-0 z-[1] text-right text-8xl font-extrabold tracking-wider text-gray-1 md:text-9xl">
            {number}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ServiceCard;

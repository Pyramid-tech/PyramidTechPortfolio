'use client';

import { FC } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props {
  card: any;
}

const Index: FC<Props> = ({ card: { title, services, description, number, classes } }) => {
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.6,
  });
  return (
    <div ref={ref} key={number} className="px-[6vw] pb-[9.5vw] last:pb-[13vw] md:px-[3vw]">
      <h4 className="text-[3.7vw] font-light md:mt-[3vw] md:text-[7vw]">{title}</h4>
      <div className={`flex items-start space-x-[3vw] pt-[3vw] first:border-none md:flex-col md:space-x-0 ${classes}`}>
        <div className="flex-1 md:mb-[2vw]">
          <div className="flex flex-wrap space-y-[2vw] md:space-y-[1.5vw]  ">
            {services.map((service: string[], i: number) => {
              return (
                <ul key={i} className="md: flex items-center space-x-[5vw] text-[1.7vw] font-semibold md:text-[3vw]">
                  {service.map((s) => (
                    <li key={s} className="flex items-center space-x-[0.6vw]">
                      <div className="h-[1.2vw] w-[1.2vw] rounded-full bg-[#fff]/40"></div>
                      <p>{s}</p>
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>

        <div className="relative flex-1 ">
          <p className="relative z-[2000] line-clamp-4 text-[1.5vw] font-medium leading-[1.7] md:mt-[3vw] md:text-balance md:text-[3vw] md:leading-[1.5]">
            {description}
          </p>
          <div className="absolute right-[6vw] top-[1.8vw] z-[1] text-right text-[16vw] font-extrabold tracking-[5%] text-gray-1 md:top-0 md:text-[28vw]">
            {number}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;

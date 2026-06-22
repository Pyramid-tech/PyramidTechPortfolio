import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';
import ServiceCard from '@/components/service-card';

import { CARDS } from '@/lib/constants';


const Services: FC = () => {
  return (
    <section id="services" className="relative border-t border-gray-1 py-[6vw] md:py-[4vw]">
      <SectionTitle title="SERVICES." classes="text-right px-[6vw] md:px-[3vw] pt-[3vw]" />
      {CARDS.map((card) => (
        <ServiceCard key={card.title} card={card} />
      ))}
    </section>
  );
};
export default Services;

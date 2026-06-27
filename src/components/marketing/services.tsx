import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';

import { CARDS } from '@/lib/constants';

import ServiceCard from './service-card';


const Services: FC = () => {
  return (
    <section id="services" className="relative border-t border-gray-1 py-16 md:py-24">
      <SectionTitle title="SERVICES." classes="text-right px-6 pt-8 md:px-12" />
      {CARDS.map((card) => (
        <ServiceCard key={card.title} card={card} />
      ))}
    </section>
  );
};
export default Services;

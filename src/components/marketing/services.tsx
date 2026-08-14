import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';

import type { HomeContent } from '@/types/home-content';

import ServiceCard from './service-card';

interface Props {
  content: HomeContent['services'];
}

const Services: FC<Props> = ({ content }) => {
  return (
    <section id="services" className="relative border-t border-gray-1 py-16 md:py-24">
      <SectionTitle title={content?.sectionTitle ?? ''} classes="px-6 md:px-12" />
      <div className="pt-4 md:pt-6">
        {(content?.cards ?? []).map((card, i) => (
          <ServiceCard
            key={i}
            card={{
              title: card.title ?? '',
              description: card.description ?? '',
              services: card.tags ?? [],
              classes: i === 0 ? '' : 'border-t border-gray-1/60',
            }}
          />
        ))}
      </div>
    </section>
  );
};
export default Services;

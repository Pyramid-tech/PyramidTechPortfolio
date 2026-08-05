import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import HoverCards from '@/components/ui/hover-cards';
import { First, Second, Third, Fourth, Fifth } from '@/components/icons/approach-icons';

import type { HomeContent } from '@/types/home-content';

// Icons stay in code (they're SVG components, not text); CMS cards are matched
// to an icon by position, cycling if editors add more than five steps.
const APPROACH_ICONS = [First, Second, Third, Fourth, Fifth];

interface Props {
  content: HomeContent['approach'];
}

const Approach: FC<Props> = ({ content }) => {
  const cards = (content?.cards ?? []).map((card, i) => ({
    title: card.title ?? '',
    description: card.description ?? '',
    icon: APPROACH_ICONS[i % APPROACH_ICONS.length],
  }));

  return (
    <section id="approach" className="border-t border-gray-1 bg-bg-1 py-16 pb-24 md:py-24">
      <SectionOpacity>
        <SectionTitle
          title={content?.sectionTitle ?? ''}
          classes="text-right px-6 pt-6 top-0 z-20 md:px-12"
        />
        <div className="px-6 pt-6 md:px-12">
          <HoverCards cards={cards} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Approach;

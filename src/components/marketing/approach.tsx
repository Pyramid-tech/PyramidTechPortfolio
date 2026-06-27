import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import HoverCards from '@/components/ui/hover-cards';

import { APPROACH_CARDS } from '@/lib/constants';


const Approach: FC = () => {
  return (
    <section id="approach" className="border-t border-gray-1 bg-bg-1 py-16 pb-24 md:py-24">
      <SectionOpacity>
        <SectionTitle title="APPROACH." classes="px-6 pt-6 top-0 z-20 md:px-12" />
        <div className="px-6 pt-6 md:px-12">
          <HoverCards cards={APPROACH_CARDS} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Approach;

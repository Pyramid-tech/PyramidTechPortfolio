import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import HoverCards from '@/components/ui/hover-cards';

import { APPROACH_CARDS } from '@/lib/constants';


const Approach: FC = () => {
  return (
    <section id="approach" className="border-t border-gray-1 bg-bg-1 py-[6vw]  pb-[12vw]">
      <SectionOpacity>
        <SectionTitle title="APPROACH." classes="px-[6vw] md:px-[3vw] pt-[2.5vw] top-0 z-20" />
        <div className="px-[6vw] pt-[2.5vw] md:px-[3vw]">
          <HoverCards cards={APPROACH_CARDS} />
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Approach;

import { FC } from 'react';

import SectionTitle from '@/components/ui/section-title';
import SectionOpacity from '@/components/ui/section-opacity';
import ProcessSteps from '@/components/ui/process-steps';
import { First, Second, Third, Fourth, Fifth } from '@/components/icons/approach-icons';

import type { HomeContent } from '@/types/home-content';

// Icons stay in code (they're SVG components, not text); CMS cards are matched
// to an icon by position, cycling if editors add more than five steps.
const APPROACH_ICONS = [First, Second, Third, Fourth, Fifth];

interface Props {
  content: HomeContent['approach'];
}

const Approach: FC<Props> = ({ content }) => {
  const steps = (content?.cards ?? []).map((card, i) => ({
    title: card.title ?? '',
    description: card.description ?? '',
    icon: APPROACH_ICONS[i % APPROACH_ICONS.length],
  }));

  return (
    <section id="approach" className="border-t border-gray-1 bg-bg-1 py-16 md:py-24">
      <SectionOpacity>
        <div className="flex flex-col gap-10 px-6 md:flex-row md:gap-16 md:px-12">
          <div className="md:w-[38%] md:shrink-0">
            <div className="md:sticky md:top-32">
              <SectionTitle title={content?.sectionTitle ?? ''} />
              {content?.intro ? (
                <p className="mt-5 max-w-[38ch] text-base leading-relaxed text-text-2 md:text-lg">
                  {content.intro}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex-1">
            <ProcessSteps steps={steps} />
          </div>
        </div>
      </SectionOpacity>
    </section>
  );
};
export default Approach;

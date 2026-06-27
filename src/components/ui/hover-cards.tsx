'use client';

import { FC, SVGProps, useState } from 'react';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  cards: { title: string; icon: FC<SVGProps<SVGSVGElement>>; description: string }[];
  wrapperClasses?: string;
  itemClasses?: string;
}

const HoverCards: FC<Props> = ({ cards, itemClasses, wrapperClasses }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', itemClasses)}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={cn('relative flex flex-col md:last:col-span-2', itemClasses)}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <AnimatePresence>
            {hoveredIdx === idx && (
              <motion.span
                className={cn('absolute inset-0 z-0 block h-full w-full rounded-2xl bg-stroke/50', wrapperClasses)}
                layoutId="cardHoverEffect"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.1, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="z-[1] h-full space-y-4 rounded-xl border border-stroke px-6 py-6">
            <div className="flex items-center gap-3">
              {<card.icon />}
              <h6 className="text-lg md:text-xl">{card.title}</h6>
            </div>
            <p className="text-sm font-light leading-relaxed md:text-base">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default HoverCards;

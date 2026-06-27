'use client';

import { FC, ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import { useIsCoarsePointer, usePrefersReducedMotion } from '@/hooks/use-media-query';

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

interface Props {
  children: ReactNode;
  classes?: string;
  offset?: ScrollOffset;
}

const ScrollFade: FC<Props> = ({ children, classes, offset }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset || ['end 0.9', 'start 0.9'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <motion.div className={classes} ref={container} style={{ opacity }}>
      {children}
    </motion.div>
  );
};

// The scroll-driven opacity fade runs a transform on every scroll frame. On
// touch devices and for users who prefer reduced motion we render a plain div
// instead, which unmounts the scroll listener entirely — the main scroll-jank
// source on low-end phones.
const SectionOpacity: FC<Props> = (props) => {
  const coarsePointer = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const lighten = coarsePointer || reducedMotion;

  if (lighten) return <div className={props.classes}>{props.children}</div>;
  return <ScrollFade {...props} />;
};

export default SectionOpacity;

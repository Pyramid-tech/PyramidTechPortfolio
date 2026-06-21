'use client';

import { FC, ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

interface Props {
  children: ReactNode;
  classes?: string;
  offset?: ScrollOffset;
}

const SectionOpacity: FC<Props> = ({ children, classes, offset }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: offset || ['end 0.9', 'start 0.9'],
    smooth: 0,
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <motion.div className={classes} ref={container} style={{ opacity }}>
      {children}
    </motion.div>
  );
};
export default SectionOpacity;

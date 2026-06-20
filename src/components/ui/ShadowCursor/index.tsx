'use client';

import { FC, useEffect } from 'react';

import initCursor from '@/shared/utils/useShadowCursor';

interface Props {}

const Index: FC<Props> = () => {
  useEffect(() => {
    initCursor();
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[-1] h-screen w-full ">
      <canvas id="fluid" className="h-full w-full" />
    </div>
  );
};
export default Index;

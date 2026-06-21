'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import SectionOpacity from '@/components/ui/section-opacity';
import Footer from '@/components/sections/footer';


const CallToAction: FC = () => {
  const router = useRouter();

  const handleFormToggle = () => {
    router.push('/book');
  };

  return (
    <SectionOpacity classes="flex flex-col justify-center h-screen">
      <div className=" mx-auto flex w-full max-w-[60vw] flex-1 flex-col items-center justify-center text-center md:max-w-[90%]">
        <h3 className="text-[4vw] font-medium md:text-[8vw]">LET&apos;S CONNECT</h3>
        <p className="mt-[0.6vw] text-[1.7vw] font-normal text-gray-300 md:text-[3.2vw] md:leading-[1.3]">
          Got an idea worth building? Tell us about it. We&apos;ll help you turn it into a smart, scalable product, from
          first concept to production. Let&apos;s make something great together.
        </p>
        <Button
          onClick={handleFormToggle}
          title="SUBMIT A REQUEST"
          classes="px-[1.8vw] py-[vw] w-[35vw] md:w-[45vw] min-h-[6vw] md:min-h-[8vw] text-[1.25vw] md:text-[2.25vw] bg-bg-1 hover:bg-bg-1/80"
          btnClasses="mt-[1.2vw]"
        />
      </div>

      <Footer />
    </SectionOpacity>
  );
};
export default CallToAction;

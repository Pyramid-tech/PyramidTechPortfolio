'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/button';
import SectionOpacity from '@/components/ui/section-opacity';

import Footer from './footer';


const CallToAction: FC = () => {
  const router = useRouter();

  const handleFormToggle = () => {
    router.push('/book');
  };

  return (
    <section id="contact">
      <SectionOpacity classes="flex flex-col">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center md:py-32">
          <h3 className="text-4xl font-medium md:text-7xl lg:text-8xl">LET&apos;S CONNECT</h3>
          <p className="mt-3 text-base font-normal leading-relaxed text-gray-300 md:text-xl">
            Got an idea worth building? Tell us about it. We&apos;ll help you turn it into a smart, scalable product,
            from first concept to production. Let&apos;s make something great together.
          </p>
          <Button
            onClick={handleFormToggle}
            title="SUBMIT A REQUEST"
            classes="bg-bg-1 hover:bg-bg-1/80"
            btnClasses="mt-6"
          />
        </div>

        <Footer />
      </SectionOpacity>
    </section>
  );
};
export default CallToAction;

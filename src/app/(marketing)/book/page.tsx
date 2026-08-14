import type { Metadata } from 'next';

import { BookForm } from '@/components/forms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Start a project',
  description:
    'Tell Pyramid about your project. We reply within two working days with a first take on scope, timeline and cost.',
  alternates: { canonical: '/book' },
};

const Index = () => {
  return (
    <section className="min-h-screen w-full bg-bg-1 px-4 pb-16 pt-28 sm:pb-24 sm:pt-32">
      <BookForm />
    </section>
  );
};
export default Index;

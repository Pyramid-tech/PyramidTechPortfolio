import { BookForm } from '@/components/forms';

export const dynamic = 'force-dynamic';

const Index = () => {
  return (
    <section className="min-h-screen w-full bg-bg-1 px-4 pb-12 pt-24 sm:pb-16 sm:pt-28">
      <BookForm />
    </section>
  );
};
export default Index;

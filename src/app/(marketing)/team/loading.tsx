import { TeamSkeleton } from '@/components/team';
import { Footer } from '@/components/marketing';

export default function TeamLoading() {
  return (
    <>
      <section className="min-h-screen w-full bg-bg-1 py-20 sm:py-24">
        <TeamSkeleton count={5} />
      </section>
      <Footer />
    </>
  );
}
